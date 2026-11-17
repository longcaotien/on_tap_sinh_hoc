const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

// Exercise the small DOM patcher used after answering one question, without
// loading Firebase, fonts or a full browser in the unit-test environment.
const page = fs.readFileSync(require.resolve('../index.html'), 'utf8');
const source = page.slice(page.indexOf('function updateQuestionCard('), page.indexOf('// --- 7.1 Render Phần I'));

test('answer update replaces only its own card and retains a neighbouring card', () => {
  const heading = { focus(options) { this.focusOptions = options; } };
  const sibling = { dataset: { questionId: 'b6-2' } };
  const target = { dataset: { questionId: 'b6-1' }, replaceWith(next) { container.children[0] = next; } };
  const container = { children: [target, sibling], innerHTML: '' };
  const replacement = {
    dataset: { questionId: 'b6-1' },
    classList: { add(value) { this.value = value; } },
    querySelector(selector) { return selector === 'h4' ? heading : null; }
  };
  const document = {
    createElement(name) {
      assert.equal(name, 'template');
      return { content: { firstElementChild: replacement }, set innerHTML(value) { this.html = value; } };
    }
  };
  const patch = vm.runInNewContext(source + '\nupdateQuestionCard;', { document });
  patch(container, 'b6-1', '<div>answered</div>');
  assert.equal(container.children[0], replacement);
  assert.equal(container.children[1], sibling);
  assert.equal(replacement.classList.value, 'answer-update');
  assert.equal(heading.tabIndex, -1);
  assert.equal(heading.focusOptions.preventScroll, true);
  patch(container, null, '<div>new filtered list</div>');
  assert.equal(container.innerHTML, '<div>new filtered list</div>');
});
