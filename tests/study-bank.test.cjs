const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('50 public study/practice questions remain available after removing the separate exam', () => {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('../questions.js'), 'utf8') +
    ';globalThis.bank=[...originalMCQData,...originalTFData,...originalSAData];', ctx);
  const bank = ctx.bank;
  assert.equal(bank.length, 50);
  for (const topic of ['b6', 'b8']) assert.equal(bank.filter(q => q.topic === topic).length, 25);
  assert.equal(new Set(bank.map(q => q.uid)).size, 50);
});
