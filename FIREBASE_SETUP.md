# Cài đặt đăng nhập Google và trang quản lý

Firebase đã được cấu hình trong `firebase-config.js`. Phần đăng nhập/ôn tập có thể dùng Firebase miễn phí trong hạn mức; **đề bảo vệ cần Cloud Functions (gói Blaze, có thể phát sinh phí)**. Nếu chưa triển khai Functions, chỉ phần ôn tập/luyện tập cũ hoạt động.

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

## 7. Bảng xếp hạng và ôn tập câu sai
Đề bảo vệ lưu điểm do Cloud Functions chấm vào `secureScores` (không chứa email). Luyện tập phản xạ chỉ lưu kết quả tham khảo trên máy và `progress` (câu sai, lịch sử); không được ghi vào bảng xếp hạng bảo vệ.
**Mỗi khi `firestore.rules` thay đổi, phải dán lại toàn bộ file vào Firestore Database → Rules → Publish**, nếu không bảng xếp hạng và trang quản lý sẽ báo thiếu quyền. Khi chưa Publish, câu sai vẫn được lưu trên máy của người học.

Điểm đề bảo vệ được chấm trên máy chủ. Dữ liệu cũ trong `scores` từng do trình duyệt tự ghi có thể không đáng tin; bảng mới `secureScores` bắt đầu trống và không kế thừa điểm cũ.

## Lưu ý
- Người dùng mở web trong Zalo/Facebook sẽ không đăng nhập Google được (Google không cho). Trang sẽ nhắc họ mở bằng Chrome/Safari.
- Chặn là chặn theo **tài khoản Google**. Người bị chặn có thể dùng tài khoản Google khác để vào lại.
- Bộ **ôn tập cũ** nằm trong `questions.js` và luôn công khai. Ngân hàng đề **bảo vệ riêng** phải khác bộ ôn tập và chỉ được nhập qua trang admin vào Firestore; không commit đáp án lên GitHub.
- Trang có lưu tên, email và ảnh đại diện Google của người dùng khi họ đăng nhập.

## 8. Tự cập nhật phiên bản
Mỗi lần deploy, GitHub Actions gắn mã phiên bản vào trang và tạo `version.json`. Trang của người học hỏi lại file này mỗi lần mở trang, mỗi lần quay lại tab và mỗi phút; thấy bản mới thì tự tải lại, bỏ qua bộ nhớ đệm. Riêng người đang làm dở bài kiểm tra chỉ thấy thanh nhắc "Cập nhật ngay" và được tải lại khi làm xong, để không mất bài.

## Giám sát đề 20 câu và giới hạn bảo mật
- Trang quản lý → **Giám sát đề 20 câu**: chọn số cảnh báo tối đa (1–10), bật/tắt theo dõi **mất tiêu điểm**. Chuyển tab luôn bị cảnh báo. Đạt giới hạn sẽ dừng phiên đề trên máy chủ. Sau khi thay đổi `firestore.rules`, phải Publish lại trong Firebase Console để cài đặt và dữ liệu hoạt động.
- Trình duyệt **không cho trang web xem ứng dụng/cửa sổ khác hoặc nhận biết Gemini trên màn hình**. Mất tiêu điểm chỉ là dấu hiệu gián tiếp, có thể cảnh báo nhầm (thông báo, trình quản lý mật khẩu, công cụ hỗ trợ). Không thu màn hình hay bật camera.
- GitHub Pages là hosting tĩnh: bộ ôn tập `questions.js` và HTML **không thể giấu khỏi người học**, kể cả có chặn chuột phải, F12 hay đổi tên file. Quy trình deploy nay chỉ xuất bản các tài nguyên cần thiết, không xuất bản rules, tài liệu, `.git`. Không đặt dữ liệu bí mật vào các file công khai.
- **Không thể chống gian lận tuyệt đối trên web tĩnh.** Điểm đề bảo vệ và các cảnh báo nhận được đã được lưu phía máy chủ; tải lại sẽ tiếp tục đề đang làm. Tuy vậy, tín hiệu rời trang có thể không gửi được khi tắt mạng/đóng trình duyệt, và người học vẫn có thể dùng thiết bị khác. Đề bảo vệ đã có backend xác thực và chấm điểm, nhưng với kỳ thi quan trọng vẫn cần giám sát trực tiếp. Không coi cảnh báo mất tiêu điểm là bằng chứng dùng AI.


## 9. Triển khai đề 20 câu bảo vệ (bắt buộc để nút mới hoạt động)

**GitHub Pages chỉ triển khai giao diện. Firebase Functions và Firestore Rules không được triển khai tự động bởi workflow Pages.** Bạn cần thực hiện một lần dưới tài khoản chủ sở hữu Firebase:

1. Firebase Console → **Billing**: bật gói **Blaze** (Cloud Functions thế hệ 2 yêu cầu thanh toán theo sử dụng; có thể có hạn mức miễn phí, nhưng không đảm bảo không phát sinh phí). Đặt cảnh báo ngân sách. Bật Firestore, Authentication Google và vùng `asia-southeast1`. Node.js 22 cần dự án/CLI hỗ trợ bản hiện tại.
2. Cài Firebase CLI bằng `npm install -g firebase-tools`, đăng nhập bằng `firebase login` **trên máy của bạn** (không gửi mật khẩu hoặc token vào chat). Ở thư mục repo, chạy `cd functions && npm ci && npm test && cd ..`, sau đó `firebase deploy --only functions,firestore:rules --project biomaster-df0b3`. Nếu CLI yêu cầu bật API của Google Cloud, xác nhận trong tài khoản sở hữu dự án.
3. Mở trang quản lý → **Ngân hàng đề bảo vệ** → chọn `private-bank.seed.json` trong workspace và bấm **Nhập ngân hàng đề**. File mẫu này **bị .gitignore loại khỏi Git**, không có trong GitHub Pages hoặc bản deploy; giữ nó riêng, đừng tải lên repo. Bạn có thể tự biên soạn câu hỏi mới theo định dạng JSON hiển thị trong trang admin. Ít nhất 10 câu Bài 6 và 10 câu Bài 8; mẫu có 20 câu mỗi bài. Không nhập lại y nguyên các câu trong `questions.js` công khai nếu cần bảo mật đáp án.
4. Đẩy code giao diện lên nhánh deploy GitHub Pages của bạn, chờ Pages cập nhật, rồi đăng nhập Google và thử hoàn thành 1 đề. Điểm của đề bảo vệ sẽ hiện trong `secureScores` và bảng xếp hạng mới. Bảng điểm `scores` cũ không còn sử dụng.

**Lưu ý bảo mật:** `examBank/current` và `examSessions/{uid}` không cho người học đọc trực tiếp qua Firestore Rules. Cloud Functions dùng Admin SDK đọc chúng rồi chỉ trả về *một câu* chưa kèm đáp án. Khi làm xong mới trả điểm. 25 phút/đề, tối đa 5 lượt bắt đầu/ngày UTC, tối thiểu 1 phút giữa các lượt. Số cảnh báo được chốt khi bắt đầu đề. Tắt mạng/đóng tab quá nhanh có thể làm mất tín hiệu rời trang; không có cách phát hiện đáng tin cậy Gemini, màn hình khác hay thiết bị khác. Bảng `presence` và `progress` của chế độ luyện tập vẫn là dữ liệu do client gửi, **không dùng làm bằng chứng chống gian lận**.
