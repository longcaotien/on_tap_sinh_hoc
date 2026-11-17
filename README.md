# BioMaster 11

Trang ôn tập Sinh học 11 Bài 6 và Bài 8 trên GitHub Pages. Người học vẫn có thể **ôn tập và luyện tập bộ 50 câu** (ABCD, Đúng/Sai, trả lời ngắn) sau khi đăng nhập Google. Đáp án và điểm luyện tập nằm trên trình duyệt, không dùng làm kết quả thi xác thực.

**Đã tắt đề riêng 20 câu và chia sẻ màn hình.** Trang không tải `secure-exam.js`, `screen-share.js` hoặc xin quyền quay/chia sẻ màn hình; admin không có chức năng xem màn hình trực tiếp hay dựng lại đáp án đang chọn. Tab **Đang làm** của admin vẫn hiển thị trạng thái/tiến độ tổng quát (cùng với lịch sử câu sai và điểm cũ ở các mục khác), không truyền đáp án từng câu. Bảng xếp hạng từ phiên bản cũ chỉ còn để xem/xoá điểm cũ; không có điểm 20 câu mới.

Nếu mở link trong Zalo/Messenger, trang hướng dẫn mở ngoài ứng dụng; Android có nút **Thử mở bằng Chrome** và nút sao chép đường dẫn cho Chrome/Safari. Ứng dụng có thể chặn việc mở trình duyệt ngoài.

**Quan trọng khi triển khai:** GitHub Pages chỉ thay giao diện. Cần Publish `firestore.rules` mới trong Firebase Console để chặn tín hiệu chia sẻ màn hình cũ. Nếu từng triển khai Cloud Functions của đề 20 câu, cần xóa riêng các Function đã triển khai; xóa mã trong Git không tự gỡ Function đang chạy. Xem [FIREBASE_SETUP.md](FIREBASE_SETUP.md).
