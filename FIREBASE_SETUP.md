# Cài đặt đăng nhập Google và trang quản lý

Firebase đã được cấu hình trong `firebase-config.js`. **Đề 20 câu miễn phí không cần Cloud Functions, gói Blaze hoặc nhập file JSON.** Nó dùng 50 câu trong `questions.js`, chạy và lưu điểm trên thiết bị; Firebase Authentication/Firestore cho đăng nhập/admin có hạn mức gói miễn phí (Spark).

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
- Nút **Xem màn hình** trong tab đó: hiện từng câu người học đang làm, đáp án họ đã chọn, đúng hay sai, và tự cuộn theo câu vừa làm. Đây là bản dựng lại từ đáp án gửi về (chậm vài giây), không phải quay video màn hình.

Hai tính năng trên dùng thêm hai bảng `settings` và `presence`, nên cũng cần Publish lại `firestore.rules`.

## 7. Đề luyện miễn phí 20 câu

- Chọn **Làm đề miễn phí 20 câu ngẫu nhiên** ở trang chủ. Hệ thống lấy 10 câu Bài 6 và 10 câu Bài 8 từ 50 câu công khai: mỗi bài 6 ABCD, 2 Đúng/Sai, 2 trả lời ngắn. Câu hỏi và lựa chọn ABCD được trộn mỗi lượt; mệnh đề Đúng/Sai không gắn hình cũng được trộn. Hai thiết bị có thể thấy đề khác nhau. **Không cần chọn file ở trang admin**, không cần triển khai Functions hay bật Blaze.
- Trên điện thoại/máy tính bảng: đăng nhập rồi chọn **Bắt đầu luyện tập không giám sát**. Không có chia sẻ màn hình/toàn màn hình, không gửi video, admin không thể xem trực tiếp; chỉ cảnh báo chuyển tab/mất tiêu điểm được lưu cục bộ. Đây là luyện tập cá nhân, không phải đề thi được giám sát. Lượt đang làm ở chế độ khác trên cùng trình duyệt sẽ không tự đổi sang chế độ hiện tại: lượt cũ dừng, bạn cần xác nhận lượt mới.
- Một lượt có 25 phút. Tiến độ, điểm và số lần cảnh báo được lưu trong `localStorage` của trình duyệt đang dùng để tải lại có thể tiếp tục. Admin có thể đặt giới hạn cảnh báo và bật/tắt cảnh báo mất tiêu điểm qua `settings/site` trên Firestore (cần đăng nhập/cập nhật Rules); chuyển tab luôn được cảnh báo. Nếu chưa đọc được cài đặt, mặc định 3 cảnh báo.
- **Đây chỉ là luyện tập, không phải hệ thống thi chống gian lận.** `questions.js` công khai chứa toàn bộ đáp án; người dùng có thể sửa điểm, giờ và cảnh báo trong trình duyệt, hoặc dùng thiết bị khác. Không phát hiện được Gemini trên màn hình. Điểm đề miễn phí **không gửi lên `secureScores`/bảng xếp hạng**, admin không thể xác thực điểm từ chế độ này. Bảng xếp hạng cũ chỉ dành cho chế độ máy chủ tùy chọn.
- Mục **Ngân hàng đề cho chế độ máy chủ** ở trang admin **không ảnh hưởng** đến đề miễn phí. Nếu chỉ muốn miễn phí thì bỏ qua.

## 8. Tự cập nhật phiên bản

GitHub Actions triển khai giao diện lên Pages. Đang làm dở đề sẽ thấy thanh nhắc cập nhật; làm xong mới tải phiên bản mới. Chỉ các tài nguyên công khai cần thiết được đưa lên Pages; không đưa rules hay thư mục Git lên hosting.

## 9. Nếu sau này muốn chấm điểm trên máy chủ (tùy chọn, KHÔNG miễn phí bảo đảm)

Mã mẫu ở `functions/`, `firebase.json` và mục nhập JSON trong trang admin còn lại cho phương án Cloud Functions. Firebase Functions thế hệ 2 yêu cầu gói **Blaze** có thể phát sinh phí. Giao diện đề miễn phí hiện tại **không gọi Functions**, kể cả khi chúng đã được triển khai. Không bật Blaze chỉ để sửa lỗi thông báo cũ.

