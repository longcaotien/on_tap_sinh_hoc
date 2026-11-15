'use strict';
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { validateBank, createPaper, publicQuestion, validChoice, grade, randomUUID } = require('./exam-logic');
initializeApp();
const db = getFirestore();
const region = 'asia-southeast1';
const options = { region, maxInstances: 10, memory: '256MiB' };
const DURATION = 25 * 60 * 1000;
const COOLDOWN = 60 * 1000;
const MAX_DAY = 5;

function uidOf(request) {
  if (!request.auth || !request.auth.uid || request.auth.token.firebase?.sign_in_provider !== 'google.com') {
    throw new HttpsError('unauthenticated', 'Hãy đăng nhập tài khoản Google trước khi làm đề.');
  }
  return request.auth.uid;
}
function view(s) {
  if (!s || s.status !== 'active') return { status: s?.status || 'none' };
  return { status: 'active', id: s.id, index: s.index, total: s.paper.length,
    warnings: s.warnings, warningLimit: s.warningLimit, aiWatch: s.aiWatch,
    endsAt: s.endsAt, question: s.index < s.paper.length ? publicQuestion(s.paper[s.index], s.index) : null };
}
function assertActive(s, data) {
  if (!s || s.id !== data?.id || s.status !== 'active') throw new HttpsError('failed-precondition', 'Phiên thi đã kết thúc hoặc không tồn tại.');
  if (Date.now() >= s.endsAt) throw new HttpsError('deadline-exceeded', 'Đã hết thời gian làm bài.');
}

exports.startSecureExam = onCall(options, async request => {
  const uid = uidOf(request);
  const userRef = db.doc(`users/${uid}`);
  const settingsRef = db.doc('settings/site');
  const sessionRef = db.doc(`examSessions/${uid}`);
  const bankRef = db.doc('examBank/current');
  return db.runTransaction(async tx => {
    const [userDoc, siteDoc, snap, bankDoc] = await Promise.all([tx.get(userRef), tx.get(settingsRef), tx.get(sessionRef), tx.get(bankRef)]);
    if (!userDoc.exists || userDoc.data().blocked) throw new HttpsError('permission-denied', 'Tài khoản chưa được cấp quyền hoặc đang bị chặn.');
    const settings = siteDoc.data() || {};
    if (settings.maintenance === true) throw new HttpsError('unavailable', 'Trang đang bảo trì.');
    const old = snap.data();
    if (old?.status === 'active' && Date.now() < old.endsAt) return view(old); // tải lại: tiếp tục, không bốc đề mới
    const now = Date.now();
    if (old && now - old.startedAt < COOLDOWN) throw new HttpsError('resource-exhausted', 'Hãy chờ ít nhất một phút trước khi tạo đề mới.');
    const day = new Date(now).toISOString().slice(0, 10);
    const count = old?.day === day ? old.dayCount || 0 : 0;
    if (count >= MAX_DAY) throw new HttpsError('resource-exhausted', 'Đã hết 5 lượt bắt đầu đề hôm nay (theo giờ UTC).');
    if (!bankDoc.exists) throw new HttpsError('failed-precondition', 'Chưa nhập ngân hàng đề riêng trong trang quản lý.');
    let bank;
    try { bank = validateBank(bankDoc.data().questions); }
    catch (err) { throw new HttpsError('failed-precondition', err.message); }
    const next = {
      id: randomUUID(), paper: createPaper(bank), answers: [], index: 0,
      warnings: 0, warningLimit: Number.isInteger(settings.warningLimit) && settings.warningLimit >= 1 && settings.warningLimit <= 10 ? settings.warningLimit : 3,
      aiWatch: settings.aiWatch === true, status: 'active', startedAt: now, endsAt: now + DURATION,
      day, dayCount: count + 1, lastSignalAt: 0, lastSignalId: '', updatedAt: FieldValue.serverTimestamp()
    };
    tx.set(sessionRef, next);
    return view(next);
  });
});

