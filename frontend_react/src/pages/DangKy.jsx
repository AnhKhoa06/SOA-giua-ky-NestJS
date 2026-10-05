import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Check, X, Trash2 } from "lucide-react";
import { api } from "../api";
import { useToast } from "../components/Toast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

const STATUS = {
  "Cho duyet": { label: "Chờ duyệt", cls: "badge warning" },
  "Da duyet": { label: "Đã duyệt", cls: "badge success" },
  "Tu choi": { label: "Từ chối", cls: "badge danger" },
};

const EMPTY_FORM = { maSV: "", maDeTai: "" };

function DangKy() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [sinhVien, setSinhVien] = useState([]);
  const [deTai, setDeTai] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [dk, sv, dt] = await Promise.all([
        api.get("/dang-ky"),
        api.get("/sinh-vien"),
        api.get("/de-tai"),
      ]);
      setList(dk);
      setSinhVien(sv);
      setDeTai(dt);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const svMap = useMemo(
    () => Object.fromEntries(sinhVien.map((s) => [s.MaSV, s])),
    [sinhVien],
  );
  const dtMap = useMemo(
    () => Object.fromEntries(deTai.map((d) => [d.maDeTai, d])),
    [deTai],
  );

  // Số chỗ đã dùng của từng đề tài (không tính đăng ký bị từ chối)
  const used = useMemo(() => {
    const m = {};
    list.forEach((d) => {
      if (d.trangThai !== "Tu choi") m[d.maDeTai] = (m[d.maDeTai] || 0) + 1;
    });
    return m;
  }, [list]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.maSV || !form.maDeTai) {
      toast.error("Vui lòng chọn sinh viên và đề tài");
      return;
    }
    setSaving(true);
    try {
      await api.post("/dang-ky", {
        maSV: form.maSV,
        maDeTai: Number(form.maDeTai),
      });
      toast.success("Đăng ký đề tài thành công");
      setModalOpen(false);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (item, trangThai) => {
    try {
      await api.patch(`/dang-ky/${item.maDangKy}`, { trangThai });
      toast.success(
        trangThai === "Da duyet" ? "Đã duyệt đăng ký" : "Đã từ chối đăng ký",
      );
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/dang-ky/${deleting.maDangKy}`);
      toast.success("Đã hủy đăng ký");
      setDeleting(null);
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (v) => (v ? new Date(v).toLocaleString("vi-VN") : "");

  return (
    <div>
      <div className="page-header">
        <h2>Quản lý đăng ký</h2>
        <button onClick={openAdd}>
          <Plus size={18} />
          Thêm đăng ký
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : list.length === 0 ? (
          <div className="empty-state">Chưa có đăng ký nào.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã ĐK</th>
                <th>Sinh viên</th>
                <th>Đề tài</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => {
                const st = STATUS[item.trangThai] || {
                  label: item.trangThai,
                  cls: "badge",
                };
                const sv = svMap[item.maSV];
                const dt = dtMap[item.maDeTai];
                return (
                  <tr key={item.maDangKy}>
                    <td>{item.maDangKy}</td>
                    <td>
                      {sv ? sv.hoTen : "(đã xóa)"} <br />
                      <small>{item.maSV}</small>
                    </td>
                    <td>{dt ? dt.tenDeTai : `Đề tài ${item.maDeTai}`}</td>
                    <td>{formatDate(item.ngayDangKy)}</td>
                    <td>
                      <span className={st.cls}>{st.label}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {item.trangThai === "Cho duyet" && (
                          <>
                            <button
                              className="btn-edit"
                              onClick={() => changeStatus(item, "Da duyet")}
                            >
                              <Check size={16} />
                              Duyệt
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={() => changeStatus(item, "Tu choi")}
                            >
                              <X size={16} />
                              Từ chối
                            </button>
                          </>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => setDeleting(item)}
                        >
                          <Trash2 size={16} />
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modalOpen}
        title="Thêm đăng ký"
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
          <label>Sinh viên *</label>
          <select
            value={form.maSV}
            onChange={(e) => setForm({ ...form, maSV: e.target.value })}
          >
            <option value="">-- Chọn sinh viên --</option>
            {sinhVien.map((s) => (
              <option key={s.MaSV} value={s.MaSV}>
                {s.MaSV} - {s.hoTen}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Đề tài *</label>
          <select
            value={form.maDeTai}
            onChange={(e) => setForm({ ...form, maDeTai: e.target.value })}
          >
            <option value="">-- Chọn đề tài --</option>
            {deTai.map((d) => {
              const conLai = d.soLuongToiDa - (used[d.maDeTai] || 0);
              return (
                <option key={d.maDeTai} value={d.maDeTai}>
                  {d.tenDeTai} (còn {Math.max(conLai, 0)}/{d.soLuongToiDa} chỗ)
                </option>
              );
            })}
          </select>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        message={
          deleting
            ? `Hủy đăng ký #${deleting.maDangKy} của sinh viên ${deleting.maSV}?`
            : ""
        }
        confirmText="Hủy đăng ký"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

export default DangKy;
