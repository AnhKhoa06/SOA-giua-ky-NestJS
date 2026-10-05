import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../api";
import { useToast } from "../components/Toast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function DeTai() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    tenDeTai: "",
    moTa: "",
    giangVienHuongDan: "",
    soLuongToiDa: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await api.get("/de-tai");
      setList(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setForm({ tenDeTai: "", moTa: "", giangVienHuongDan: "", soLuongToiDa: 1 });
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setForm({
      tenDeTai: item.tenDeTai,
      moTa: item.moTa || "",
      giangVienHuongDan: item.giangVienHuongDan || "",
      soLuongToiDa: item.soLuongToiDa,
    });
    setEditingId(item.maDeTai);
    setModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!form.tenDeTai.trim()) {
      toast.error("Tên đề tài là bắt buộc");
      return;
    }
    const soLuong = parseInt(form.soLuongToiDa, 10);
    if (!Number.isInteger(soLuong) || soLuong < 1) {
      toast.error("Số lượng tối đa phải là số nguyên từ 1 trở lên");
      return;
    }

    try {
      setSaving(true);
      const payload = { ...form, soLuongToiDa: soLuong };

      if (editingId) {
        await api.put(`/de-tai/${editingId}`, payload);
        toast.success("Cập nhật đề tài thành công");
      } else {
        await api.post("/de-tai", payload);
        toast.success("Thêm đề tài thành công");
      }
      setModalOpen(false);
      fetchList();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/de-tai/${itemToDelete.maDeTai}`);
      toast.success("Xóa đề tài thành công");
      setDeleteOpen(false);
      fetchList();
    } catch (e) {
      // Dù lỗi 409 hay lỗi nào cũng có e.message từ api.js ném ra
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý đề tài</h2>
        <button onClick={handleOpenAdd}>
          <Plus size={18} />
          Thêm đề tài
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Đang tải danh sách...</div>
        ) : list.length === 0 ? (
          <div className="empty-state">Chưa có đề tài nào.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã ĐT</th>
                <th>Tên Đề Tài</th>
                <th>Mô Tả</th>
                <th>Giảng Viên</th>
                <th>SL Tối Đa</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.maDeTai}>
                  <td>{item.maDeTai}</td>
                  <td>{item.tenDeTai}</td>
                  <td>{item.moTa}</td>
                  <td>{item.giangVienHuongDan}</td>
                  <td>{item.soLuongToiDa}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil size={16} />
                        Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleOpenDelete(item)}
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? "Sửa đề tài" : "Thêm đề tài"}
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
          <label>Tên đề tài *</label>
          <input
            type="text"
            value={form.tenDeTai}
            onChange={(e) => setForm({ ...form, tenDeTai: e.target.value })}
            placeholder="Nhập tên đề tài"
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            value={form.moTa}
            onChange={(e) => setForm({ ...form, moTa: e.target.value })}
            placeholder="Mô tả chi tiết"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Giảng viên hướng dẫn</label>
          <input
            type="text"
            value={form.giangVienHuongDan}
            onChange={(e) =>
              setForm({ ...form, giangVienHuongDan: e.target.value })
            }
            placeholder="Tên giảng viên"
          />
        </div>
        <div className="form-group">
          <label>Số lượng tối đa</label>
          <input
            type="number"
            min="1"
            value={form.soLuongToiDa}
            onChange={(e) => setForm({ ...form, soLuongToiDa: e.target.value })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        message={`Bạn có chắc chắn muốn xóa đề tài "${itemToDelete?.tenDeTai}"?`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