Nếu tự triển khai lại phiên bản máy chủ, cần thay giao diện đề miễn phí bằng client Functions tương ứng và kiểm thử riêng. Không dùng 50 câu công khai để kỳ vọng giấu đáp án. Có thể tạo file JSON theo định dạng tùy chọn bằng `node scripts/export-legacy-bank.cjs`, nhưng file có đáp án phải giữ ngoài Git. Dữ liệu `secureScores` trước đây không đại diện cho điểm đề miễn phí.

## 10. Toàn màn hình và chia sẻ màn hình trực tiếp (gói Firebase Spark)

- **Chế độ giám sát trên máy tính** yêu cầu **đăng nhập Google**, trình duyệt hỗ trợ Fullscreen API + `getDisplayMedia`/WebRTC (nên dùng Chrome/Edge trên máy tính) và **Publish lại `firestore.rules`** để bật `screenShares/{uid}`. Không cần Cloud Functions/Blaze. Firestore Spark có hạn mức miễn phí; hết hạn mức thì tính năng có thể ngừng hoạt động, không hứa hoạt động không giới hạn.
- Trên máy tính, nhấn bắt đầu → trình duyệt xin toàn màn hình → người học **tự bấm Chia sẻ toàn bộ màn hình** và chọn *Entire screen/Toàn bộ màn hình* trong hộp thoại trình duyệt. Trang không thể tự cấp quyền, không thể ép người học chọn màn hình thật nếu trình duyệt không báo loại màn hình. Từ chối/chọn cửa sổ hay tab/dừng chia sẻ → thoát lượt. Nếu trình duyệt tự thoát fullscreen trong lúc chọn nguồn, bấm **Vào toàn màn hình** trước khi làm tiếp.
- Admin vào `admin.html` → tab **Đang làm** → **Xem trực tiếp**. Video truyền ngang hàng qua WebRTC (không lưu video hay ghi âm); Firestore chỉ giữ tín hiệu kết nối SDP (có thể chứa thông tin kết nối mạng/IP), thời điểm chia sẻ, loại màn hình do trình duyệt tự báo và số cảnh báo tự báo từ client. Người học cần tránh để lộ dữ liệu riêng tư khi chia sẻ. Admin có thể **Đánh dấu nghi vấn** sau khi xem. Nút **Xem bài mô phỏng** khác với xem trực tiếp.
- Chuyển tab, mất tiêu điểm (nếu admin bật), thoát fullscreen, hoặc dừng truyền hình ảnh được cảnh báo/thoát lượt. **Không có nhận diện AI/Gemini tự động từ hình ảnh**; Gemini có thể mở trên thiết bị khác, tín hiệu client có thể sửa giả, và trình duyệt không thể chứng thực video luôn là toàn bộ màn hình. Không dùng các tín hiệu này làm bằng chứng tuyệt đối.
- WebRTC không có TURN trả phí; một số mạng NAT/tường lửa sẽ không kết nối được. Admin có thể chưa online lúc học viên bắt đầu; nếu không kết nối được, người học sẽ thấy lỗi/thoát bài. Đóng cửa sổ xem khi đang kết nối có thể ngắt giám sát và làm lượt thi dừng. Nếu muốn giám sát đáng tin cậy ở quy mô lớn cần hạ tầng và người giám thị riêng, không thể bảo đảm miễn phí hay chống gian lận tuyệt đối.

**Kiểm tra sau khi triển khai:** Dùng một trình duyệt đăng nhập tài khoản Google học viên, trình duyệt khác đăng nhập quản lý tại `admin.html`. Bật toàn màn hình, cấp quyền *Entire screen*, rồi mở tab **Đang làm → Xem trực tiếp** trên máy quản lý. Thử dừng chia sẻ bằng thanh công cụ của trình duyệt: lượt học viên phải tự thoát. Nếu báo `permission-denied`, trước hết hãy Publish lại `firestore.rules`. Nếu chỉ hiện “chờ kết nối” rồi thất bại, mạng hiện tại có thể chặn WebRTC/STUN; thử hai máy trên mạng khác. Phần truyền video cần kiểm thử thủ công trên hai trình duyệt thật, không thể xác thực bằng kiểm thử JavaScript đơn thuần.
