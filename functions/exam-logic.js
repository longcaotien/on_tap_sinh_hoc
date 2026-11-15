'use strict';
const { randomInt, randomUUID } = require('node:crypto');
function validateBank(bank) {
  if (!Array.isArray(bank) || bank.length > 200 || bank.length < 20) throw new Error('Ngân hàng đề phải có ít nhất 20 câu (10 câu mỗi bài).');
  const ids = new Set();
  for (const q of bank) {
    if (!q || typeof q.id !== 'string' || !/^b[68]-[a-zA-Z0-9-]{1,30}$/.test(q.id) || ids.has(q.id) ||
      q.topic !== q.id.slice(0, 2) || typeof q.text !== 'string' || q.text.length < 5 || q.text.length > 1000 ||
      !Array.isArray(q.options) || q.options.length !== 4 || q.options.some(v => typeof v !== 'string' || !v.length || v.length > 500) ||
      !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) throw new Error('Câu hỏi không hợp lệ: ' + (q?.id || '?'));
    ids.add(q.id);
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
function createPaper(bank) {
  validateBank(bank);
  const selected = shuffle([
    ...shuffle(bank.filter(q => q.topic === 'b6')).slice(0, 10),
    ...shuffle(bank.filter(q => q.topic === 'b8')).slice(0, 10)
  ]);
  // Bản sao câu hỏi + đáp án được lưu trong examSessions (Firestore Rules từ chối mọi client).
  // Đề đã bắt đầu không bị thay đổi khi quản lý cập nhật ngân hàng câu hỏi.
  return selected.map(q => ({ ...q, order: shuffle([0, 1, 2, 3]) }));
}
function publicQuestion(entry, index) {
  return { index, topic: entry.topic, text: entry.text, options: entry.order.map(i => entry.options[i]) };
}
function grade(paper, answers) {
  const correct = paper.reduce((count, entry, i) => count +
    (Number.isInteger(answers[i]) && entry.order[answers[i]] === entry.answer ? 1 : 0), 0);
  return { correct, score: Math.round(correct / paper.length * 100) / 10 };
}
module.exports = { validateBank, createPaper, publicQuestion, grade, randomUUID };
