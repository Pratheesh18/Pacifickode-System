interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-3 fw-semibold">Confirm Delete</h5>
        <p className="text-muted mb-4">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button  className="btn btn-outline-secondary btn-sm"  onClick={onCancel}>
            Cancel
          </button>
          <button  className="btn btn-danger btn-sm" onClick={onConfirm} >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}