import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../api";
import { useToast } from "../components/Toast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function SinhVien() {
  const toast = useToast();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho modal thêm/sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = thêm mới, có giá trị = đang sửa
  const [form, setForm] = useState({
    MaSV: "",
    hoTen: "",
    email: "",
    lop: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  // State cho confirm xóa
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ===== Tải danh sách =====
  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await api.get("/sinh-vien");
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Mở modal thêm =====
  const openAdd = () => {
    setEditing(null);
    setForm({ MaSV: "", hoTen: "", email: "", lop: "", password: "" });
    setModalOpen(true);
  };

  // ===== Mở modal sửa =====
  const openEdit = (sv) => {
    setEditing(sv);
    setForm({
      MaSV: sv.MaSV || "",
      hoTen: sv.hoTen || "",
      email: sv.email || "",
      lop: sv.lop || "",
      password: "", // không hiển thị password cũ
    });
    setModalOpen(true);
  };

  // ===== Lưu (thêm hoặc sửa) =====
  const handleSave = async () => {
    // Validate
    if (!form.MaSV.trim()) {
      toast.error("Mã sinh viên không được để trống");
      return;
    }
    if (!form.hoTen.trim()) {
      toast.error("Họ tên không được để trống");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        // Sửa: PATCH /sinh-vien/:MaSV, không gửi MaSV
        const body = {
          hoTen: form.hoTen,
          email: form.email,
          lop: form.lop,
        };
        if (form.password.trim()) body.password = form.password;
        await api.patch(`/sinh-vien/${editing.MaSV}`, body);
        toast.success("Cập nhật sinh viên thành công");
      } else {
        // Thêm mới: POST /sinh-vien
        await api.post("/sinh-vien", form);
        toast.success("Thêm sinh viên thành công");
      }
      setModalOpen(false);
      fetchList();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ===== Xóa =====
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/sinh-vien/${deleteTarget.MaSV}`);
      toast.success("Xóa sinh viên thành công");
      setDeleteTarget(null);
      fetchList();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý sinh viên</h2>
        <button onClick={openAdd}>
          <Plus size={16} /> Thêm sinh viên
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : list.length === 0 ? (
          <div className="empty-state">Chưa có sinh viên nào</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Lớp</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((sv) => (
                <tr key={sv.MaSV}>
                  <td>{sv.MaSV}</td>
                  <td>{sv.hoTen}</td>
                  <td>{sv.email}</td>
                  <td>{sv.lop}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit" onClick={() => openEdit(sv)}>
                        <Pencil size={14} /> Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => setDeleteTarget(sv)}
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal thêm/sửa */}
      <Modal
        open={modalOpen}
        title={editing ? "Sửa sinh viên" : "Thêm sinh viên"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Hủy
            </button>
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label>Mã sinh viên *</label>
          <input
            value={form.MaSV}
            onChange={(e) => setForm({ ...form, MaSV: e.target.value })}
            disabled={!!editing}
            placeholder="VD: 4651050123"
          />
        </div>
        <div className="form-group">
          <label>Họ tên *</label>
          <input
            value={form.hoTen}
            onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="a@example.com"
          />
        </div>
        <div className="form-group">
          <label>Lớp</label>
          <input
            value={form.lop}
            onChange={(e) => setForm({ ...form, lop: e.target.value })}
            placeholder="VD: CNTT K46E"
          />
        </div>
        <div className="form-group">
          <label>{editing ? "Mật khẩu mới (bỏ trống nếu không đổi)" : "Mật khẩu"}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••"
          />
        </div>
      </Modal>

      {/* Confirm xóa */}
      <ConfirmDialog
        open={!!deleteTarget}
        message={`Bạn có chắc muốn xóa sinh viên "${deleteTarget?.hoTen}" (${deleteTarget?.MaSV})?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}