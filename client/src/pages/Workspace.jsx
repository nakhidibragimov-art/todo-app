import { useState } from 'react';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { STATUSES } from '../api/tasks';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  useCreateTask,
  useDeleteTask,
  useTaskStats,
  useTasks,
  useUpdateTask,
} from '../hooks/useTasks';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';

const FILTERS = [
  { slug: 'all', label: 'All tasks', icon: '▤', value: undefined, statsKey: 'ALL' },
  ...STATUSES.map(s => ({ ...s, statsKey: s.value })),
];

function EmptyState({ filtered, onCreate }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg viewBox="0 0 160 140" fill="none">
          <rect x="35" y="15" width="90" height="112" rx="12" fill="#F1FBF6" />
          <rect x="48" y="37" width="63" height="7" rx="3.5" fill="#CDF1E0" />
          <rect x="48" y="55" width="48" height="6" rx="3" fill="#DBF4E8" />
          <rect x="48" y="73" width="63" height="6" rx="3" fill="#DBF4E8" />
          <rect x="48" y="91" width="39" height="6" rx="3" fill="#DBF4E8" />
          <circle cx="115" cy="100" r="21" fill="#239660" />
          <path
            d="M105 100L112 107L125 92"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3>{filtered ? 'Nothing here' : 'No tasks yet'}</h3>
      <p>{filtered ? 'No tasks with this status.' : 'Your tasks will appear here.'}</p>

      <button className="empty-add-button" onClick={onCreate}>
        ＋ {filtered ? 'Add a task' : 'Create your first task'}
      </button>
    </div>
  );
}

export default function Workspace() {
  const { filter } = useParams();
  const { user, logout } = useAuth();
  const active = FILTERS.find(f => f.slug === filter);

  const tasksQuery = useTasks(active?.value);
  const statsQuery = useTaskStats();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // null | { task: null } (create) | { task } (edit)
  const [modal, setModal] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  if (!active) return <Navigate to="/app/all" replace />;

  const tasks = tasksQuery.data ?? [];
  const stats = statsQuery.data;
  // status changes from the list report errors in a banner; dialogs show their own
  const actionError = !modal && !taskToDelete ? updateTask.error : null;

  const modalMutation = modal?.task ? updateTask : createTask;
  const modalError = modalMutation.error ? getErrorMessage(modalMutation.error) : null;

  function openCreate() {
    createTask.reset();
    setModal({ task: null });
  }

  function openEdit(task) {
    updateTask.reset();
    setModal({ task });
  }

  function handleModalSubmit(values) {
    const payload = modal.task ? { id: modal.task.id, ...values } : values;
    modalMutation.mutate(payload, { onSuccess: () => setModal(null) });
  }

  function handleStatusChange(task, status) {
    if (task.status !== status) updateTask.mutate({ id: task.id, status });
  }

  function askDelete(task) {
    deleteTask.reset();
    setTaskToDelete(task);
  }

  function confirmDelete() {
    deleteTask.mutate(taskToDelete.id, { onSuccess: () => setTaskToDelete(null) });
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-symbol">✓</span>
          <span>ToDo</span>
        </div>

        <button className="sidebar-add" onClick={openCreate}>
          <span>＋</span> Add task
        </button>

        <p className="sidebar-heading">STATUS</p>

        <nav className="sidebar-navigation">
          {FILTERS.map(item => (
            <NavLink
              key={item.slug}
              to={`/app/${item.slug}`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span className="sidebar-count">{stats?.[item.statsKey] || ''}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="profile-avatar">{user?.email?.[0]?.toUpperCase() ?? 'U'}</div>
          <div className="profile-info">
            <strong title={user?.email}>{user?.email ?? 'My account'}</strong>
            <button className="logout-button" onClick={logout}>Log out</button>
          </div>
          <button
            className="logout-icon-button"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
          >
            ⇥
          </button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="page-header">
          <div>
            <p className="page-breadcrumb">My workspace / {active.label}</p>
            <h1>{active.label}</h1>
            <p className="page-subtitle">Keep everything organized in one place.</p>
          </div>

          <button className="main-add-button" onClick={openCreate} aria-label="Add task">
            <span className="add-icon" aria-hidden="true">＋</span>
            <span className="add-label">Add task</span>
          </button>
        </header>

        <section className="tasks-content">
          <div className="tasks-toolbar">
            <h2>Task list</h2>
            <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>

          {actionError && (
            <p className="form-error banner" role="alert">{getErrorMessage(actionError)}</p>
          )}

          {tasksQuery.isPending ? (
            <p className="tasks-loading">Loading tasks…</p>
          ) : tasksQuery.isError ? (
            <p className="form-error banner" role="alert">
              {getErrorMessage(tasksQuery.error)}{' '}
              <button className="link-button" onClick={() => tasksQuery.refetch()}>Retry</button>
            </p>
          ) : tasks.length > 0 ? (
            <div className="tasks-list">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={openEdit}
                  onDelete={askDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyState filtered={Boolean(active.value)} onCreate={openCreate} />
          )}
        </section>
      </main>

      {modal && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          defaultStatus={active.value ?? 'TODO'}
          onSubmit={handleModalSubmit}
          onClose={() => setModal(null)}
          pending={modalMutation.isPending}
          error={modalError}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`“${taskToDelete.title}” will be deleted permanently.`}
          pending={deleteTask.isPending}
          error={deleteTask.error && getErrorMessage(deleteTask.error)}
          onConfirm={confirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
