# Cài đặt đăng nhập Google và trang quản lý

Firebase đã được cấu hình trong `firebase-config.js`. Chỉ còn ôn tập và luyện tập 50 câu trong `questions.js`; đề riêng 20 câu và chia sẻ màn hình đã tắt. Firebase Authentication/Firestore cho đăng nhập và quản lý có hạn mức gói miễn phí (Spark).

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
- Email: dùng địa chỉ trong `firebase-config.js` (`BIO_ADMIN_EMAIL`) và `firestore.rules` (hiện là `longbao123789@gmail.com`). Để an toàn, nên dùng tài khoản quản lý riêng, không dùng Google để làm bài.
- Password: mật khẩu bạn tự đặt, nên dài và khó đoán.

Quên mật khẩu thì vào lại trang này, bấm dấu ba chấm cạnh tài khoản → **Reset password** hoặc xoá rồi tạo lại.

Nếu email quản lý là Gmail thật và bạn từng đăng nhập Google bằng chính email đó ở trang làm bài, Firebase sẽ tự gỡ mật khẩu của tài khoản (báo "Sai email hoặc mật khẩu" dù nhập đúng). Khi đó mở `admin.html`, bấm **Quên mật khẩu / đặt lại mật khẩu**, làm theo thư gửi về để đặt lại. Sau lần đặt lại này mật khẩu sẽ không bị gỡ nữa.

## 4. Tạo cơ sở dữ liệu và quy tắc bảo vệ
1. **Build → Firestore Database → Create database**, chọn **Production mode**, chọn vị trí gần Việt Nam (ví dụ `asia-southeast1`).
2. Mở tab **Rules**, xoá nội dung cũ, dán toàn bộ nội dung file `firestore.rules`.
3. Nếu bạn dùng email quản lý khác trong `firebase-config.js` thì sửa dòng `request.auth.token.email == '...'` cho trùng, rồi bấm **Publish**.

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
- Tab **Bảng xếp hạng**: xem thứ hạng và xoá điểm của một người. Nút **Đóng bảng xếp hạng** / **Mở lại bảng xếp hạng** ẩn hoặc hiện bảng với người học; trong lúc đóng điểm vẫn được ghi.
- Tab **Câu hay sai**: câu nào đang có nhiều người sai nhất.
- Ô **Bảo trì** ở đầu trang: bấm **Tắt web để bảo trì** thì mọi người học (kể cả đang mở trang) chỉ thấy màn hình "Trang đang bảo trì" kèm lời nhắn của bạn; bấm **Mở lại web** thì trang tự mở lại cho họ. Trang quản lý không bị ảnh hưởng.
- Tab **Đang làm**: ai đang mở trang, đang ở trang chủ / ôn tập / kiểm tra, làm tới câu mấy và điểm hiện tại.
- Không còn chức năng xem trực tiếp hoặc xem bài mô phỏng từng câu. Tab **Đang làm** chỉ có trạng thái/tiến độ tổng quát. Lịch sử câu sai và điểm cũ vẫn có thể xem trong các mục khác.

Bảo trì và trạng thái tổng quát dùng `settings` và `presence`; cần Publish lại `firestore.rules` khi thay đổi rules.

## 7. Tắt đề 20 câu và chia sẻ màn hình

- Đã bỏ nút bắt đầu đề 20 câu, client chấm đề, chức năng chia sẻ WebRTC, màn hình xem trực tiếp và bản xem lại câu trả lời đang chọn. Ôn tập và luyện tập 50 câu thông thường vẫn hoạt động, điểm/câu sai lưu như trước. Bảng xếp hạng và dữ liệu từ phiên bản cũ chưa bị xóa tự động, nhưng không còn bài 20 câu mới để ghi điểm.
- **Bắt buộc Publish `firestore.rules` mới** tại Firebase Console → Firestore Database → Rules: quy tắc mới từ chối mọi thao tác tới `screenShares` và từ chối ghi bản sao đáp án từng câu (`presence.ans`/`presence.cur`). Chỉ merge lên GitHub Pages không thay đổi rules đã công bố. Rules không xóa dữ liệu cũ; nếu muốn xóa SDP/tín hiệu cũ trong `screenShares`, cần chủ động xóa collection đó trong Firebase Console. Trước khi Publish, bản web cũ còn mở có thể tiếp tục hoạt động cho đến khi nó tải lại hoặc dừng chia sẻ.
- Nếu **từng triển khai Firebase Cloud Functions**, việc xóa mã và bỏ cấu hình `functions` trong repo **không xóa Function đang chạy**. Dùng Firebase Console hoặc Firebase CLI (với đúng dự án và khu vực `asia-southeast1`) để xóa riêng: `startSecureExam`, `submitSecureAnswer`, `reportSecureSignal`, `leaveSecureExam`, `getSecureExam`. Hãy xác nhận tên/dự án trước khi xóa. Cloud Functions dùng Admin SDK nên Firestore Rules **không chặn được** Function đã triển khai; đây là bước cần làm để tắt hoàn toàn backend. Không bật gói trả phí chỉ để xóa nếu dự án không có Functions.
- Không cần xóa dữ liệu lịch sử/điểm cũ nếu bạn muốn giữ hồ sơ. Việc tắt trang không đồng nghĩa xóa dữ liệu đã lưu trên máy người học hoặc trong Firestore.

## 8. Tự cập nhật phiên bản

GitHub Actions triển khai giao diện lên Pages. Người đang làm dở phần luyện tập 50 câu sẽ thấy thanh nhắc cập nhật; sau khi họ rời bài, trang tải bản mới. Bản web cũ được mở trước khi triển khai có thể còn chạy cho tới khi tải lại. Chỉ tài nguyên tĩnh cần thiết được đưa lên Pages; không đưa rules hay thư mục Git lên hosting.

## Mở từ Zalo, Messenger, Facebook…

Nếu bấm liên kết trong ứng dụng và không đăng nhập được Google, trang sẽ hiện hướng dẫn trước nút đăng nhập. Trên Android có thể **thử** bấm “Mở bằng Chrome”; nếu app chặn `intent://`, bấm menu **⋮ / ... → Mở bằng trình duyệt** hoặc **Sao chép đường dẫn** rồi dán vào Chrome. Trên iPhone/iPad dùng menu ứng dụng **Mở trong Safari** (nếu có) hoặc sao chép đường dẫn, mở Safari và dán. Đăng nhập lại ở trình duyệt ngoài vì phiên đăng nhập trong ứng dụng không được chuyển theo. Không có cách web tĩnh ép Zalo/Messenger tự mở ngoài ứng dụng từ cú bấm liên kết của người gửi; ứng dụng quyết định việc đó.
