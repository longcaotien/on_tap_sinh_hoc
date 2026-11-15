const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const core = require('../free-exam-core.js');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('questions.js', 'utf8') +
  ';globalThis.parts=[originalMCQData,originalTFData,originalSAData];', context);
const [mcq, tf, sa] = context.parts;
const bank = [
  ...mcq.map(q => ({ id: q.uid, topic: q.topic, type: 'mcq', text: q.question, options: q.options, answer: q.correct })),
  ...tf.map(q => ({ id: q.uid, topic: q.topic, type: 'tf', text: q.prompt, statements: q.statements.map(s => s.text), answer: q.statements.map(s => s.isTrue), diagram: q.diagramType })),
  ...sa.map(q => ({ id: q.uid, topic: q.topic, type: 'sa', text: q.question, items: q.items.map(i => i.text), maxChoices: q.maxChoices, answer: q.correctAnswer }))
];
function correct(q, entry) {
  if (q.type === 'mcq') return entry.order.indexOf(q.answer);
  if (q.type === 'tf') return entry.statementOrder.map(i => q.answer[i]);
  return q.answer;
}
test('50 public questions: 25 per lesson, all 3 types', () => {
  assert.equal(bank.length, 50);
  for (const topic of ['b6', 'b8']) assert.equal(bank.filter(q => q.topic === topic).length, 25);
});
test('20 questions from both lessons with mixed types and shuffled options', () => {
  const signatures = new Set();
  for (let n = 0; n < 60; n++) {
    const s = core.createPaper(bank, { warningLimit: 4, aiWatch: true }, 12345);
    signatures.add(s.paper.map(q => q.id).join(','));
    assert.equal(s.warningLimit, 4);
    assert.equal(s.endsAt - s.startedAt, 25 * 60 * 1000);
    assert.equal(s.paper.length, 20);
    assert.equal(new Set(s.paper.map(q => q.id)).size, 20);
    for (const topic of ['b6', 'b8']) assert.equal(s.paper.filter(q => q.id.startsWith(topic)).length, 10);
    for (const [type, expected] of [['mcq', 12], ['tf', 4], ['sa', 4]]) {
      assert.equal(s.paper.filter(entry => bank.find(q => q.id === entry.id).type === type).length, expected);
    }
    s.paper.forEach((entry, i) => {
      const shown = core.getQuestion(bank, entry, i);
      assert.ok(!Object.hasOwn(shown, 'answer'));
      assert.ok(!Object.hasOwn(shown, 'order'));
    });
  }
  assert.ok(signatures.size > 1);
});
test('grades ABCD, TF, short answers locally and rejects malformed choices', () => {
  const s = core.createPaper(bank, {}, 12345);
  s.answers = s.paper.map(entry => correct(bank.find(q => q.id === entry.id), entry));
  assert.deepEqual(core.grade(bank, s), { correct: 20, score: 10 });
  s.answers = s.paper.map((entry, i) => {
    const q = bank.find(q => q.id === entry.id);
    const a = correct(q, entry);
    return q.type === 'mcq' ? (a + 1) % 4 : q.type === 'tf' ? a.map(v => !v) : a === 1 ? 2 : 1;
  });
  assert.deepEqual(core.grade(bank, s), { correct: 0, score: 0 });
  assert.equal(core.validChoice(bank.find(q => q.type === 'tf'), [true, false]), false);
});
