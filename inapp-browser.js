// An embedded browser cannot be forced to hand a link to Safari/Chrome.
// Offer an explicit Android Chrome intent on tap, and a reliable manual/copy path.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.bioInApp = api; api.init(root.document, root.navigator, root.location); }
})(globalThis, function () {
  'use strict';
  function detect(ua) {
    return /Zalo|FBAN|FBAV|FB_IAB|FBIOS|FB4A|Instagram|Messenger|Line\/|TikTok|Telegram|MicroMessenger|KAKAOTALK|Snapchat|GSA\//i.test(ua || '') ||
      (/Android/i.test(ua || '') && /(?:; wv[);]|\bVersion\/\d[^ ]* Chrome\/)/i.test(ua || ''));
  }
  function cleanUrl(href) {
    const url = new URL(href);
    // Never pass query strings, fragments or potential login tokens to another app.
    if (url.protocol !== 'https:') return null;
    return url.origin + url.pathname;
  }
  function chromeIntent(href) {
    const url = cleanUrl(href);
    return url ? 'intent://' + url.slice('https://'.length) + '#Intent;scheme=https;package=com.android.chrome;end' : null;
  }
  function init(doc, nav, loc) {
    const ua = nav.userAgent || '';
    const active = detect(ua);
    api.active = active;
    if (!active) return;
    const guide = doc.getElementById('gate-inapp');
    const login = doc.getElementById('gate-login-btn');
    const open = doc.getElementById('gate-open-chrome');
    const copy = doc.getElementById('gate-copy-link');
    const address = doc.getElementById('gate-browser-url');
    const status = doc.getElementById('gate-browser-status');
    const instructions = doc.getElementById('gate-browser-steps');
    if (!guide || !login || !open || !copy || !address || !status || !instructions) return;
    guide.hidden = false;
    login.hidden = true;
    const url = cleanUrl(loc.href);
    if (url) address.value = url;
    else { copy.hidden = true; address.hidden = true; }
    const android = /Android/i.test(ua);
    open.hidden = !android || !url;
    instructions.textContent = android
      ? 'Nếu nút thử mở Chrome không hoạt động, bấm ⋮ hoặc ... của ứng dụng → Mở bằng trình duyệt; hoặc sao chép đường dẫn và dán vào Chrome.'
      : 'Trên iPhone/iPad, bấm menu ... hoặc Chia sẻ của ứng dụng → Mở trong Safari; nếu không có, sao chép đường dẫn và dán vào Safari.';
    open.addEventListener('click', () => {
      const intent = chromeIntent(loc.href);
      if (!intent) return;
      status.textContent = 'Đang thử mở Chrome. Nếu ứng dụng không cho phép, hãy dùng menu ... hoặc sao chép đường dẫn bên dưới.';
      // Only in a direct user gesture. Some in-app browsers block intent:// entirely.
      try { loc.href = intent; } catch (_) { status.textContent = 'Ứng dụng chặn mở Chrome. Hãy sao chép đường dẫn và dán vào trình duyệt.'; }
    });
    address.addEventListener('click', () => address.select());
    copy.addEventListener('click', async () => {
      if (!url) return;
      try {
        if (nav.clipboard?.writeText) await nav.clipboard.writeText(url);
        else { address.select(); if (!doc.execCommand('copy')) throw new Error('copy blocked'); }
        status.textContent = 'Đã sao chép. Hãy mở Chrome/Safari và dán đường dẫn vào thanh địa chỉ.';
      } catch (_) {
        address.focus(); address.select();
        status.textContent = 'Không thể sao chép tự động. Hãy chọn và sao chép đường dẫn trong ô bên dưới.';
      }
    });
  }
  const api = { detect, cleanUrl, chromeIntent, init, active: false };
  return api;
});
