// Đề thi được cấp và chấm qua Firebase Functions; không dùng questions.js để chấm điểm.
import { getApps, getApp, initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js';

const $ = id => document.getElementById(id);
const cfg = window.BIO_FIREBASE;
let session = null, busy = false, lastSignalAt = 0, userId = null;
let app, startCall, submitCall, signalCall, leaveCall, getCall;
if (cfg && cfg.apiKey && !/^DIEN_/.test(cfg.apiKey)) {
  app = getApps().length ? getApp() : initializeApp(cfg);
  const fn = getFunctions(app, 'asia-southeast1');
  startCall = httpsCallable(fn, 'startSecureExam');
  submitCall = httpsCallable(fn, 'submitSecureAnswer');
  signalCall = httpsCallable(fn, 'reportSecureSignal');
  leaveCall = httpsCallable(fn, 'leaveSecureExam');
  getCall = httpsCallable(fn, 'getSecureExam');
  onAuthStateChanged(getAuth(app), async user => {
    userId = user?.uid || null;
    if (!userId) { session = null; hide(); return; }
    try {
      const r = (await getCall()).data;
      if (userId === user.uid && r.status === 'active' && document.body.dataset.auth !== 'blocked') show(r);
    } catch (_) { /* trang ôn tập vẫn chạy nếu chưa deploy functions */ }
  });
}

function message(text) { $('secure-message').textContent = text; }
function show(s) {
  session = s;
  document.body.dataset.mode = 'secure';
  $('view-home').classList.add('hidden');
  $('view-questions').classList.add('hidden');
  $('secure-view').classList.remove('hidden');
  message(''); render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function hide() {
  $('secure-view').classList.add('hidden');
  $('view-home').classList.remove('hidden');
  $('view-questions').classList.add('hidden');
  if (typeof window.switchMainView === 'function') window.switchMainView('home');
}
function render() {
  if (!session) return;
  const box = $('secure-question');
  box.replaceChildren();
  $('secure-progress').textContent = session.status === 'active' ? `Câu ${session.index + 1}/${session.total}` : 'Đề đã kết thúc';
  $('secure-warning').textContent = session.status === 'active'
    ? `Cảnh báo: ${session.warnings}/${session.warningLimit}. ${session.aiWatch ? 'Theo dõi chuyển tab và mất tiêu điểm.' : 'Theo dõi chuyển tab.'} Rời trang có thể bị ghi nhận; mạng gián đoạn có thể khiến tín hiệu không gửi được.`
    : 'Đề đã kết thúc. Hãy bấm Thoát đề để trở về trang chủ.';
  if (session.status !== 'active') {
    const h = document.createElement('h3'); h.className = 'text-xl font-extrabold text-slate-800';
    h.textContent = session.status === 'finished' ? `Hoàn thành · ${session.score}/10 · đúng ${session.correct}/${session.total} câu` : 'Bài kiểm tra đã dừng hoặc hết thời gian.';
    box.append(h); $('secure-leave').textContent = 'Về trang chủ'; return;
  }
  $('secure-leave').textContent = 'Thoát đề';
  const q = session.question;
  if (!q || !Array.isArray(q.options)) { message('Không tải được câu hỏi. Hãy tải lại trang.'); return; }
  const tag = document.createElement('p'); tag.className = 'text-xs font-bold uppercase tracking-wider text-indigo-700';
  tag.textContent = (q.topic === 'b6' ? 'Bài 6 · Hô hấp thực vật' : 'Bài 8 · Dinh dưỡng và tiêu hóa');
  const h = document.createElement('h3'); h.className = 'text-lg sm:text-xl font-extrabold text-slate-900 mt-3 leading-relaxed'; h.textContent = q.text;
  const list = document.createElement('div'); list.className = 'grid gap-3 mt-6';
  q.options.forEach((text, i) => {
    const button = document.createElement('button'); button.type = 'button';
    button.className = 'w-full min-h-14 p-4 text-left rounded-xl border-2 border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-500 focus-visible:outline-4 focus-visible:outline-indigo-300 transition-colors font-semibold text-slate-800';
    button.textContent = `${'ABCD'[i]}. ${text}`;
    button.addEventListener('click', () => choose(i)); list.append(button);
  });
  box.append(tag, h, list);
}
function tick() {
  if (!session || session.status !== 'active') { $('secure-timer').textContent = ''; return; }
  const seconds = Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
  $('secure-timer').textContent = `Còn ${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  if (!seconds) { session.status = 'expired'; render(); }
}
setInterval(tick, 1000);
async function sync() {
  if (!getCall || !userId) return;
  try {
    const r = (await getCall()).data;
    if (r.status !== 'none') show(r);
  } catch (_) { message('Không thể đồng bộ với máy chủ. Kiểm tra mạng rồi tải lại trang.'); }
}
async function choose(choice) {
  if (busy || session?.status !== 'active') return;
  busy = true; message('Đang lưu câu trả lời...');
  try {
    const result = (await submitCall({ id: session.id, index: session.index, choice })).data;
    show(result);
  } catch (err) {
    message('Không lưu được câu trả lời (' + (err.code || 'lỗi kết nối') + '). Đang đồng bộ lại...');
    await sync();
  } finally { busy = false; }
}
async function start() {
  if (busy) return;
  if (!userId || document.body.dataset.auth !== 'ok') { alert('Đăng nhập Google để bắt đầu đề thi bảo vệ.'); return; }
  busy = true;
  try { show((await startCall()).data); }
  catch (err) {
    alert(err.code === 'functions/not-found' || err.code === 'functions/internal'
      ? 'Chưa triển khai Firebase Functions hoặc cấu hình sai vùng. Xem FIREBASE_SETUP.md.'
      : (err.message || 'Không tạo được đề. Kiểm tra mạng rồi thử lại.'));
  } finally { busy = false; }
}
async function exit() {
  if (busy) return;
  if (session?.status === 'active' && !confirm('Bỏ đề hiện tại? Lượt bắt đầu đã được tính, tiến độ sẽ không được chấm.')) return;
  if (session?.status === 'active') {
    busy = true;
    try { await leaveCall({ id: session.id }); }
    catch (_) { busy = false; message('Không thể thoát an toàn vì mất kết nối. Hãy thử lại.'); return; }
    busy = false;
  }
  session = null; hide();
}
$('secure-leave').addEventListener('click', exit);
function notice() { message('Đang làm đề: hãy bấm “Thoát đề” để rời chế độ kiểm tra.'); $('secure-view').scrollIntoView({ behavior: 'smooth' }); }
window.secureExam = { start, active: () => session?.status === 'active', notice };

// Tín hiệu chỉ phản ánh hành vi trang quan sát được. Không thể phát hiện AI/cửa sổ khác đáng tin cậy.
async function signal(reason) {
  if (!session || session.status !== 'active' || (reason === 'blur' && !session.aiWatch)) return;
  if (Date.now() - lastSignalAt < 1700) return; // hidden và blur có thể xảy ra cùng lúc
  lastSignalAt = Date.now();
  const id = session.id;
  try {
    const result = (await signalCall({ id, reason, eventId: crypto.randomUUID() })).data;
    if (!session || session.id !== id || session.status !== 'active') return;
    session.warnings = result.warnings;
    session.status = result.status;
    render();
    alert(result.status === 'stopped'
      ? `Đã đạt ${result.warningLimit} cảnh báo. Đề đã dừng trên máy chủ.`
      : `Cảnh báo ${result.warnings}/${result.warningLimit}: trang kiểm tra đã ${reason === 'hidden' ? 'bị ẩn' : 'mất tiêu điểm'}.`);
  } catch (_) { /* pagehide, mất mạng: không được khẳng định cảnh báo đã được ghi */ }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) signal('hidden'); });
window.addEventListener('blur', () => {
  if (session?.aiWatch && !document.hidden) setTimeout(() => { if (!document.hasFocus()) signal('blur'); }, 500);
});
window.addEventListener('beforeunload', event => {
  if (session?.status === 'active') { event.preventDefault(); event.returnValue = ''; }
});
window.addEventListener('pageshow', e => { if (e.persisted && session?.status === 'active') sync(); });
