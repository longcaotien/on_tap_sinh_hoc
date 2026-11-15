// Tùy chọn chia sẻ trực tiếp P2P. Luồng video đi qua WebRTC, Firestore chỉ chuyển SDP.
// Bắt buộc hành động/cấp quyền từ người học; không ghi hình và không phân tích AI.
import { getApps, getApp, initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const config = window.BIO_FIREBASE;
const app = config?.apiKey ? (getApps().length ? getApp() : initializeApp(config)) : null;
const db = app ? getFirestore(app) : null;

function iceComplete(pc) {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { cleanup(); reject(new Error('Không thu thập được kết nối mạng (ICE).')); }, 12000);
    function check() { if (pc.iceGatheringState === 'complete') { cleanup(); resolve(); } }
    function cleanup() { clearTimeout(timeout); pc.removeEventListener('icegatheringstatechange', check); }
    pc.addEventListener('icegatheringstatechange', check);
    check();
  });
}
export async function startScreenShare({ onEnded, onState }) {
  const uid = app && getAuth(app).currentUser?.uid;
  if (!uid || uid !== window.bioCloud?.uid) throw new Error('Hãy đăng nhập Google để chia sẻ màn hình.');
  if (!navigator.mediaDevices?.getDisplayMedia || !window.RTCPeerConnection) {
    throw new Error('Trình duyệt này không hỗ trợ chia sẻ màn hình/WebRTC. Hãy dùng Chrome hoặc Edge trên máy tính.');
  }
  // PHẢI gọi getDisplayMedia trước await để còn quyền kích hoạt từ cú nhấp của người học.
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor', frameRate: 5 }, audio: false });
  const track = stream.getVideoTracks()[0];
  if (!track) { stream.getTracks().forEach(t => t.stop()); throw new Error('Không nhận được hình ảnh màn hình.'); }
  const surface = track.getSettings().displaySurface;
  if (surface && surface !== 'monitor') {
    stream.getTracks().forEach(t => t.stop());
    throw new Error('Bạn đã chọn một tab hoặc cửa sổ. Hãy chọn “Toàn bộ màn hình” để tiếp tục.');
  }
  let pc, unsub, beat, intentional = false, answered = false, disconnectTimer;
  const sessionId = crypto.randomUUID();
  const ref = doc(db, 'screenShares', uid);
  const stop = async () => {
    if (intentional) return;
    intentional = true;
    clearInterval(beat); clearTimeout(disconnectTimer);
    if (unsub) unsub();
    if (pc) pc.close();
    stream.getTracks().forEach(t => t.stop());
    try { await updateDoc(ref, { status: 'stopped', ts: serverTimestamp() }); } catch (_) { /* kết nối đã mất */ }
  };
  track.addEventListener('ended', () => { if (!intentional) onEnded('Bạn đã dừng chia sẻ màn hình.'); });
  try {
    pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    pc.addEventListener('connectionstatechange', () => {
      if (intentional) return;
      if (pc.connectionState === 'connected') { clearTimeout(disconnectTimer); onState('Quản lý đang xem trực tiếp · không ghi hình'); }
      if (pc.connectionState === 'failed') onEnded('Kết nối truyền màn hình thất bại.');
      if (pc.connectionState === 'disconnected' && answered) {
        clearTimeout(disconnectTimer);
        disconnectTimer = setTimeout(() => { if (!intentional && pc.connectionState === 'disconnected') onEnded('Mất kết nối truyền màn hình.'); }, 12000);
      }
    });
    await pc.setLocalDescription(await pc.createOffer());
    await iceComplete(pc);
    const offer = { type: pc.localDescription.type, sdp: pc.localDescription.sdp };
    if (offer.sdp.length > 30000) throw new Error('Dữ liệu kết nối màn hình quá lớn.');
    await setDoc(ref, {
      offer, status: 'live', sessionId, ts: serverTimestamp(), warnings: 0, lastReason: 'start', lastSignalAt: serverTimestamp(), surface: surface || 'unknown',
      name: String(getAuth(app).currentUser?.displayName || 'Người học').slice(0, 80)
    }, { merge: true });
    onState(surface === undefined
      ? 'Đang chia sẻ · trình duyệt không xác nhận được loại màn hình, quản lý cần kiểm tra'
      : 'Đang chia sẻ toàn bộ màn hình · chờ quản lý xem');
    unsub = onSnapshot(ref, async snap => {
      if (intentional || !snap.exists()) return;
      const data = snap.data();
      if (data.sessionId !== sessionId || !data.answer || data.answer.sessionId !== sessionId || answered) return;
      answered = true;
      try { await pc.setRemoteDescription({ type: data.answer.type, sdp: data.answer.sdp }); }
      catch (_) { onEnded('Không thiết lập được kết nối với quản lý.'); }
    }, () => { if (!intentional) onEnded('Mất kết nối giám sát màn hình.'); });
    beat = setInterval(() => {
      if (!intentional) updateDoc(ref, { ts: serverTimestamp() }).catch(() => onEnded('Không cập nhật được trạng thái chia sẻ màn hình.'));
    }, 30000);
    return { stop, stream, surface, sessionId,
      reportSignal(reason, warnings) {
        return updateDoc(ref, { warnings: Math.min(10, Math.max(0, warnings | 0)), lastReason: reason,
          lastSignalAt: serverTimestamp(), ts: serverTimestamp() });
      }
    };
  } catch (err) {
    await stop();
    throw err;
  }
}
