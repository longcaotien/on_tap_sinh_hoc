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

Nếu email quản lý là Gmail thật và bạn từng đăng nhập Google bằng chính email đó ở trang làm bài, Firebase sẽ tự gỡ mật khẩu của tài khoản (báo "Sai email hoặc mật khẩu" dù nhập đúng). Khi đó mở `admin.html`, bấm **Quên mật khẩu / đặt lại mật khẩu**, làm theo thư gửi về để đặt lại. Sau lần đặt lại này mật khẩu sẽ không bị gỡ nữa.

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
- Xem điểm cao nhất, số lượt làm, số câu sai của từng người; sắp xếp, lọc, và **Xuất Excel (CSV)**.
- Bấm **Chi tiết** để xem lịch sử làm bài, các câu đang sai, và xoá điểm / xoá câu sai / xoá người dùng.
- Tab **Bảng xếp hạng**: xem thứ hạng và xoá điểm của một người.
- Tab **Câu hay sai**: câu nào đang có nhiều người sai nhất.
- Ô **Bảo trì** ở đầu trang: bấm **Tắt web để bảo trì** thì mọi người học (kể cả đang mở trang) chỉ thấy màn hình "Trang đang bảo trì" kèm lời nhắn của bạn; bấm **Mở lại web** thì trang tự mở lại cho họ. Trang quản lý không bị ảnh hưởng.
- Tab **Đang làm**: ai đang mở trang, đang ở trang chủ / ôn tập / kiểm tra, làm tới câu mấy và điểm hiện tại. Cập nhật chậm khoảng 20-60 giây.

Hai tính năng trên dùng thêm hai bảng `settings` và `presence`, nên cũng cần Publish lại `firestore.rules`.

## 7. Bảng xếp hạng và ôn tập câu sai
Hai tính năng này lưu thêm dữ liệu vào hai bảng `scores` (điểm, không chứa email) và `progress` (câu sai, lịch sử làm bài).
**Mỗi khi `firestore.rules` thay đổi, phải dán lại toàn bộ file vào Firestore Database → Rules → Publish**, nếu không bảng xếp hạng và trang quản lý sẽ báo thiếu quyền. Khi chưa Publish, câu sai vẫn được lưu trên máy của người học.

Điểm được tính trên trình duyệt của người học rồi gửi lên, nên người rành kỹ thuật có thể tự gửi điểm giả (tối đa 10). Thấy điểm bất thường thì dùng **Xoá điểm** trong trang quản lý.

## Lưu ý
- Người dùng mở web trong Zalo/Facebook sẽ không đăng nhập Google được (Google không cho). Trang sẽ nhắc họ mở bằng Chrome/Safari.
- Chặn là chặn theo **tài khoản Google**. Người bị chặn có thể dùng tài khoản Google khác để vào lại.
- Bộ câu hỏi hiện nằm trong `index.html`, nên người rành kỹ thuật vẫn xem được bằng "xem nguồn trang" dù bị chặn. Muốn chặn triệt để thì phải chuyển bộ câu hỏi lên Firestore.
- Trang có lưu tên, email và ảnh đại diện Google của người dùng khi họ đăng nhập.
