
# Authentication and Multi-Factor Authentication

## 1. Definition

**Authentication** là quá trình xác minh danh tính của một người dùng, thiết bị hoặc hệ thống. Quá trình này giúp đảm bảo chỉ những người có quyền hợp lệ mới có thể truy cập vào các tài nguyên được bảo vệ.

## 2. Key Points

Có ba loại **Authentication Factors** phổ biến:

- **Something you know:** Thứ bạn biết, ví dụ như password (mật khẩu) hoặc PIN.
- **Something you have:** Thứ bạn sở hữu, ví dụ như security token, smart card hoặc điện thoại.
- **Something you are:** Đặc điểm sinh trắc học của bạn, ví dụ như fingerprint (vân tay) hoặc face recognition (nhận diện khuôn mặt).

**Multi-Factor Authentication (MFA)** yêu cầu sử dụng ít nhất hai loại Authentication Factors khác nhau.

Một password mạnh nên độc nhất và khó đoán.

MFA cung cấp thêm một lớp bảo vệ, ngay cả khi password của bạn bị đánh cắp.

## 3. Example

Một sinh viên đăng nhập vào tài khoản trường học bằng password, sau đó nhập mã xác minh từ ứng dụng authenticator trên điện thoại.

Đây là MFA vì nó sử dụng hai loại Authentication Factors:

- **Something you know:** Password.
- **Something you have:** Điện thoại.

## 4. Exam Tip

> Hai password KHÔNG được xem là MFA vì cả hai đều thuộc cùng một loại factor: Something you know.
>
> MFA yêu cầu sử dụng các loại Authentication Factors khác nhau.
