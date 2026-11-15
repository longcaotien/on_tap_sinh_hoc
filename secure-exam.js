// Đề luyện miễn phí trên GitHub Pages. Không có máy chủ: câu hỏi, đáp án, điểm và cảnh báo
// đều có thể xem/sửa trong trình duyệt. Không dùng để xác nhận điểm thi hoặc phát hiện AI.
const $ = id => document.getElementById(id);
const core = window.BioFreeExam;
const raw = window.bioExamSource;
function plain(html) {
  const doc = new DOMParser().parseFromString(String(html).replace(/<br\s*\/?\s*>/gi, ' — '), 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}
const bank = [
  ...raw.mcq.map(q => ({ id: q.uid, topic: q.topic, type: 'mcq', text: plain(q.question),
    options: q.options.map(plain), answer: q.correct, ...(q.hasSeedSVG ? { diagram: 'seedExperiment' } : {}) })),
  ...raw.tf.map(q => ({ id: q.uid, topic: q.topic, type: 'tf', text: plain(q.prompt),
    statements: q.statements.map(st => plain(st.text)), answer: q.statements.map(st => st.isTrue),
    ...(q.diagramType ? { diagram: q.diagramType } : {}) })),
  ...raw.sa.map(q => ({ id: q.uid, topic: q.topic, type: 'sa', text: plain(q.question),
    items: q.items.map(item => plain(item.text)), maxChoices: q.maxChoices, answer: q.correctAnswer }))
];
let session = null, storageKey = '', lastSignalAt = 0;
function key() { return 'bm_free_exam_' + (window.bioCloud?.uid || 'guest'); }
function save() {
  try { if (session) localStorage.setItem(storageKey, JSON.stringify(session)); } catch (_) { /* chế độ riêng tư/hết bộ nhớ */ }
}
function load() {
  const nextKey = key();
  if (nextKey === storageKey) return;
  storageKey = nextKey; session = null;
  try {
    const s = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (s && Array.isArray(s.paper) && s.paper.length === 20 && Array.isArray(s.answers) &&
        Number.isInteger(s.index) && s.index >= 0 && s.index <= 20 &&
        ['active', 'finished', 'stopped', 'expired', 'abandoned'].includes(s.status)) session = s;
  } catch (_) { /* không có lượt lưu */ }
  if (session?.status === 'active') {
    if (Date.now() >= session.endsAt) { session.status = 'expired'; save(); }
    else { show(); return; }
  }
  hide();
}
function message(text) { $('secure-message').textContent = text; }
function show() {
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
  $('secure-progress').textContent = session.status === 'active' ? `Câu ${session.index + 1}/${session.paper.length}` : 'Đề đã kết thúc';
  $('secure-warning').textContent = session.status === 'active'
    ? `Cảnh báo trên thiết bị: ${session.warnings}/${session.warningLimit}. ${session.aiWatch ? 'Theo dõi chuyển tab và mất tiêu điểm.' : 'Theo dõi chuyển tab.'} Đây không phải bằng chứng dùng AI hay kết quả thi được xác thực.`
    : 'Đề đã kết thúc. Hãy bấm Thoát đề để trở về trang chủ.';
  if (session.status !== 'active') {
    const h = document.createElement('h3'); h.className = 'text-xl font-extrabold text-slate-800';
    h.textContent = session.status === 'finished' ? `Hoàn thành · ${session.score}/10 · đúng ${session.correct}/${session.paper.length} câu (điểm trên thiết bị)` : 'Lượt này đã dừng hoặc hết thời gian.';
    box.append(h); $('secure-leave').textContent = 'Về trang chủ'; return;
  }
  $('secure-leave').textContent = 'Thoát đề';
  const q = core.getQuestion(bank, session.paper[session.index], session.index);
  if (!q || !['mcq', 'tf', 'sa'].includes(q.type)) { message('Không tải được câu hỏi. Hãy tải lại trang.'); return; }
  const tag = document.createElement('p'); tag.className = 'text-xs font-bold uppercase tracking-wider text-indigo-700';
  tag.textContent = `${q.topic === 'b6' ? 'Bài 6 · Hô hấp thực vật' : 'Bài 8 · Dinh dưỡng và tiêu hóa'} · ${ {mcq: 'ABCD', tf: 'Đúng / Sai', sa: 'Trả lời ngắn'}[q.type] }`;
  const h = document.createElement('h3'); h.className = 'text-lg sm:text-xl font-extrabold text-slate-900 mt-3 leading-relaxed'; h.textContent = q.text;
  box.append(tag, h);
  // Sơ đồ là tài nguyên tĩnh tin cậy sẵn có trong questions.js.
  const diagrams = { seedExperiment: window.getSeedExperimentSVG, potatoGraph: window.getPotatoGraphSVG, digestiveSystem: window.getDigestiveSystemSVG };
  if (q.diagram && typeof diagrams[q.diagram] === 'function') {
    const figure = document.createElement('div');
    figure.className = 'my-4 max-w-xl mx-auto';
    figure.innerHTML = diagrams[q.diagram]();
    box.append(figure);
  }
  const list = document.createElement('div'); list.className = 'grid gap-3 mt-6';
  if (q.type === 'mcq') {
    q.options.forEach((text, i) => {
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'w-full min-h-14 p-4 text-left rounded-xl border-2 border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-500 focus-visible:outline-4 focus-visible:outline-indigo-300 transition-colors font-semibold text-slate-800';
      button.textContent = `${'ABCD'[i]}. ${text}`;
      button.addEventListener('click', () => choose(i)); list.append(button);
    });
  } else if (q.type === 'tf') {
    q.statements.forEach((text, i) => {
      const row = document.createElement('fieldset'); row.className = 'border border-slate-200 bg-white rounded-xl p-4';
      const title = document.createElement('legend'); title.className = 'font-semibold text-slate-800 px-1';
      title.textContent = `${'abcd'[i]}) ${text}`;
      row.append(title);
      [true, false].forEach(value => {
        const label = document.createElement('label'); label.className = 'inline-flex items-center gap-2 mr-6 mt-2 cursor-pointer text-sm font-semibold';
        const input = document.createElement('input'); input.type = 'radio'; input.name = `secure-tf-${i}`; input.value = String(value);
        input.className = 'w-5 h-5 accent-indigo-700';
        label.append(input, document.createTextNode(value ? 'Đúng' : 'Sai')); row.append(label);
      });
      list.append(row);
    });
    const submit = document.createElement('button'); submit.type = 'button';
    submit.className = 'rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold p-3 mt-3';
    submit.textContent = 'Nộp 4 ý Đúng / Sai';
    submit.addEventListener('click', () => {
      const values = q.statements.map((_, i) => list.querySelector(`input[name="secure-tf-${i}"]:checked`)?.value);
      if (values.some(v => v === undefined)) { message('Hãy chọn Đúng hoặc Sai cho cả 4 ý.'); return; }
      choose(values.map(v => v === 'true'));
    }); list.append(submit);
  } else {
    q.items.forEach(text => {
      const item = document.createElement('p'); item.className = 'p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800';
      item.textContent = text; list.append(item);
    });
    const prompt = document.createElement('p'); prompt.className = 'font-bold mt-3'; prompt.textContent = 'Chọn số lượng đúng:'; list.append(prompt);
    const buttons = document.createElement('div'); buttons.className = 'flex flex-wrap gap-2';
    for (let n = 1; n <= q.maxChoices; n++) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = String(n);
      button.className = 'w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-800 font-extrabold hover:bg-indigo-700 hover:text-white';
      button.addEventListener('click', () => choose(n)); buttons.append(button);
    }
    list.append(buttons);
  }
  box.append(list);
}