exports.submitSecureAnswer = onCall(options, async request => {
  const uid = uidOf(request);
  const { id, index, choice } = request.data || {};
  if (typeof id !== 'string' || !Number.isInteger(index))
    throw new HttpsError('invalid-argument', 'Lựa chọn không hợp lệ.');
  const sessionRef = db.doc(`examSessions/${uid}`);
  const scoreRef = db.doc(`secureScores/${uid}`);
  const userRef = db.doc(`users/${uid}`);
  return db.runTransaction(async tx => {
    const [snap, userSnap] = await Promise.all([tx.get(sessionRef), tx.get(userRef)]);
    const s = snap.data();
    assertActive(s, { id });
    if (!userSnap.exists || userSnap.data().blocked) throw new HttpsError('permission-denied', 'Tài khoản bị chặn.');
    if (index !== s.index) throw new HttpsError('failed-precondition', 'Câu hỏi đã được trả lời. Tải lại trang để đồng bộ.');
    if (!validChoice(s.paper[index], choice)) throw new HttpsError('invalid-argument', 'Vui lòng trả lời đúng định dạng của câu hỏi.');
    const nextAnswers = [...s.answers, choice];
    const nextIndex = index + 1;
    if (nextIndex < s.paper.length) {
      tx.update(sessionRef, { answers: nextAnswers, index: nextIndex, updatedAt: FieldValue.serverTimestamp() });
      return view({ ...s, answers: nextAnswers, index: nextIndex });
    }
    const scoreSnap = await tx.get(scoreRef); // tất cả đọc trước khi ghi trong transaction
    const old = scoreSnap.data() || {};
    const result = grade(s.paper, nextAnswers);
    const now = Date.now();
    const name = String(userSnap.data().name || 'Bạn học').slice(0, 80);
    const photoURL = String(userSnap.data().photoURL || '').slice(0, 500);
    tx.update(sessionRef, { answers: nextAnswers, index: nextIndex, status: 'finished', score: result.score, correct: result.correct, finishedAt: now, updatedAt: FieldValue.serverTimestamp() });
    tx.set(scoreRef, {
      name, photoURL, best: Math.max(Number(old.best) || 0, result.score),
      bestAt: result.score > (Number(old.best) || 0) || !old.bestAt ? FieldValue.serverTimestamp() : old.bestAt,
      attempts: (Number(old.attempts) || 0) + 1, lastScore: result.score, lastAt: FieldValue.serverTimestamp()
    });
    tx.create(db.doc(`examResults/${uid}/attempts/${s.id}`), {
      score: result.score, correct: result.correct, total: s.paper.length, warnings: s.warnings,
      startedAt: s.startedAt, finishedAt: now, createdAt: FieldValue.serverTimestamp()
    });
    return { status: 'finished', ...result, total: s.paper.length, warnings: s.warnings };
  });
});

exports.reportSecureSignal = onCall(options, async request => {
  const uid = uidOf(request);
  const { id, eventId, reason } = request.data || {};
  if (typeof eventId !== 'string' || !/^[a-f0-9-]{36}$/i.test(eventId) || !['hidden', 'blur', 'leave'].includes(reason))
    throw new HttpsError('invalid-argument', 'Tín hiệu không hợp lệ.');
  const ref = db.doc(`examSessions/${uid}`);
  return db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const s = snap.data();
    assertActive(s, { id });
    if (reason === 'blur' && !s.aiWatch) return { warnings: s.warnings, warningLimit: s.warningLimit, status: 'active' };
    if (s.lastSignalId === eventId || Date.now() - s.lastSignalAt < 1500) return { warnings: s.warnings, warningLimit: s.warningLimit, status: 'active' };
    const warnings = s.warnings + 1;
    const status = warnings >= s.warningLimit ? 'stopped' : 'active';
    tx.update(ref, { warnings, status, lastSignalAt: Date.now(), lastSignalId: eventId, updatedAt: FieldValue.serverTimestamp() });
    return { warnings, warningLimit: s.warningLimit, status };
  });
});

exports.leaveSecureExam = onCall(options, async request => {
  const uid = uidOf(request);
  const ref = db.doc(`examSessions/${uid}`);
  return db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const s = snap.data();
    if (s?.id !== request.data?.id) throw new HttpsError('failed-precondition', 'Không tìm thấy phiên thi.');
    if (s.status === 'active') tx.update(ref, { status: 'abandoned', updatedAt: FieldValue.serverTimestamp() });
    return { status: 'abandoned' };
  });
});

// Đọc tiếp phiên thi sau khi tải lại hoặc đồng bộ khi phản hồi mạng bị mất.
exports.getSecureExam = onCall(options, async request => {
  const uid = uidOf(request);
  const [user, snap] = await Promise.all([db.doc(`users/${uid}`).get(), db.doc(`examSessions/${uid}`).get()]);
  if (!user.exists || user.data().blocked) throw new HttpsError('permission-denied', 'Tài khoản bị chặn.');
  const s = snap.data();
  if (!s) return { status: 'none' };
  if (s.status === 'active' && Date.now() >= s.endsAt) return { status: 'expired' };
  if (s.status === 'finished') return { status: 'finished', score: s.score, correct: s.correct, total: s.paper.length, warnings: s.warnings };
  return view(s);
});
