# Cài đặt đăng nhập Google và trang quản lý

Làm một lần, mất khoảng 10 phút, miễn phí. Khi chưa làm xong các bước này, trang làm bài vẫn chạy bình thường và **không** yêu cầu đăng nhập.

## 1. Tạo dự án Firebase
1. Vào https://console.firebase.google.com và đăng nhập bằng tài khoản Google của bạn.
2. Bấm **Add project**, đặt tên (ví dụ `biomaster`), có thể tắt Google Analytics, bấm **Create project**.

## 2. Bật đăng nhập
Vào **Build → Authentication → Get started → Sign-in method**, bật hai mục:
- **Google** (chọn email hỗ trợ của bạn, bấm Save).
- **Email/Password** (chỉ bật mục đầu, không cần bật "Email link").

Rồi vào tab **Settings → Authorized domains → Add domain** và thêm: `longcaotien.github.io`

## 3. Tạo tài khoản quản lý (mật khẩu do bạn đặt)
Vào **Authentication → Users → Add user**:
- Email: `admin@biomaster.app` (có thể dùng email khác, không cần là email thật, nhưng phải khác email Google bạn hay dùng để học).
- Password: mật khẩu bạn tự đặt, nên dài và khó đoán.

Quên mật khẩu thì vào lại trang này, bấm dấu ba chấm cạnh tài khoản → **Reset password** hoặc xoá rồi tạo lại.

## 4. Tạo cơ sở dữ liệu và quy tắc bảo vệ
1. **Build → Firestore Database → Create database**, chọn **Production mode**, chọn vị trí gần Việt Nam (ví dụ `asia-southeast1`).
2. Mở tab **Rules**, xoá nội dung cũ, dán toàn bộ nội dung file `firestore.rules`.
3. Nếu bạn dùng email quản lý khác `admin@biomaster.app` thì sửa dòng `request.auth.token.email == '...'` cho trùng, rồi bấm **Publish**.

## 5. Lấy cấu hình và điền vào web
1. **Project settings (biểu tượng bánh răng) → Your apps → biểu tượng `</>` (Web)**, đặt tên app, bấm Register app.
2. Copy các giá trị `apiKey`, `authDomain`, `projectId`, `appId` trong `firebaseConfig`.
3. Dán vào file `firebase-config.js` (thay các chữ `DIEN_...`). Nếu đổi email quản lý thì sửa `BIO_ADMIN_EMAIL` cho trùng.
4. Commit và push lên GitHub. Sau vài phút web yêu cầu đăng nhập Google.

## 6. Dùng trang quản lý
Mở `https://longcaotien.github.io/on_tap_sinh_hoc/admin.html`, đăng nhập bằng email và mật khẩu ở bước 3. Tại đây bạn:
- Xem danh sách người đã đăng nhập, số lần vào, lần đầu và lần gần nhất.
- Bấm **Chặn** / **Bỏ chặn**. Người đang mở trang bị chặn sẽ bị đưa ra màn hình "Tài khoản đã bị chặn" gần như ngay lập tức.

## Lưu ý
- Người dùng mở web trong Zalo/Facebook sẽ không đăng nhập Google được (Google không cho). Trang sẽ nhắc họ mở bằng Chrome/Safari.
- Chặn là chặn theo **tài khoản Google**. Người bị chặn có thể dùng tài khoản Google khác để vào lại.
- Bộ câu hỏi hiện nằm trong `index.html`, nên người rành kỹ thuật vẫn xem được bằng "xem nguồn trang" dù bị chặn. Muốn chặn triệt để thì phải chuyển bộ câu hỏi lên Firestore.
- Trang có lưu tên, email và ảnh đại diện Google của người dùng khi họ đăng nhập.
