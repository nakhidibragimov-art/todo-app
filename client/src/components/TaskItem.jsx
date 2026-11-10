import { STATUSES } from '../api/tasks';

export default function TaskItem({ task, onStatusChange, onEdit, onDelete }) {
  const isDone = task.status === 'DONE';

  return (
    <article className={`task-item status-${task.status.toLowerCase()}`}>
      <button
        className={`task-checkbox ${isDone ? 'completed' : ''}`}
        onClick={() => onStatusChange(task, isDone ? 'TODO' : 'DONE')}
        aria-label={isDone ? 'Mark as to do' : 'Mark as done'}
        title={isDone ? 'Mark as to do' : 'Mark as done'}
      >
        {isDone ? '✓' : ''}
      </button>

      <div className="task-details">
        <h3 className={isDone ? 'crossed' : ''}>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className="task-buttons">
        <select
          className={`status-select status-${task.status.toLowerCase()}`}
          value={task.status}
          onChange={e => onStatusChange(task, e.target.value)}
          aria-label="Task status"
        >
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <button className="edit-task-button" onClick={() => onEdit(task)} title="Edit task" aria-label="Edit task">
          ✎
        </button>

        <button className="delete-task-button" onClick={() => onDelete(task)} title="Delete task" aria-label="Delete task">
          ×
        </button>
      </div>
    </article>
  );
}
