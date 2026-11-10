import { useEscape } from '../hooks/useEscape';

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  pendingLabel = 'Deleting…',
  pending = false,
  error,
  onConfirm,
  onCancel,
}) {
  useEscape(onCancel);

  return (
    <div
      className="modal-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="task-modal confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="confirm-icon" aria-hidden="true">!</div>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={pending}
            autoFocus
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
