# SOA-giua-ky-NestJS

Bài tập giữa kỳ môn SOA: **Hệ thống quản lý đồ án tốt nghiệp** xây dựng theo kiến trúc hướng dịch vụ (SOA). Backend dùng NestJS + MySQL, frontend dùng React (Vite). Hệ thống dành cho cán bộ khoa, đăng nhập bằng tài khoản quản trị.

## Kiến trúc

```
Frontend (React, :5173)
        │  HTTP/REST (JSON, Bearer JWT)
        ▼
Backend NestJS (:3000)
 ├── Auth      /auth       đăng nhập, refresh, đăng xuất
 ├── SinhVien  /sinh-vien
 ├── DeTai     /de-tai
 └── DangKy    /dang-ky  ──HTTP GET──► /sinh-vien/:MaSV, /de-tai/:id
        │  TypeORM
        ▼
MySQL: SinhVien, DeTai, DangKy
```

Các dịch vụ độc lập, giao tiếp qua HTTP/REST. DangKy không đọc thẳng bảng của hai module kia mà gọi API của chúng qua `HttpService` (có chuyển tiếp token JWT). Địa chỉ dịch vụ cấu hình bằng biến môi trường `SINHVIEN_URL`, `DETAI_URL` (mặc định `http://localhost:3000/...`), nên có thể tách thành các tiến trình riêng mà không sửa code.

## Cấu trúc dự án

```
SOA-giua-ky-NestJS/
├── backend_nestjs/      # Backend (NestJS + MySQL)
│   ├── src/auth/        # JWT access + refresh, guard toàn cục
│   ├── src/sinh-vien/   # Module Sinh viên (Khương)
│   ├── src/de-tai/      # Module Đề tài (Khang)
│   ├── src/dang-ky/     # Module Đăng ký (Khoa)
│   ├── src/common/      # Logging interceptor
│   ├── database.sql     # Tạo database và 3 bảng
│   └── .env.example     # Mẫu cấu hình
└── frontend_react/      # Frontend (React + Vite)
    ├── src/pages/       # Login, SinhVien, DeTai, DangKy
    ├── src/components/  # Modal, ConfirmDialog, Toast dùng chung
    ├── src/api.js       # Gọi API, tự refresh token
    └── HUONG_DAN_VIET_TRANG.md
```

Mỗi module backend có: `controller`, `service`, `entity`, `module`, `dto/`.

## API

| Module | Endpoint |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` |
| Sinh viên | `POST/GET /sinh-vien`, `GET/PATCH/DELETE /sinh-vien/:MaSV` |
| Đề tài | `POST/GET /de-tai`, `GET/PUT/DELETE /de-tai/:id` |
| Đăng ký | `POST/GET /dang-ky`, `GET/PATCH/DELETE /dang-ky/:id` |

Mọi route (trừ login, refresh) yêu cầu header `Authorization: Bearer <access_token>`.

| Mã | Ý nghĩa |
|---|---|
| 200, 201 | Thành công |
| 400 | Dữ liệu thiếu hoặc sai định dạng (validate DTO) |
| 401 | Thiếu token, token sai hoặc hết hạn |
| 404 | Không tìm thấy bản ghi |
| 409 | Trùng dữ liệu, hoặc xóa bản ghi đang được tham chiếu (khóa ngoại) |
| 503 | Dịch vụ phụ thuộc không phản hồi |

Luật nghiệp vụ của `POST /dang-ky`: sinh viên và đề tài phải tồn tại, mỗi sinh viên chỉ có một đăng ký còn hiệu lực, đề tài không vượt `soLuongToiDa`.

## Bảo mật và tính năng bổ sung

- **JWT access token (15 phút) + refresh token (7 ngày)**, ký bằng hai secret khác nhau. Refresh có rotation, đăng xuất sẽ thu hồi.
- **Guard toàn cục**: mọi route bị khóa trừ route gắn `@Public()`.
- **Frontend tự refresh**: gặp 401 thì gọi `/auth/refresh` (chỉ một lần dù nhiều request cùng lỗi) rồi gọi lại request.
- Mật khẩu sinh viên băm **bcrypt**; `password` và `token` không bị trả ra trong response.
- Cấu hình bí mật nằm trong `.env`, không nằm trong mã nguồn.
- **Logging** mỗi request: method, URL, mã trạng thái, thời gian xử lý, người dùng.
- Validate dữ liệu bằng DTO + `class-validator`.

Giới hạn đã biết: hash refresh token lưu trong bộ nhớ (restart backend thì phải đăng nhập lại), chỉ một phiên admin tại một thời điểm, request 401 không có dòng log.

## Yêu cầu môi trường

- Node.js (bản LTS) và npm
- MySQL Server và MySQL Workbench
- Git

## Hướng dẫn chạy (sau khi clone)

1. **Clone repo:**

```
git clone https://github.com/AnhKhoa06/SOA-giua-ky-NestJS.git
cd SOA-giua-ky-NestJS
```

2. **Cài thư viện:**

```
cd backend_nestjs
npm install

cd ../frontend_react
npm install
```

3. **Tạo database:** mở MySQL Workbench, chạy toàn bộ `backend_nestjs/database.sql` để tạo database `quanly_dotot_nghiep` và 3 bảng.

4. **Tạo file cấu hình:** sao chép `backend_nestjs/.env.example` thành `backend_nestjs/.env`, rồi điền:
   - `DB_PASS`: mật khẩu MySQL trên máy bạn
   - `ADMIN_USER`, `ADMIN_PASS`: tài khoản đăng nhập hệ thống (hỏi nhóm trưởng)
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: hai chuỗi bất kỳ, dài, khác nhau

   Thiếu một trong bốn biến `ADMIN_USER`, `ADMIN_PASS`, hai secret thì backend không khởi động. **Không commit file `.env`.**

5. **Chạy project** (hai terminal, bật backend trước):

```
cd backend_nestjs
npm run start:dev
```

```
cd frontend_react
npm run dev
```

   Frontend ở `http://localhost:5173`, backend ở `http://localhost:3000`. Đăng nhập bằng tài khoản admin đã đặt trong `.env`.

   Lưu ý: `start:dev` tự khởi động lại backend mỗi khi lưu file, khiến phiên đăng nhập mất. Khi demo nên dùng `npm run start`.

## Quy tắc làm việc nhóm

- Mỗi người chỉ sửa phần của mình; file dùng chung (`api.js`, `components/`, `App.jsx`, `App.css`) do nhóm trưởng sửa.
- Hướng dẫn viết trang: `frontend_react/HUONG_DAN_VIET_TRANG.md`.
- Test API bằng Postman trước khi báo xong.

## Lưu ý về Git

- Không đẩy `node_modules/` và `.env` (đã có trong `.gitignore`).
- Hạn chế `git add .`; hãy add đúng file mình sửa, rồi:

```
git commit -m "mô tả ngắn"
git pull --rebase --autostash
git push
```

- Trước khi làm việc luôn `git pull`. Gặp conflict thì dừng lại và hỏi nhóm.
