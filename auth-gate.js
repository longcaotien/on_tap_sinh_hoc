// Cổng đăng nhập Google cho trang làm bài.
// Được index.html nạp khi firebase-config.js đã điền đủ.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot, serverTimestamp, increment,
  collection, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(window.BIO_FIREBASE);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const panels = ['loading', 'login', 'blocked', 'error', 'maintenance'];

function showPanel(name) {
  panels.forEach((p) => { $('gate-' + p).hidden = p !== name; });
}
function showError(text) {
  restore = () => showError(text);
  if (maintenance) return;
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

// Cầu nối cho features.js: lưu câu sai, lịch sử làm bài và điểm bảng xếp hạng lên Firestore
function setCloud(user) {
  if (!user) {
    if (!window.bioCloud) return;
    window.bioCloud = null;
    window.dispatchEvent(new Event('bio:user'));
    return;
  }
  if (window.bioCloud && window.bioCloud.uid === user.uid) return;
  const progressRef = doc(db, 'progress', user.uid);
  const scoreRef = doc(db, 'scores', user.uid);
  window.bioCloud = {
    uid: user.uid,
    async loadProgress() {
      const [p, s] = await Promise.all([getDoc(progressRef), getDoc(scoreRef)]);
      return { progress: p.exists() ? p.data() : null, score: s.exists() ? s.data() : null };
    },
    saveProgress(data) {
      return setDoc(progressRef, { wrong: data.wrong, history: data.history, ts: data.ts, updatedAt: serverTimestamp() });
    },
    // Ghi 1 lượt làm xong; trả về điểm cao nhất và số lượt sau khi ghi
    async saveScore(score) {
      const snap = await getDoc(scoreRef);
      const prev = snap.exists() ? snap.data() : {};
      const improved = typeof prev.best !== 'number' || score > prev.best;
      const next = {
        name: (user.displayName || 'Bạn học').slice(0, 80),
        photoURL: user.photoURL || '',
        best: improved ? score : prev.best,
        bestAt: improved || !prev.bestAt ? serverTimestamp() : prev.bestAt,
        attempts: (prev.attempts || 0) + 1,
        lastScore: score,
        lastAt: serverTimestamp()
      };
      await setDoc(scoreRef, next);
      return { best: next.best, attempts: next.attempts };
    },
    // Trang quản lý dùng để biết ai đang trực tuyến và đang làm gì
    savePresence(data) {
      return setDoc(doc(db, 'presence', user.uid), {
        ...data,
        name: (user.displayName || '').slice(0, 80),
        email: user.email || '',
        photoURL: user.photoURL || '',
        ts: serverTimestamp()
      });
    },
    async loadLeaderboard() {
      const snap = await getDocs(query(collection(db, 'scores'), orderBy('best', 'desc'), limit(50)));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    }
  };
  window.dispatchEvent(new Event('bio:user'));
}

// ---------- Chế độ bảo trì (quản lý bật/tắt ở admin.html) ----------
let maintenance = false;
let restore = null;   // vẽ lại trạng thái bình thường khi hết bảo trì

function showMaintenance() {
  document.body.dataset.auth = 'maintenance';
  if (window.bioUserMenu) window.bioUserMenu.close();
  $('user-chip').style.display = 'none';
  setCloud(null);   // ngừng ghi dữ liệu trong lúc bảo trì
  showPanel('maintenance');
}

onSnapshot(
  doc(db, 'settings', 'site'),
  (s) => {
    const d = s.data() || {};
    const was = maintenance;
    maintenance = d.maintenance === true;
    $('gate-maintenance-text').textContent = (typeof d.message === 'string' && d.message.trim())
      ? d.message.trim().slice(0, 300)
      : 'Người quản lý đang tạm đóng trang để cập nhật. Vui lòng quay lại sau.';
    if (maintenance) showMaintenance();
    else if (was && restore) restore();
  },
  () => { /* chưa cập nhật firestore.rules hoặc mất mạng: coi như không bảo trì */ }
);

function unlock(user) {
  restore = () => unlock(user);
  if (maintenance) { showMaintenance(); return; }
  document.body.dataset.auth = 'ok';
  const label = user.displayName || user.email || 'Tài khoản';
  $('user-chip-name').textContent = label;
  $('user-chip-email').textContent = user.email || '';
  $('user-chip-initial').textContent = label.trim().charAt(0).toUpperCase();
  if (window.bioUserMenu) window.bioUserMenu.close();
  $('user-chip').style.display = 'block';
  setCloud(user);
}
function lock(user) {
  restore = () => lock(user);
  if (maintenance) { showMaintenance(); return; }
  document.body.dataset.auth = 'blocked';
  if (window.bioUserMenu) window.bioUserMenu.close();
  $('user-chip').style.display = 'none';
  $('gate-blocked-email').textContent = user.email || '';
  setCloud(null);
  showPanel('blocked');
}

function showLogin() {
  restore = showLogin;
  if (maintenance) { showMaintenance(); return; }
  $('user-chip').style.display = 'none';
  document.body.dataset.auth = 'gate';
  showPanel('login');
}

onAuthStateChanged(auth, async (user) => {
  if (unsubProfile) { unsubProfile(); unsubProfile = null; }

  if (!user) {
    setCloud(null);
    showLogin();
    return;
  }

  restore = null;
  if (!maintenance) {
    document.body.dataset.auth = 'pending';
    showPanel('loading');
  }

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
