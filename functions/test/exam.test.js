const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateBank, createPaper, publicQuestion, validChoice, grade } = require('../exam-logic');
const bank = ['b6', 'b8'].flatMap(topic => Array.from({ length: 25 }, (_, n) => {
  const base = { id: `${topic}_${n < 18 ? 'mcq' : n < 22 ? 'tf' : 'sa'}_${n + 1}`, topic, text: `Kiểm thử câu số ${n + 1}` };
  if (n < 18) return { ...base, type: 'mcq', options: ['a', 'b', 'c', 'd'], answer: n % 4 };
  if (n < 22) return { ...base, type: 'tf', statements: ['ý a', 'ý b', 'ý c', 'ý d'], answer: [true, false, true, false] };
  return { ...base, type: 'sa', items: ['mục 1', 'mục 2', 'mục 3'], maxChoices: 3, answer: 2 };
}));
function answerFor(q) {
  if (q.type === 'mcq') return q.order.indexOf(q.answer);
  if (q.type === 'tf') return q.statementOrder.map(i => q.answer[i]);
  return q.answer;
}
test('validate formats and unique IDs of all three types', () => {
  assert.equal(validateBank(bank), bank);
  assert.throws(() => validateBank([...bank, bank[0]]), /không hợp lệ/);
  assert.throws(() => validateBank(bank.filter(q => q.topic === 'b6')), /ít nhất 10/);
  assert.throws(() => validateBank([{ ...bank[0], answer: 99 }, ...bank.slice(1)]), /ABCD/);
  assert.throws(() => validateBank([{ ...bank[18], answer: [true, false] }, ...bank.slice(1)]), /Đúng\/Sai/);
  assert.throws(() => validateBank([{ ...bank[22], answer: 8 }, ...bank.slice(1)]), /Trả lời ngắn/);
});
test('paper picks 20 distinct questions: 10 per lesson, 12 ABCD + 4 TF + 4 SA', () => {
  const signatures = new Set();
  for (let n = 0; n < 100; n++) {
    const paper = createPaper(bank);
    signatures.add(paper.map(q => q.id).join(','));
    assert.equal(paper.length, 20);
    assert.equal(new Set(paper.map(e => e.id)).size, 20);
    for (const topic of ['b6', 'b8']) assert.equal(paper.filter(e => e.topic === topic).length, 10);
    for (const [type, count] of [['mcq', 12], ['tf', 4], ['sa', 4]]) assert.equal(paper.filter(q => q.type === type).length, count);
    paper.forEach((entry, i) => {
      const shown = publicQuestion(entry, i);
      assert.ok(!Object.hasOwn(shown, 'answer'));
      assert.ok(!Object.hasOwn(shown, 'order'));
      assert.ok(!Object.hasOwn(shown, 'statementOrder'));
      assert.equal(shown.type, entry.type);
    });
  }
  assert.ok(signatures.size > 1, 'Các lượt đề phải khác nhau');
});
test('grade all types from private answers after permutation', () => {
  const paper = createPaper(bank);
  const correct = paper.map(answerFor);
  assert.deepEqual(grade(paper, correct), { correct: 20, score: 10 });
  assert.deepEqual(grade(paper, correct.map((a, i) => paper[i].type === 'mcq' ? (a + 1) % 4 : paper[i].type === 'tf' ? a.map(v => !v) : (a % 3) + 1)), { correct: 0, score: 0 });
  assert.deepEqual(grade(paper, [correct[0], ...Array(19).fill(null)]), { correct: 1, score: 0.5 });
  const tf = paper.find(q => q.type === 'tf');
  assert.ok(validChoice(tf, [true, false, true, false]));
  assert.equal(validChoice(tf, [true, false]), false);
  assert.equal(validChoice(paper.find(q => q.type === 'sa'), 0), false);
});
