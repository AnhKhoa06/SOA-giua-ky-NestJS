# SOA-giua-ky-NestJS

Bài tập giữa kỳ môn SOA — Hệ thống quản lý đồ án tốt nghiệp, xây dựng theo kiến trúc SOA bằng NestJS.

## Cấu trúc dự án

- `src/sinh-vien/` — Module quản lý Sinh viên (phụ trách: **Khương**)
- `src/de-tai/` — Module quản lý Đề tài (phụ trách: **Khang**)
- `src/dang-ky/` — Module quản lý Đăng ký đề tài (phụ trách: **Nhóm trưởng**)
- `database.sql` — File SQL tạo database và 3 bảng dùng chung cho cả nhóm

## Hướng dẫn khi nhận code (clone về máy)

1. **Clone repo về máy:**

   ```
   git clone https://github.com/AnhKhoa06/SOA-giua-ky-NestJS.git
   ```

2. **Cài đặt thư viện:**

   ```
   cd SOA-giua-ky-NestJS
   npm install
   ```

3. **Tạo database:** Mở MySQL Workbench, mở file `database.sql` trong project, chạy toàn bộ đoạn SQL đó để tạo database `quanly_dotot_nghiep` và 3 bảng (`SinhVien`, `DeTai`, `DangKy`) giống hệt cấu trúc chung của nhóm.

4. **Cấu hình mật khẩu MySQL:** Mở file `src/app.module.ts`, tìm dòng:

   ```typescript
   password: '123456',
   ```

   Sửa lại thành đúng mật khẩu MySQL trên máy bạn.

5. **Bắt đầu code:** Vào đúng thư mục module được phân công, viết CRUD (Create, Read, Update, Delete):
   - **Khương** → code trong `src/sinh-vien/`
   - **Khang** → code trong `src/de-tai/`

   Chỉ code trong đúng module của mình, không sửa code ở module khác để tránh xung đột khi gộp code.

6. **Chạy thử project:**

   ```
   npm run start:dev
   ```

7. **Đẩy code lên khi xong:**

   ```
   git add .
   git commit -m "Hoan thanh CRUD module <ten module>"
   git push
   ```
