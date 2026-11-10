import { useState } from 'react';
import { STATUSES } from '../api/tasks';
import { useEscape } from '../hooks/useEscape';

export default function TaskModal({ task, defaultStatus = 'TODO', onSubmit, onClose, pending, error }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState(task?.status ?? defaultStatus);
  useEscape(onClose);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), status });
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="task-modal" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit task' : 'New task'}</h2>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>

        <label>
          Task name
          <input
            type="text"
            placeholder="What do you need to do?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
            autoFocus
            required
          />
        </label>

        <label>
          Description
          <textarea
            placeholder="Add some details..."
            rows={3}
            maxLength={2000}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>

        <label>
          Status
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={pending}>
            {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </form>
    </div>
  );
}
