# Hướng dẫn viết trang (frontend_react)

Mỗi người chỉ sửa file trang của mình trong `src/pages/`.
KHÔNG sửa: `api.js`, `components/`, `App.jsx`, `App.css`. Cần thêm gì thì nhắn Khoa.

## Công cụ dùng chung

- `api` (src/api.js): api.get / post / put / patch / delete. Lỗi ném ra Error có `.message` tiếng Việt và `.status`.
- `useToast()` (components/Toast): toast.success(msg), toast.error(msg)
- `Modal` (components/Modal): props open, title, onClose, children, footer
- `ConfirmDialog` (components/ConfirmDialog): props open, message, loading, onConfirm, onCancel

## Quy ước giao diện

- Tiêu đề trang: `<div className="page-header"><h2>...</h2><button>Thêm</button></div>`
- Bảng bọc trong `<div className="card">`; cột thao tác dùng `<div className="table-actions">` với nút `btn-edit` và `btn-delete`
- Form trong popup dùng `.form-group` (label + input)
- Lỗi và thành công hiện bằng toast, không dùng alert
- Có trạng thái đang tải và trạng thái bảng trống (`.loading-state`, `.empty-state`)
- Xóa phải qua ConfirmDialog

## API của từng trang

- Sinh viên: POST/GET /sinh-vien, GET/PATCH/DELETE /sinh-vien/:MaSV
  Trường: MaSV, hoTen, email, lop, password
- Đề tài: POST/GET /de-tai, GET/PUT/DELETE /de-tai/:id
  Trường: maDeTai, tenDeTai, moTa, giangVienHuongDan, soLuongToiDa
- Đăng ký: xem phần Khoa làm

## Mã lỗi backend có thể trả

400 (thiếu hoặc sai dữ liệu), 404 (không tồn tại), 409 (trùng, hoặc xóa dính khóa ngoại)
