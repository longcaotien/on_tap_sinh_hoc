'use strict';
const { randomInt, randomUUID } = require('node:crypto');
const TYPES = ['mcq', 'tf', 'sa'];
const DIAGRAMS = ['seedExperiment', 'potatoGraph', 'digestiveSystem'];
function typeOf(q) { return q.type || 'mcq'; } // tương thích bộ câu hỏi ABCD cũ
function validateBank(bank) {
  if (!Array.isArray(bank) || bank.length > 200 || bank.length < 20) throw new Error('Ngân hàng đề phải có ít nhất 20 câu (10 câu mỗi bài).');
  const ids = new Set();
  for (const q of bank) {
    if (!q || typeof q.id !== 'string' || !/^b[68][-_][a-zA-Z0-9_-]{1,40}$/.test(q.id) || ids.has(q.id) ||
        q.topic !== q.id.slice(0, 2) || typeof q.text !== 'string' || q.text.length < 5 || q.text.length > 1200 ||
        !TYPES.includes(typeOf(q)) || (q.diagram !== undefined && !DIAGRAMS.includes(q.diagram))) {
      throw new Error('Câu hỏi không hợp lệ: ' + (q?.id || '?'));
    }
    ids.add(q.id);
    if (typeOf(q) === 'mcq') {
      if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some(v => typeof v !== 'string' || !v.length || v.length > 500) ||
          !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) throw new Error('ABCD không hợp lệ: ' + q.id);
    } else if (typeOf(q) === 'tf') {
      if (!Array.isArray(q.statements) || q.statements.length !== 4 || q.statements.some(v => typeof v !== 'string' || !v.length || v.length > 1200) ||
          !Array.isArray(q.answer) || q.answer.length !== 4 || q.answer.some(v => typeof v !== 'boolean')) throw new Error('Đúng/Sai không hợp lệ: ' + q.id);
    } else if (!Array.isArray(q.items) || q.items.length < 2 || q.items.length > 10 ||
               q.items.some(v => typeof v !== 'string' || !v.length || v.length > 500) ||
               !Number.isInteger(q.maxChoices) || q.maxChoices < 1 || q.maxChoices > 10 ||
               !Number.isInteger(q.answer) || q.answer < 1 || q.answer > q.maxChoices) {
      throw new Error('Trả lời ngắn không hợp lệ: ' + q.id);
    }
  }
  if (bank.filter(q => q.topic === 'b6').length < 10 || bank.filter(q => q.topic === 'b8').length < 10) throw new Error('Cần ít nhất 10 câu ở mỗi bài.');
  return bank;
}
function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function sampleTopic(bank, topic) {
  const pool = bank.filter(q => q.topic === topic);
  const groups = TYPES.map(type => shuffle(pool.filter(q => typeOf(q) === type)));
  // Nếu bộ câu hỏi có đủ cả ba loại: mỗi bài gồm 6 ABCD + 2 Đ/S + 2 TL ngắn.
  // Với bộ cũ chỉ có ABCD, quay về chọn ngẫu nhiên 10 câu.
  const quota = groups.every((g, i) => g.length >= [6, 2, 2][i])
    ? groups.flatMap((g, i) => g.slice(0, [6, 2, 2][i])) : shuffle(pool).slice(0, 10);
  return quota;
}
function createPaper(bank) {
  validateBank(bank);
  const selected = shuffle([...sampleTopic(bank, 'b6'), ...sampleTopic(bank, 'b8')]);
  // Toàn bộ đáp án nằm trong examSessions, không được client đọc trực tiếp.
  return selected.map(q => ({ ...q, ...(typeOf(q) === 'mcq' ? { order: shuffle([0, 1, 2, 3]) } : {}),
    ...(typeOf(q) === 'tf' ? { statementOrder: q.diagram ? [0, 1, 2, 3] : shuffle([0, 1, 2, 3]) } : {}) }));
}
function publicQuestion(entry, index) {
  const base = { index, topic: entry.topic, type: typeOf(entry), text: entry.text };
  if (entry.diagram) base.diagram = entry.diagram;
  if (base.type === 'mcq') base.options = entry.order.map(i => entry.options[i]);
  if (base.type === 'tf') base.statements = entry.statementOrder.map(i => entry.statements[i]);
  if (base.type === 'sa') { base.items = entry.items; base.maxChoices = entry.maxChoices; }
  return base;
}
function validChoice(entry, choice) {
  if (typeOf(entry) === 'mcq') return Number.isInteger(choice) && choice >= 0 && choice <= 3;
  if (typeOf(entry) === 'sa') return Number.isInteger(choice) && choice >= 1 && choice <= entry.maxChoices;
  return Array.isArray(choice) && choice.length === 4 && choice.every(x => typeof x === 'boolean');
}
function correctAnswer(entry, choice) {
  if (!validChoice(entry, choice)) return false;
  if (typeOf(entry) === 'mcq') return entry.order[choice] === entry.answer;
  if (typeOf(entry) === 'sa') return choice === entry.answer;
  return choice.every((value, i) => value === entry.answer[entry.statementOrder[i]]);
}
function grade(paper, answers) {
  const correct = paper.reduce((count, q, i) => count + (correctAnswer(q, answers[i]) ? 1 : 0), 0);
  return { correct, score: Math.round(correct / paper.length * 100) / 10 };
}
module.exports = { validateBank, createPaper, publicQuestion, validChoice, grade, randomUUID };
