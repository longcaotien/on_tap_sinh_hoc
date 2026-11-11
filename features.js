// Tính năng thêm cho trang làm bài: ôn tập câu sai, lưu kết quả, bảng xếp hạng.
// - Dữ liệu luôn được lưu trên máy (localStorage).
// - Khi đã đăng nhập (auth-gate.js cung cấp window.bioCloud) thì đồng bộ thêm lên Firestore.
(function () {
    'use strict';

    var MAX_HISTORY = 30;
    var TOPIC_NAMES = { all: 'Cả 2 bài', b6: 'Bài 6', b8: 'Bài 8', wrong: 'Ôn câu sai' };

    var state = { wrong: {}, history: [], best: null, attempts: 0, ts: 0 };
    var uid = null;
    var reviewSet = {};
    var savedTopics = {};      // các bộ lọc đã ghi kết quả trong lượt làm hiện tại
    var syncTimer = null;

    var esc = function (v) {
        return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    var fmtScore = function (n) {
        return (typeof n === 'number' && isFinite(n)) ? n.toLocaleString('vi-VN', { maximumFractionDigits: 2 }) : '—';
    };
    var fmtDate = function (ms) {
        return ms ? new Date(ms).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
    };
    var round2 = function (n) { return Math.round(n * 100) / 100; };

    // ---------- Lưu trữ ----------
    function key() { return 'bm_progress_' + (uid || 'guest'); }

    function normalize(d) {
        var out = { wrong: {}, history: [], best: null, attempts: 0, ts: 0 };
        if (!d || typeof d !== 'object') return out;
        var w = Array.isArray(d.wrong) ? d.wrong : Object.keys(d.wrong || {});
        w.forEach(function (id) { if (typeof id === 'string' && id.length < 40) out.wrong[id] = true; });
        if (Array.isArray(d.history)) {
            out.history = d.history.filter(function (h) {
                return h && typeof h.s === 'number' && typeof h.at === 'number';
            }).slice(0, MAX_HISTORY);
        }
        if (typeof d.best === 'number') out.best = d.best;
        if (typeof d.attempts === 'number') out.attempts = d.attempts;
        if (typeof d.ts === 'number') out.ts = d.ts;
        return out;
    }

    function loadLocal() {
        try { state = normalize(JSON.parse(localStorage.getItem(key()) || 'null')); }
        catch (e) { state = normalize(null); }
    }

    function saveLocal() {
        state.ts = Date.now();
        try {
            localStorage.setItem(key(), JSON.stringify({
                wrong: Object.keys(state.wrong), history: state.history,
                best: state.best, attempts: state.attempts, ts: state.ts
            }));
        } catch (e) { /* hết chỗ lưu hoặc bị chặn: bỏ qua */ }
    }

    function scheduleSync() {
        if (!window.bioCloud || !uid) return;
        clearTimeout(syncTimer);
        syncTimer = setTimeout(pushCloud, 1500);
    }

    function pushCloud() {
        if (!window.bioCloud || !uid) return;
        window.bioCloud.saveProgress({
            wrong: Object.keys(state.wrong).slice(0, 200),
            history: state.history.slice(0, MAX_HISTORY),
            ts: state.ts || Date.now()
        }).catch(function () { /* mất mạng hoặc chưa cập nhật rules: dữ liệu vẫn còn trên máy */ });
    }

    // ---------- Hiển thị số liệu ----------
    function wrongCount() { return Object.keys(state.wrong).length; }

    function refreshUI() {
        var n = wrongCount();
        document.querySelectorAll('[data-wrong-count]').forEach(function (el) { el.textContent = n; });
        document.querySelectorAll('[data-best-score]').forEach(function (el) {
            el.textContent = state.best == null ? '—' : fmtScore(state.best) + '/10';
        });
        document.querySelectorAll('[data-attempt-count]').forEach(function (el) { el.textContent = state.attempts; });
    }

    // ---------- Hộp thoại dùng chung ----------
    var modal, modalTitle, modalBody, lastFocus;

    function buildModal() {
        modal = document.createElement('div');
        modal.id = 'fx-modal';
        modal.hidden = true;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'fx-modal-title');
        modal.style.cssText = 'position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:rgba(13,43,34,.45);padding:0;';
        modal.innerHTML =
            '<div id="fx-modal-card" style="background:#fff;width:100%;max-width:34rem;max-height:88vh;display:flex;flex-direction:column;border-radius:1.25rem 1.25rem 0 0;box-shadow:0 -10px 40px -10px rgba(0,0,0,.4);">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:1rem 1.1rem;border-bottom:1px solid #e6f1ea;">' +
                    '<h2 id="fx-modal-title" style="font-weight:800;font-size:1.05rem;color:#0d2b22;"></h2>' +
                    '<button id="fx-modal-close" type="button" aria-label="Đóng" style="width:2.75rem;height:2.75rem;border-radius:.75rem;background:#f1f5f2;color:#334a40;font-size:1rem;flex-shrink:0;"><i class="fa-solid fa-xmark"></i></button>' +
                '</div>' +
                '<div id="fx-modal-body" style="padding:1rem 1.1rem calc(1.1rem + env(safe-area-inset-bottom, 0px));overflow-y:auto;"></div>' +
            '</div>';
        var style = document.createElement('style');
        style.textContent =
            '#fx-modal[hidden]{display:none !important}' +
            '@media (min-width:640px){#fx-modal{align-items:center !important;padding:1.25rem !important}#fx-modal-card{border-radius:1.25rem !important}}' +
            '.fx-btn{min-height:2.75rem;padding:0 1rem;border-radius:.75rem;font-weight:700;font-size:.875rem;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;cursor:pointer}' +
            '.fx-btn-primary{background:#047857;color:#fff}.fx-btn-primary:hover{background:#065f46}' +
            '.fx-btn-soft{background:#ecf5ef;color:#0b7a58}.fx-btn-soft:hover{background:#d9ebdf}' +
            '.fx-btn-warn{background:#fff1f2;color:#be123c;border:1px solid #fecdd3}' +
            '.fx-row{display:flex;align-items:center;gap:.75rem;padding:.6rem .5rem;border-radius:.75rem}' +
            '.fx-row + .fx-row{border-top:1px solid #eef5f0}' +
            '.fx-row.me{background:#ecfdf5;border-top-color:transparent}' +
            '.fx-rank{width:2rem;text-align:center;font-weight:800;color:#5b7066;flex-shrink:0;font-variant-numeric:tabular-nums}' +
            '.fx-avatar{width:2.25rem;height:2.25rem;border-radius:999px;object-fit:cover;flex-shrink:0;background:#d1fae5;color:#065f46;font-weight:800;display:flex;align-items:center;justify-content:center}' +
            '.fx-muted{font-size:.8rem;color:#5b7066;line-height:1.5}';
        document.head.appendChild(style);
        document.body.appendChild(modal);
        modalTitle = modal.querySelector('#fx-modal-title');
        modalBody = modal.querySelector('#fx-modal-body');
        modal.querySelector('#fx-modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
        modalBody.addEventListener('click', function (e) {
            var b = e.target.closest('[data-fx]');
            if (!b) return;
            var act = b.getAttribute('data-fx');
            if (act === 'review') { closeModal(); startReview(); }
            else if (act === 'retry') { closeModal(); window.resetPractice(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            else if (act === 'rank') { openLeaderboard(); }
            else if (act === 'close') { closeModal(); }
            else if (act === 'clear-wrong') { b.hidden = true; modalBody.querySelector('#fx-clear-confirm').hidden = false; }
            else if (act === 'clear-wrong-no') { modalBody.querySelector('#fx-clear-confirm').hidden = true; modalBody.querySelector('[data-fx="clear-wrong"]').hidden = false; }
            else if (act === 'clear-wrong-yes') { state.wrong = {}; saveLocal(); scheduleSync(); refreshUI(); openHistory(); }
        });
    }

    function openModal(title, html) {
        if (!modal) buildModal();
        if (modal.hidden) lastFocus = document.activeElement;
        modalTitle.textContent = title;
        modalBody.innerHTML = html;
        modal.hidden = false;
        modalBody.scrollTop = 0;
        modal.querySelector('#fx-modal-close').focus();
    }

    function closeModal() {
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }

    // ---------- Ôn tập câu sai ----------
    function snapshotReview() {
        reviewSet = {};
        Object.keys(state.wrong).forEach(function (id) { reviewSet[id] = true; });
    }

    function startReview() {
        if (!wrongCount()) {
            openModal('Ôn tập câu sai',
                '<p style="font-weight:700;color:#0d2b22;">Chưa có câu sai nào.</p>' +
                '<p class="fx-muted" style="margin-top:.35rem;">Những câu bạn làm sai (hoặc bấm xem đáp án) trong chế độ Kiểm tra sẽ được gom lại ở đây. Làm đúng lại thì câu đó tự rời khỏi danh sách.</p>' +
                '<div style="margin-top:1rem;"><button type="button" class="fx-btn fx-btn-primary" data-fx="close">Đã hiểu</button></div>');
            return;
        }
        snapshotReview();
        window.clearAnswers();
        window.startTopic('wrong', 'practice');
    }

    // ---------- Ghi nhận kết quả từng câu ----------
    function record(qid, ok) {
        if (ok) delete state.wrong[qid]; else state.wrong[qid] = true;
        saveLocal();
        scheduleSync();
        refreshUI();
    }

    function onProgress(p) {
        if (!p.total || p.answered < p.total || savedTopics[p.topic]) return;
        savedTopics[p.topic] = true;

        var score = round2(p.score);
        var ranked = p.topic !== 'wrong';   // lượt ôn câu sai không tính vào bảng xếp hạng
        var isBest = false;

        state.history.unshift({ s: score, t: p.topic, n: p.total, at: Date.now() });
        state.history = state.history.slice(0, MAX_HISTORY);
        if (ranked) {
            state.attempts += 1;
            if (state.best == null || score > state.best) { state.best = score; isBest = true; }
        }
        saveLocal();
        refreshUI();
        pushCloud();
        if (ranked && window.bioCloud && uid) {
            window.bioCloud.saveScore(score).then(function (d) {
                if (d && typeof d.best === 'number') {
                    state.best = d.best; state.attempts = d.attempts || state.attempts;
                    saveLocal(); refreshUI();
                }
            }).catch(function () { /* không lưu được lên bảng xếp hạng: kết quả vẫn còn trên máy */ });
        }

        var left = wrongCount();
        openModal(ranked ? 'Hoàn thành lượt kiểm tra' : 'Đã ôn xong câu sai',
            '<div style="text-align:center;padding:.5rem 0 1rem;">' +
                '<div class="fx-muted">' + esc(TOPIC_NAMES[p.topic] || '') + ' · ' + p.total + ' câu</div>' +
                '<div style="font-size:2.75rem;font-weight:800;color:#047857;line-height:1.1;margin-top:.25rem;">' + fmtScore(score) + '<span style="font-size:1.1rem;color:#5b7066;">/10</span></div>' +
                (isBest ? '<div style="margin-top:.5rem;display:inline-block;font-size:.8rem;font-weight:700;padding:.25rem .7rem;border-radius:999px;background:#fef3c7;color:#92400e;">Điểm cao nhất của bạn</div>' : '') +
                '<p class="fx-muted" style="margin-top:.75rem;">' +
                    (left ? 'Còn <b style="color:#be123c;">' + left + ' câu sai</b> cần ôn lại.' : 'Không còn câu sai nào. Rất tốt!') +
                '</p>' +
            '</div>' +
            '<div style="display:grid;gap:.5rem;">' +
                (left ? '<button type="button" class="fx-btn fx-btn-primary" data-fx="review"><i class="fa-solid fa-rotate"></i> Ôn ' + left + ' câu sai</button>' : '') +
                (ranked ? '<button type="button" class="fx-btn fx-btn-soft" data-fx="rank"><i class="fa-solid fa-trophy"></i> Xem bảng xếp hạng</button>' : '') +
                (ranked ? '<button type="button" class="fx-btn fx-btn-soft" data-fx="retry"><i class="fa-solid fa-rotate-right"></i> Làm lại từ đầu</button>' : '') +
                '<button type="button" class="fx-btn fx-btn-soft" data-fx="close">Xem lại bài vừa làm</button>' +
            '</div>');
    }

    // ---------- Kết quả của tôi ----------
    function openHistory() {
        var rows = state.history.map(function (h) {
            return '<div class="fx-row">' +
                '<div style="flex:1;min-width:0;">' +
                    '<div style="font-weight:700;color:#0d2b22;">' + esc(TOPIC_NAMES[h.t] || 'Kiểm tra') + ' <span class="fx-muted">· ' + (h.n || '?') + ' câu</span></div>' +
                    '<div class="fx-muted">' + fmtDate(h.at) + '</div>' +
                '</div>' +
                '<div style="font-weight:800;color:#047857;font-variant-numeric:tabular-nums;">' + fmtScore(h.s) + '/10</div>' +
            '</div>';
        }).join('');
        var n = wrongCount();
        openModal('Kết quả của tôi',
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;text-align:center;">' +
                '<div style="background:#ecfdf5;border-radius:.75rem;padding:.7rem .3rem;"><div class="fx-muted">Cao nhất</div><div style="font-weight:800;font-size:1.2rem;color:#047857;">' + (state.best == null ? '—' : fmtScore(state.best)) + '</div></div>' +
                '<div style="background:#f1f5f2;border-radius:.75rem;padding:.7rem .3rem;"><div class="fx-muted">Lượt làm</div><div style="font-weight:800;font-size:1.2rem;color:#0d2b22;">' + state.attempts + '</div></div>' +
                '<div style="background:#fff1f2;border-radius:.75rem;padding:.7rem .3rem;"><div class="fx-muted">Câu sai</div><div style="font-weight:800;font-size:1.2rem;color:#be123c;">' + n + '</div></div>' +
            '</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.9rem;">' +
                (n ? '<button type="button" class="fx-btn fx-btn-primary" data-fx="review"><i class="fa-solid fa-rotate"></i> Ôn câu sai</button>' : '') +
                (n ? '<button type="button" class="fx-btn fx-btn-warn" data-fx="clear-wrong">Xoá danh sách câu sai</button>' : '') +
            '</div>' +
            '<div id="fx-clear-confirm" hidden style="margin-top:.6rem;padding:.8rem;border:1px solid #fecdd3;border-radius:.75rem;background:#fff7f7;">' +
                '<p style="font-size:.875rem;font-weight:600;color:#0d2b22;">Xoá toàn bộ ' + n + ' câu sai đã lưu?</p>' +
                '<div style="display:flex;gap:.5rem;margin-top:.6rem;">' +
                    '<button type="button" class="fx-btn fx-btn-soft" style="flex:1;" data-fx="clear-wrong-no">Giữ lại</button>' +
                    '<button type="button" class="fx-btn" style="flex:1;background:#be123c;color:#fff;" data-fx="clear-wrong-yes">Xoá</button>' +
                '</div>' +
            '</div>' +
            '<h3 style="margin-top:1.1rem;font-weight:800;font-size:.9rem;color:#0d2b22;">Các lượt đã hoàn thành</h3>' +
            (rows
                ? '<div style="margin-top:.4rem;">' + rows + '</div>'
                : '<p class="fx-muted" style="margin-top:.4rem;">Chưa có lượt nào. Vào chế độ Kiểm tra và làm hết các câu để ghi kết quả.</p>'));
    }

    // ---------- Bảng xếp hạng ----------
    function openLeaderboard() {
        var note = '<p class="fx-muted">Xếp theo điểm cao nhất của một lượt Kiểm tra đã làm hết câu (cả 2 bài hoặc từng bài). Lượt ôn câu sai không được tính.</p>';
        if (!window.bioCloud || !uid) {
            openModal('Bảng xếp hạng', note +
                '<p style="margin-top:.9rem;font-size:.9rem;color:#0d2b22;">Bảng xếp hạng cần đăng nhập Google. ' +
                (state.best == null ? '' : 'Điểm cao nhất của bạn trên máy này: <b>' + fmtScore(state.best) + '/10</b>.') + '</p>');
            return;
        }
        openModal('Bảng xếp hạng', note + '<p style="margin-top:.9rem;font-size:.9rem;color:#5b7066;"><i class="fa-solid fa-circle-notch fa-spin"></i> Đang tải...</p>');
        window.bioCloud.loadLeaderboard().then(function (list) {
            if (modal.hidden || modalTitle.textContent !== 'Bảng xếp hạng') return;
            if (!list.length) {
                modalBody.innerHTML = note + '<p style="margin-top:.9rem;font-size:.9rem;color:#0d2b22;">Chưa có ai trên bảng. Hãy là người đầu tiên: làm hết một lượt Kiểm tra.</p>';
                return;
            }
            var medals = ['🥇', '🥈', '🥉'];
            var meIn = false;
            var rows = list.map(function (r, i) {
                var me = r.id === uid;
                if (me) meIn = true;
                var name = r.name || 'Bạn học';
                var avatar = r.photoURL
                    ? '<img class="fx-avatar" src="' + esc(r.photoURL) + '" alt="" referrerpolicy="no-referrer">'
                    : '<div class="fx-avatar">' + esc(name.trim().charAt(0).toUpperCase()) + '</div>';
                return '<div class="fx-row' + (me ? ' me' : '') + '">' +
                    '<div class="fx-rank">' + (medals[i] || (i + 1)) + '</div>' + avatar +
                    '<div style="flex:1;min-width:0;">' +
                        '<div style="font-weight:700;color:#0d2b22;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(name) + (me ? ' <span class="fx-muted">(bạn)</span>' : '') + '</div>' +
                        '<div class="fx-muted">' + (r.attempts || 0) + ' lượt làm</div>' +
                    '</div>' +
                    '<div style="font-weight:800;color:#047857;font-variant-numeric:tabular-nums;">' + fmtScore(r.best) + '</div>' +
                '</div>';
            }).join('');
            modalBody.innerHTML = note + '<div style="margin-top:.7rem;">' + rows + '</div>' +
                (meIn ? '' : '<p class="fx-muted" style="margin-top:.8rem;">' +
                    (state.best == null ? 'Bạn chưa có điểm. Làm hết một lượt Kiểm tra để lên bảng.' : 'Bạn chưa vào top ' + list.length + '. Điểm cao nhất của bạn: <b>' + fmtScore(state.best) + '/10</b>.') + '</p>');
        }).catch(function (e) {
            if (modal.hidden) return;
            modalBody.innerHTML = note + '<p style="margin-top:.9rem;font-size:.9rem;color:#be123c;">' +
                (e && e.code === 'permission-denied'
                    ? 'Chưa mở được bảng xếp hạng: người quản lý cần cập nhật firestore.rules mới trong Firebase.'
                    : 'Không tải được bảng xếp hạng. Kiểm tra mạng rồi thử lại.') + '</p>';
        });
    }

    // ---------- Báo hoạt động hiện tại cho trang quản lý ----------
    // Gửi tối đa 4 giây/lần khi có thay đổi (để quản lý xem gần như trực tiếp), và nhắc lại mỗi phút khi tab đang mở.
    var PRESENCE_GAP = 4000, PRESENCE_BEAT = 60000;
    var activityNow = { mode: 'home' };
    var presenceSentAt = 0, presenceTimer = null, presenceLast = '';

    function sendPresence() {
        clearTimeout(presenceTimer); presenceTimer = null;
        if (!window.bioCloud || !uid || !window.bioCloud.savePresence) return;
        if (document.visibilityState === 'hidden') return;
        var a = activityNow;
        var data = { mode: a.mode === 'study' || a.mode === 'practice' ? a.mode : 'home' };
        if (data.mode !== 'home') {
            data.topic = String(a.topic || 'all').slice(0, 10);
            data.answered = a.answered | 0;
            data.total = a.total | 0;
            data.score = round2(Math.max(0, Math.min(10, +a.score || 0)));
            data.cur = String(a.cur || '').slice(0, 40);
            if (a.ans) data.ans = a.ans;   // đáp án đã chọn, để quản lý xem lại đúng màn hình
        }
        presenceSentAt = Date.now();
        presenceLast = JSON.stringify(data);
        window.bioCloud.savePresence(data).catch(function () { /* chưa cập nhật rules hoặc mất mạng */ });
    }

    function activity(a) {
        activityNow = a || { mode: 'home' };
        if (!uid) return;
        var wait = PRESENCE_GAP - (Date.now() - presenceSentAt);
        if (wait <= 0) sendPresence();
        else if (!presenceTimer) presenceTimer = setTimeout(sendPresence, wait);
    }

    setInterval(function () {
        if (uid && Date.now() - presenceSentAt >= PRESENCE_BEAT) sendPresence();
    }, 15000);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && uid && Date.now() - presenceSentAt >= PRESENCE_GAP) sendPresence();
    });

    // ---------- Đồng bộ khi đăng nhập / đăng xuất ----------
    function onUser() {
        var c = window.bioCloud;
        uid = c && c.uid ? c.uid : null;
        loadLocal();
        refreshUI();
        if (!uid) return;
        presenceSentAt = 0;
        sendPresence();
        var forUid = uid;
        c.loadProgress().then(function (cloud) {
            if (uid !== forUid) return;
            if (cloud && cloud.progress && (cloud.progress.ts || 0) > state.ts) {
                var n = normalize(cloud.progress);
                state.wrong = n.wrong; state.history = n.history; state.ts = n.ts;
            }
            if (cloud && cloud.score && typeof cloud.score.best === 'number') {
                state.best = state.best == null ? cloud.score.best : Math.max(state.best, cloud.score.best);
                state.attempts = Math.max(state.attempts, cloud.score.attempts || 0);
            }
            var ts = state.ts;
            saveLocal();
            if (!cloud || !cloud.progress || (cloud.progress.ts || 0) < ts) pushCloud();
            refreshUI();
        }).catch(function () { /* chưa cập nhật rules hoặc mất mạng: dùng dữ liệu trên máy */ });
    }

    window.bioFx = {
        inReview: function (qid) { return !!reviewSet[qid]; },
        snapshotReview: snapshotReview,
        newAttempt: function () { savedTopics = {}; },
        record: record,
        onProgress: onProgress,
        activity: activity,
        startReview: startReview,
        openLeaderboard: openLeaderboard,
        openHistory: openHistory
    };

    window.addEventListener('bio:user', onUser);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onUser); else onUser();
})();
