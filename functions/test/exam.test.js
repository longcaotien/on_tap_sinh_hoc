const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateBank, createPaper, publicQuestion, grade } = require('../exam-logic');
const bank = ['b6', 'b8'].flatMap(topic => Array.from({ length: 20 }, (_, n) => ({
  id: `${topic}-${String(n + 1).padStart(2, '0')}`, topic, text: `Kiểm thử câu số ${n + 1}`,
  options: ['a','b','c','d'], answer: n % 4
})));
test('validate required fields and distinct IDs', () => {
  assert.equal(validateBank(bank), bank);
  assert.throws(() => validateBank([...bank, bank[0]]), /không hợp lệ/);
  assert.throws(() => validateBank(bank.filter(q => q.topic === 'b6')), /ít nhất 10/);
});
test('paper has 20 unique questions, 10 per lesson and no answers on public wire', () => {
  for (let n = 0; n < 100; n++) {
    const paper = createPaper(bank);
    assert.equal(paper.length, 20);
    assert.equal(new Set(paper.map(e => e.id)).size, 20);
    for (const topic of ['b6', 'b8']) assert.equal(paper.filter(e => e.topic === topic).length, 10);
    paper.forEach((entry, i) => {
      assert.deepEqual([...entry.order].sort(), [0, 1, 2, 3]);
      assert.deepEqual(Object.keys(publicQuestion(entry, i)).sort(), ['index', 'options', 'text', 'topic']);
    });
  }
});
test('grade uses private answer and shuffled positions', () => {
  const paper = createPaper(bank);
  const correct = paper.map(entry => entry.order.indexOf(entry.answer));
  assert.deepEqual(grade(paper, correct), { correct: 20, score: 10 });
  assert.deepEqual(grade(paper, correct.map(i => (i + 1) % 4)), { correct: 0, score: 0 });
  assert.deepEqual(grade(paper, [correct[0], ...Array(19).fill(-1)]), { correct: 1, score: 0.5 });
});
