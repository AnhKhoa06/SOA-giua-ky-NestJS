# SOA-giua-ky-NestJS

Bài tập giữa kỳ môn SOA — Hệ thống quản lý đồ án tốt nghiệp, xây dựng theo kiến trúc SOA. Backend dùng NestJS, frontend dùng React (Vite).

## Cấu trúc dự án

```
SOA-giua-ky-NestJS/
├── backend_nestjs/      # Backend (NestJS + MySQL)
└── frontend_react/      # Frontend (React + Vite)
```

### Backend (`backend_nestjs/`)

- `src/sinh-vien/` — Module quản lý Sinh viên (phụ trách: **Khương**)
- `src/de-tai/` — Module quản lý Đề tài (phụ trách: **Khang**)
- `src/dang-ky/` — Module quản lý Đăng ký đề tài (phụ trách: **Nhóm trưởng**)
- `database.sql` — File SQL tạo database và 3 bảng dùng chung cho cả nhóm

### Frontend (`frontend_react/`)

- `src/pages/SinhVien.jsx` — Trang quản lý Sinh viên
- `src/pages/DeTai.jsx` — Trang quản lý Đề tài
- `src/pages/DangKy.jsx` — Trang quản lý Đăng ký đề tài
- `src/pages/Login.jsx` — Trang đăng nhập
- `src/App.jsx`, `src/App.css` — Bố cục chính và giao diện (sidebar, thẻ người dùng, ...)

## Lưu ý quan trọng trước khi code

Nhớ xem kỹ file slide nội dung yêu cầu của bài (đặc biệt phần "Phần demo") trước khi code. Nếu dùng AI hỗ trợ, hãy đính kèm file slide đó vào cho AI đọc, rồi nói rõ mình đang làm module nào, để AI hiểu đúng ngữ cảnh và làm đúng yêu cầu.

## Yêu cầu môi trường

- Node.js (khuyến nghị bản LTS) và npm
- MySQL Server và MySQL Workbench
- Git

## Hướng dẫn khi nhận code (clone về máy)

1. **Clone repo về máy:**

```
   git clone https://github.com/AnhKhoa06/SOA-giua-ky-NestJS.git
   cd SOA-giua-ky-NestJS
```

2. **Cài đặt thư viện cho cả hai phần:**

```
   cd backend_nestjs
   npm install

   cd ../frontend_react
   npm install
```

3. **Tạo database:** Mở MySQL Workbench, mở file `backend_nestjs/database.sql`, chạy toàn bộ đoạn SQL đó để tạo database `quanly_dotot_nghiep` và 3 bảng (`SinhVien`, `DeTai`, `DangKy`) giống hệt cấu trúc chung của nhóm.

4. **Cấu hình mật khẩu MySQL:** Mở file `backend_nestjs/src/app.module.ts`, tìm dòng:

```typescript
   password: '123456',
```

   Sửa lại thành đúng mật khẩu MySQL trên máy bạn.

5. **Bắt đầu code:** Vào đúng thư mục module được phân công, viết CRUD (Create, Read, Update, Delete):
   - **Khương** → code trong `backend_nestjs/src/sinh-vien/`
   - **Khang** → code trong `backend_nestjs/src/de-tai/`

   Chỉ code trong đúng module của mình, không sửa code ở module khác để tránh xung đột khi gộp code.

6. **Chạy thử project** (mở 2 terminal riêng, chạy song song):

   - Backend:

```
     cd backend_nestjs
     npm run start:dev
```

   - Frontend:

```
     cd frontend_react
     npm run dev
```

   Frontend chạy ở địa chỉ Vite in ra trong terminal (thường là `http://localhost:5173`). Phải bật backend trước thì frontend mới lấy được dữ liệu.

7. **Đẩy code lên khi xong** (chạy ở thư mục gốc của repo):

```
   git add .
   git commit -m "Hoan thanh CRUD module <ten module>"
   git push
```

## Lưu ý về Git

- Không đẩy `node_modules/` và file `.env` lên repo (đã có trong `.gitignore` của từng thư mục).
- Trước khi bắt đầu làm việc, luôn chạy `git pull` để lấy code mới nhất, tránh xung đột khi gộp.
