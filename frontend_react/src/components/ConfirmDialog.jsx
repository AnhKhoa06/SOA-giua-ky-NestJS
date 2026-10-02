import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title = "Xác nhận xóa",
  message,
  confirmText = "Xóa",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className="btn-delete-solid"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : confirmText}
          </button>
        </>
      }
    >
      <p className="confirm-text">{message}</p>
    </Modal>
  );
}
