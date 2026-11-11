// Cấu hình Firebase cho BioMaster 11.
// Lấy ở: Firebase Console -> Project settings -> Your apps -> Web app -> "firebaseConfig".
// Các giá trị này không phải mật khẩu (Firebase thiết kế để công khai); việc bảo vệ nằm ở firestore.rules.
//
// Khi chưa điền (còn chữ DIEN_...), trang làm bài chạy bình thường, KHÔNG yêu cầu đăng nhập.
window.BIO_FIREBASE = {
  apiKey: "DIEN_API_KEY",
  authDomain: "DIEN_PROJECT_ID.firebaseapp.com",
  projectId: "DIEN_PROJECT_ID",
  appId: "DIEN_APP_ID"
};

// Email của tài khoản quản lý (tạo trong Firebase -> Authentication -> Users, kèm mật khẩu do bạn đặt).
// Phải trùng với email ghi trong firestore.rules.
window.BIO_ADMIN_EMAIL = "admin@biomaster.app";
