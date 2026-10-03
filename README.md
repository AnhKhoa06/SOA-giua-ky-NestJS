## Các bước thực hiện và câu lệnh mẫu để dán vào AI

### Bước 1: Đính kèm đủ các file sau cho AI (không bỏ file nào)

- File slide yêu cầu của bài (phần "Phần demo") - (nếu lần trước gửi rồi thì k cần đính kèm nữa)
- `frontend_react/HUONG_DAN_VIET_TRANG.md`
- `frontend_react/src/api.js`
- `frontend_react/src/components/Modal.jsx`
- `frontend_react/src/components/ConfirmDialog.jsx`
- `frontend_react/src/components/Toast.jsx`
- `frontend_react/src/App.css`

### Bước 2: Dán câu lệnh của trang mình phụ trách

**Trang Sinh viên (Khương):**

```
Mình dùng React + Vite. Đọc kỹ các file đính kèm. Viết cho mình file
src/pages/SinhVien.jsx: bảng danh sách, thêm, sửa, xóa sinh viên.
- Chỉ dùng các component có sẵn (Modal, ConfirmDialog, useToast, api),
  đúng quy ước class trong HUONG_DAN_VIET_TRANG.md.
- Không tạo CSS mới, không sửa file khác.
- Không hiển thị cột password và token.
- Trường: MaSV (bắt buộc), hoTen (bắt buộc), email (đúng định dạng), lop, password.
- Khóa là MaSV: khi sửa thì không cho đổi MaSV. Sửa dùng PATCH /sinh-vien/:MaSV.
- Có trạng thái đang tải và trạng thái bảng trống.
- Xóa phải qua ConfirmDialog. Lỗi backend (400, 404, 409) hiện bằng toast.error(e.message).
```

**Trang Đề tài (Khang):**

```
Mình dùng React + Vite. Đọc kỹ các file đính kèm. Viết cho mình file
src/pages/DeTai.jsx: bảng danh sách, thêm, sửa, xóa đề tài.
- Chỉ dùng các component có sẵn (Modal, ConfirmDialog, useToast, api),
  đúng quy ước class trong HUONG_DAN_VIET_TRANG.md.
- Không tạo CSS mới, không sửa file khác.
- Trường: tenDeTai (bắt buộc), moTa, giangVienHuongDan, soLuongToiDa (số nguyên từ 1).
- Khóa là maDeTai (tự tăng, không cho nhập). Sửa dùng PUT /de-tai/:id.
- Có trạng thái đang tải và trạng thái bảng trống.
- Xóa phải qua ConfirmDialog. Khi xóa đề tài đã có đăng ký, backend trả 409,
  hiện thông báo đó bằng toast.error(e.message).
```

### Bước 3: Kiểm tra trước khi push

- Chạy backend và frontend, thử đủ thêm, sửa, xóa và các ca lỗi.
- Chỉ add đúng file trang của mình, không dùng `git add .`.
- Gửi ảnh chụp trang cho nhóm trưởng xem giao diện có đồng bộ không.
