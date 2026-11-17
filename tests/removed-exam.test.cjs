const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const file = name => fs.readFileSync(path.join(root, name), 'utf8');

test('20-question and screen-share assets are not shipped or offered in either UI', () => {
  const workflow = file('.github/workflows/static.yml');
  const learner = file('index.html');
  const admin = file('admin.html');
  for (const name of ['free-exam-core.js', 'secure-exam.js', 'screen-share.js']) {
    assert.equal(fs.existsSync(path.join(root, name)), false, name);
    assert.doesNotMatch(workflow, new RegExp(name.replace(/\./g, '\\.')));
  }
  assert.doesNotMatch(learner, /secureExam|secure-view|exam-start|bioExamSource/);
  assert.doesNotMatch(admin, /screenShares|RTCPeerConnection|renderScreen|live-viewer|data-act="screen"/);
  assert.doesNotMatch(file('features.js'), /data\.ans\b|data\.cur\b/);
});

test('Firestore rejects old sharing and exam writes when the rules are published', () => {
  const rules = file('firestore.rules');
  assert.match(rules, /match \/screenShares\/\{uid\} \{ allow read, write: if false; \}/);
  assert.match(rules, /match \/examBank\/\{id\} \{ allow read, write: if false; \}/);
  assert.doesNotMatch(rules, /'ans'|'cur'/);
  assert.doesNotMatch(file('firebase.json'), /"functions"/);
});