function tick() {
  if (!session || session.status !== 'active') { $('secure-timer').textContent = ''; return; }
  const seconds = Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000));
  $('secure-timer').textContent = `Còn ${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  if (!seconds) { session.status = 'expired'; save(); render(); }
}
setInterval(tick, 1000);
function choose(choice) {
  if (session?.status !== 'active') return;
  const q = bank.find(x => x.id === session.paper[session.index].id);
  if (!q || !core.validChoice(q, choice)) { message('Lựa chọn không hợp lệ.'); return; }
  session.answers.push(choice);
  session.index++;
  if (session.index === session.paper.length) {
    const result = core.grade(bank, session);
    session.status = 'finished';
    session.score = result.score;
    session.correct = result.correct;
    try {
      const resultKey = 'bm_free_exam_result_' + (window.bioCloud?.uid || 'guest');
      localStorage.setItem(resultKey, JSON.stringify({ ...result, at: Date.now() }));
    } catch (_) {}
  }
  save(); show();
}
function start() {
  if (document.body.dataset.auth !== 'ok') { alert('Hãy đăng nhập trước khi làm đề.'); return; }
  load();
  if (session?.status === 'active') { show(); return; } // tải lại vẫn tiếp tục lượt đang làm
  try { session = core.createPaper(bank, window.bioSite || {}, Date.now()); }
  catch (err) { alert(err.message || 'Không tạo được đề.'); return; }
  storageKey = key(); lastSignalAt = 0; save(); show();
}
function exit() {
  if (session?.status === 'active' && !confirm('Thoát đề hiện tại? Điểm và tiến độ của lượt này sẽ mất.')) return;
  if (session?.status === 'active') { session.status = 'abandoned'; save(); }
  hide();
}
$('secure-leave').addEventListener('click', exit);
function notice() { message('Đang làm đề: hãy bấm “Thoát đề” để rời chế độ luyện miễn phí.'); $('secure-view').scrollIntoView({ behavior: 'smooth' }); }
window.secureExam = { start, active: () => session?.status === 'active', notice };
window.addEventListener('bio:user', load);
load();
// Cảnh báo trên thiết bị: không phát hiện Gemini và người học có thể xoá/sửa dữ liệu.
function signal(reason) {
  if (!session || session.status !== 'active' || (reason === 'blur' && !session.aiWatch)) return;
  if (Date.now() - lastSignalAt < 1700) return;
  lastSignalAt = Date.now();
  session.warnings++;
  if (session.warnings >= session.warningLimit) session.status = 'stopped';
  save();
  if (session.status === 'stopped') render();
  else $('secure-warning').textContent = `Cảnh báo trên thiết bị: ${session.warnings}/${session.warningLimit}. Vui lòng ở lại trang.`;
  // Tránh alert khi tab đang ẩn; thông báo được hiện khi người dùng quay lại.
  if (document.visibilityState === 'visible') alert(session.status === 'stopped'
    ? 'Đã đạt giới hạn cảnh báo. Lượt này đã dừng trên thiết bị.'
    : `Cảnh báo ${session.warnings}/${session.warningLimit}: trang đã ${reason === 'hidden' ? 'bị ẩn' : 'mất tiêu điểm'}.`);
}
document.addEventListener('visibilitychange', () => { if (document.hidden) signal('hidden'); });
window.addEventListener('blur', () => {
  if (session?.aiWatch && !document.hidden) setTimeout(() => { if (!document.hasFocus()) signal('blur'); }, 500);
});
window.addEventListener('beforeunload', event => {
  if (session?.status === 'active') { event.preventDefault(); event.returnValue = ''; }
});
