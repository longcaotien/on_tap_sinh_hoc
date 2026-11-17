const { test } = require('node:test');
const assert = require('node:assert/strict');
const guide = require('../inapp-browser.js');

test('detect known embedded browsers without flagging normal mobile Chrome or Safari', () => {
  for (const ua of [
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit Zalo/23.0',
    'Mozilla/5.0 (iPhone) FBAN/MessengerForiOS FBAV/440.0',
    'Mozilla/5.0 (Linux; Android 13; wv) AppleWebKit Chrome/121 Mobile',
    'Mozilla/5.0 (iPhone) Instagram 320.0',
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit TikTok'
  ]) assert.equal(guide.detect(ua), true, ua);
  for (const ua of [
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit Chrome/121 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Mobile Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121 Safari/537.36'
  ]) assert.equal(guide.detect(ua), false, ua);
});

test('external Chrome intent only carries a safe HTTPS host and path, no auth parameters', () => {
  const link = 'https://longcaotien.github.io/on_tap_sinh_hoc/?token=secret#Intent;package=evil';
  assert.equal(guide.cleanUrl(link), 'https://longcaotien.github.io/on_tap_sinh_hoc/');
  assert.equal(guide.chromeIntent(link),
    'intent://longcaotien.github.io/on_tap_sinh_hoc/#Intent;scheme=https;package=com.android.chrome;end');
  assert.equal(guide.chromeIntent('javascript:alert(1)'), null);
  assert.equal(guide.chromeIntent('http://example.com/'), null);
});

test('in-app guide remains visible and never starts navigation without an explicit click', async () => {
  const elements = Object.fromEntries([
    'gate-inapp', 'gate-login-btn', 'gate-open-chrome', 'gate-copy-link',
    'gate-browser-url', 'gate-browser-status', 'gate-browser-steps'
  ].map(id => [id, { hidden: true, value: '', textContent: '',
    addEventListener(event, cb) { this[event] = cb; }, select() { this.selected = true; } }]));
  const doc = { getElementById(id) { return elements[id]; } };
  const loc = { href: 'https://example.com/quiz?key=private' };
  const nav = { userAgent: 'Zalo (Linux; Android 14)', clipboard: { async writeText(text) { nav.copied = text; } } };
  guide.init(doc, nav, loc);
  assert.equal(elements['gate-inapp'].hidden, false);
  assert.equal(elements['gate-login-btn'].hidden, true);
  assert.equal(elements['gate-open-chrome'].hidden, false);
  assert.equal(elements['gate-browser-url'].value, 'https://example.com/quiz');
  assert.equal(loc.href, 'https://example.com/quiz?key=private');
  await elements['gate-copy-link'].click();
  assert.equal(nav.copied, 'https://example.com/quiz');
  elements['gate-open-chrome'].click();
  assert.equal(loc.href, 'intent://example.com/quiz#Intent;scheme=https;package=com.android.chrome;end');
});
