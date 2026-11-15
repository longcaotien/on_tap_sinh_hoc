# BioMaster 11

Ôn tập Sinh học Bài 6 và Bài 8 (GitHub Pages) và đề 20 câu bảo vệ do Firebase Cloud Functions chấm.

- Bộ 50 câu luyện tập trong `questions.js` **công khai**, chỉ để ôn tập.
- Đề 20 câu lấy 10 câu mỗi bài từ Firestore, hỗ trợ ABCD / Đúng-Sai / trả lời ngắn; phiên và chấm điểm ở máy chủ. Xuất file 50 câu hiện có bằng `node scripts/export-legacy-bank.cjs` rồi nhập ở admin (đáp án của bộ công khai vẫn xem được).
- Triển khai Functions/Firestore Rules và nhập ngân hàng riêng theo [FIREBASE_SETUP.md](FIREBASE_SETUP.md). Nếu chưa làm bước này, nút đề bảo vệ sẽ không hoạt động.
- Không có giải pháp trình duyệt nào ngăn gian lận hoặc phát hiện AI trên màn hình khác tuyệt đối.
