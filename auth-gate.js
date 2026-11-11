// Cổng đăng nhập Google cho trang làm bài.
// Được index.html nạp khi firebase-config.js đã điền đủ.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(window.BIO_FIREBASE);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const panels = ['loading', 'login', 'blocked', 'error'];

function showPanel(name) {
  panels.forEach((p) => { $('gate-' + p).hidden = p !== name; });
}
function showError(text) {
  $('gate-error-text').textContent = text;
  document.body.dataset.auth = 'gate';
  showPanel('error');
}
function friendlyError(e) {
  switch (e && e.code) {
    case 'auth/unauthorized-domain':
      return 'Tên miền này chưa được cho phép. Quản trị viên cần thêm nó vào Authentication → Settings → Authorized domains trong Firebase.';
    case 'auth/network-request-failed':
      return 'Mất kết nối mạng. Kiểm tra mạng rồi thử lại.';
    case 'permission-denied':
      return 'Không ghi được dữ liệu người dùng. Quản trị viên cần kiểm tra lại firestore.rules.';
    default:
      return 'Có lỗi khi đăng nhập' + (e && e.code ? ' (' + e.code + ')' : '') + '. Hãy tải lại trang và thử lại.';
  }
}

// Trình duyệt trong ứng dụng (Zalo, Facebook, ...) bị Google chặn đăng nhập
if (/Zalo|FBAN|FBAV|FB_IAB|Instagram|Line\/|Messenger|TikTok|; wv\)/i.test(navigator.userAgent)) {
  $('gate-inapp').hidden = false;
}

const loginBtn = $('gate-login-btn');
loginBtn.addEventListener('click', async () => {
  loginBtn.disabled = true;
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') {
      try { await signInWithRedirect(auth, provider); return; } catch (e2) { e = e2; }
    }
    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
      showError(friendlyError(e));
    }
  }
  loginBtn.disabled = false;
});

function signOutAndReset() { return signOut(auth); }
$('gate-blocked-out').addEventListener('click', signOutAndReset);

// Menu tài khoản nằm trong index.html; ở đây chỉ nhận lệnh đăng xuất từ menu đó
window.addEventListener('bio:signout', signOutAndReset);

const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* bỏ qua */ }
  }
};

let unsubProfile = null;

function unlock(user) {
  document.body.dataset.auth = 'ok';
  const label = user.displayName || user.email || 'Tài khoản';
  $('user-chip-name').textContent = label;
  $('user-chip-email').textContent = user.email || '';
  $('user-chip-initial').textContent = label.trim().charAt(0).toUpperCase();
  if (window.bioUserMenu) window.bioUserMenu.close();
  $('user-chip').style.display = 'block';
}
function lock(user) {
  document.body.dataset.auth = 'blocked';
  if (window.bioUserMenu) window.bioUserMenu.close();
  $('user-chip').style.display = 'none';
  $('gate-blocked-email').textContent = user.email || '';
  showPanel('blocked');
}

onAuthStateChanged(auth, async (user) => {
  if (unsubProfile) { unsubProfile(); unsubProfile = null; }

  if (!user) {
    $('user-chip').style.display = 'none';
    document.body.dataset.auth = 'gate';
    showPanel('login');
    return;
  }

  document.body.dataset.auth = 'pending';
  showPanel('loading');

  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const profile = { name: user.displayName || '', photoURL: user.photoURL || '' };
    const countedKey = 'bio_counted_' + user.uid;

    if (!snap.exists()) {
      // Lần đầu vào: tạo hồ sơ (mặc định không bị chặn)
      await setDoc(ref, {
        ...profile,
        email: user.email || '',
        blocked: false,
        visits: 1,
        firstSeen: serverTimestamp(),
        lastSeen: serverTimestamp()
      });
      store.set(countedKey, '1');
    } else if (!snap.data().blocked && !store.get(countedKey)) {
      // Mỗi phiên trình duyệt chỉ tính 1 lượt vào
      await updateDoc(ref, { ...profile, lastSeen: serverTimestamp(), visits: increment(1) });
      store.set(countedKey, '1');
    }

    // Theo dõi trực tiếp: quản lý chặn là bị đá ra ngay, bỏ chặn là vào lại được
    unsubProfile = onSnapshot(
      ref,
      (s) => {
        const d = s.data();
        if (d && d.blocked) lock(user); else unlock(user);
      },
      (err) => showError(friendlyError(err))
    );
  } catch (e) {
    showError(friendlyError(e));
  }
});
