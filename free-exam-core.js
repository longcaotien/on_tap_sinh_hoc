// Công cụ đề luyện tập miễn phí. Dữ liệu/đáp án công khai trong questions.js;
// điểm và cảnh báo chỉ lưu trên trình duyệt, không dùng để chứng nhận kết quả.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BioFreeExam = api;
})(globalThis, function () {
  'use strict';
  // Detect phone/tablet only for the explicitly labelled, unmonitored practice path.
  // Lack of getDisplayMedia alone never grants a desktop bypass.
  function isMobileDevice(ua, maxTouchPoints = 0) {
    return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua || '') ||
      (/Macintosh/i.test(ua || '') && maxTouchPoints > 1);
  }
  function shuffle(input) {
    const a = [...input];
    for (let i = a.length - 1; i > 0; i--) {
      let j;
      if (globalThis.crypto && globalThis.crypto.getRandomValues) {
        const n = new Uint32Array(1);
        const range = Math.floor(4294967296 / (i + 1)) * (i + 1);
        do { globalThis.crypto.getRandomValues(n); } while (n[0] >= range);
        j = n[0] % (i + 1);
      } else j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function choose(bank, topic) {
    const pool = bank.filter(q => q.topic === topic);
    const types = ['mcq', 'tf', 'sa'];
    const quotas = [6, 2, 2];
    const groups = types.map(type => shuffle(pool.filter(q => q.type === type)));
    if (groups.some((g, i) => g.length < quotas[i])) throw new Error('Bộ đề phải có đủ 6 ABCD, 2 Đúng/Sai và 2 trả lời ngắn cho mỗi bài.');
    return groups.flatMap((group, i) => group.slice(0, quotas[i]));
  }
  function createPaper(bank, settings, now = Date.now()) {
    const selected = shuffle([...choose(bank, 'b6'), ...choose(bank, 'b8')]);
    return {
      id: String(now) + '-' + Math.random().toString(36).slice(2),
      paper: selected.map(q => ({ id: q.id, order: q.type === 'mcq' ? shuffle([0, 1, 2, 3]) : undefined,
        statementOrder: q.type === 'tf' ? (q.diagram ? [0, 1, 2, 3] : shuffle([0, 1, 2, 3])) : undefined })),
      index: 0, answers: [], status: 'active', startedAt: now, endsAt: now + 25 * 60 * 1000,
      warnings: 0, warningLimit: Math.min(10, Math.max(1, Number(settings?.warningLimit) || 3)),
      aiWatch: settings?.aiWatch === true
    };
  }
  function getQuestion(bank, entry, index) {
    const q = bank.find(x => x.id === entry.id);
    if (!q) throw new Error('Không tìm thấy câu hỏi.');
    const shown = { index, topic: q.topic, type: q.type, text: q.text };
    if (q.diagram) shown.diagram = q.diagram;
    if (q.type === 'mcq') shown.options = entry.order.map(i => q.options[i]);
    if (q.type === 'tf') shown.statements = entry.statementOrder.map(i => q.statements[i]);
    if (q.type === 'sa') { shown.items = q.items; shown.maxChoices = q.maxChoices; }
    return shown;
  }
  function validChoice(q, choice) {
    if (q.type === 'mcq') return Number.isInteger(choice) && choice >= 0 && choice < 4;
    if (q.type === 'sa') return Number.isInteger(choice) && choice >= 1 && choice <= q.maxChoices;
    return Array.isArray(choice) && choice.length === 4 && choice.every(v => typeof v === 'boolean');
  }
  function grade(bank, session) {
    const correct = session.paper.reduce((count, entry, i) => {
      const q = bank.find(x => x.id === entry.id);
      const choice = session.answers[i];
      if (!q || !validChoice(q, choice)) return count;
      if (q.type === 'mcq') return count + (entry.order[choice] === q.answer ? 1 : 0);
      if (q.type === 'sa') return count + (choice === q.answer ? 1 : 0);
      return count + (choice.every((v, k) => v === q.answer[entry.statementOrder[k]]) ? 1 : 0);
    }, 0);
    return { correct, score: Math.round(correct / session.paper.length * 100) / 10 };
  }
  return { createPaper, getQuestion, validChoice, grade, isMobileDevice };
});
