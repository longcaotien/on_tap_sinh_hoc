// Cấu hình Firebase cho BioMaster 11.
// Lấy ở: Firebase Console -> Project settings -> Your apps -> Web app -> "firebaseConfig".
// Các giá trị này không phải mật khẩu (Firebase thiết kế để công khai); việc bảo vệ nằm ở firestore.rules.
//
// Khi chưa điền (còn chữ DIEN_...), trang làm bài chạy bình thường, KHÔNG yêu cầu đăng nhập.
window.BIO_FIREBASE = {
  apiKey: "AIzaSyAJs5FZggQcMF4U1Oz8WxMLbOd-AKK9Rrc",
  authDomain: "biomaster-df0b3.firebaseapp.com",
  projectId: "biomaster-df0b3",
  appId: 1:230013550519:web:9738403f70f19cbd1e7232"
};

// Email của tài khoản quản lý (tạo trong Firebase -> Authentication -> Users, kèm mật khẩu do bạn đặt).
// Phải trùng với email ghi trong firestore.rules.
window.BIO_ADMIN_EMAIL = "longbao123789@gmail.com";
