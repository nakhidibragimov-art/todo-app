import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import './App.css';

function Welcome() {
  const navigate = useNavigate();

  const features = [
    'Organize the everyday chaos',
    'Focus on the right things',
    'Achieve goals and finish projects',
  ];

  return (
    <main className="onboard-screen">
      <section className="onboard-content">
        <h1 className="onboard-logo">ToDo<span>.</span></h1>

        <div className="onboard-features">
          {features.map((feature, index) => (
            <div
              className="onboard-feature"
              style={{ '--delay': `${0.7 + index * 0.8}s` }}
              key={feature}
            >
              <span className="onboard-check">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="onboard-illustration">
          <svg viewBox="0 0 420 300" fill="none">
            <circle cx="210" cy="145" r="118" fill="#f0edff" />
            <circle cx="210" cy="145" r="91" fill="#e5e0ff" />

            <rect x="116" y="48" width="188" height="218" rx="18"
              fill="white" stroke="#e4e0f5" strokeWidth="2" />

            <rect x="143" y="76" width="94" height="10" rx="5" fill="#dcd7f8" />
            <rect x="143" y="96" width="133" height="6" rx="3" fill="#eeeafc" />

            <g stroke="#d8d4eb" strokeWidth="2">
              <rect x="143" y="125" width="17" height="17" rx="5" />
              <rect x="143" y="163" width="17" height="17" rx="5" />
              <rect x="143" y="201" width="17" height="17" rx="5" />
            </g>

            <g fill="#dcd7f8">
              <rect x="171" y="130" width="91" height="7" rx="3.5" />
              <rect x="171" y="168" width="105" height="7" rx="3.5" />
              <rect x="171" y="206" width="75" height="7" rx="3.5" />
            </g>

            <circle cx="285" cy="194" r="34" fill="#7965eb" />
            <path d="M269 194l11 11 22-25" stroke="white"
              strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M92 105l8 8 14-17" stroke="#a99cf4"
              strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M322 75l5 6 11-13" stroke="#a99cf4"
              strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            <path d="M91 213l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#f4c96b" />
            <path d="M329 232l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#f4c96b" />
            <circle cx="103" cy="65" r="4" fill="#a99cf4" />
            <circle cx="321" cy="130" r="5" fill="#f4c96b" />
          </svg>
        </div>

        <h2 className="onboard-message">Now it’s your turn! ✨</h2>
        <p className="onboard-subtitle">Make space for what matters.</p>

        <button
          className="onboard-button"
          onClick={() => navigate('/register')}
        >
          Let's go <span>→</span>
        </button>
      </section>
    </main>
  );
}

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    navigate('/app/inbox');
  }

  return (
    <main className="register-screen">
      <div className="register-card">
        <h1>Create your account</h1>
        <p>Start organizing your everyday life.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="register-error">{error}</p>}

          <button type="submit">Create account</button>
        </form>
      </div>
    </main>
  );
}

const navigation = [
  { id: 'inbox', label: 'Inbox', icon: '▤' },
  { id: 'today', label: 'Today', icon: '◷' },
  { id: 'scheduled', label: 'Scheduled', icon: '▦' },
  { id: 'pinboard', label: 'Pinboard', icon: '☆' },
  { id: 'completed', label: 'Completed', icon: '✓' },
];

function getToday() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function Workspace() {
  const location = useLocation();
  const today = getToday();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const isProject = pathParts[1] === 'project';
  const projectId = isProject ? Number(pathParts[2]) : null;
  const view = isProject ? 'project' : pathParts[1] || 'inbox';

  const [tasks, setTasks] = useState(() => readStorage('todo_tasks'));
  const [projects, setProjects] = useState(() => readStorage('todo_projects'));

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const activeProject = projects.find(project => project.id === projectId);

  useEffect(() => {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('todo_projects', JSON.stringify(projects));
  }, [projects]);

  function getTasks(section) {
    return tasks.filter(task => {
      if (section === 'inbox') {
        return !task.completed && !task.dueDate && !task.projectId;
      }

      if (section === 'today') {
        return !task.completed && task.dueDate === today;
      }

      if (section === 'scheduled') {
        return !task.completed && task.dueDate > today;
      }

      if (section === 'pinboard') {
        return !task.completed && task.pinned;
      }

      if (section === 'completed') {
        return task.completed;
      }

      return false;
    });
  }

  const visibleTasks = isProject
    ? tasks.filter(task => task.projectId === projectId)
    : getTasks(view);

  const pageTitle = activeProject?.name ||
    navigation.find(item => item.id === view)?.label ||
    'Inbox';

  function addTask(e) {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || (view === 'today' ? today : ''),
      completed: false,
      pinned: false,
      projectId: projectId || null,
    };

    setTasks(previous => [...previous, newTask]);

    setTitle('');
    setDescription('');
    setDueDate('');
    setShowTaskForm(false);
  }

  function addProject() {
    const name = window.prompt('Enter project name:');

    if (!name?.trim()) return;

    setProjects(previous => [
      ...previous,
      {
        id: Date.now(),
        name: name.trim(),
      },
    ]);
  }

  function toggleCompleted(id) {
    setTasks(previous =>
      previous.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function togglePinned(id) {
    setTasks(previous =>
      previous.map(task =>
        task.id === id
          ? { ...task, pinned: !task.pinned }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(previous => previous.filter(task => task.id !== id));
  }

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-symbol">✓</span>
          <span>ToDo</span>
        </div>

        <button
          className="sidebar-add"
          onClick={() => setShowTaskForm(true)}
        >
          <span>＋</span> Add task
        </button>

        <p className="sidebar-heading">MENU</p>

        <nav className="sidebar-navigation">
          {navigation.map(item => (
            <NavLink
              key={item.id}
              to={`/app/${item.id}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive && !isProject ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span className="sidebar-count">
                {getTasks(item.id).length || ''}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="projects">
          <div className="projects-title">
            <span>MyProjects</span>
            <button onClick={addProject} title="Add project">＋</button>
          </div>

          <div className="projects-list">
            {projects.map(project => (
              <NavLink
                key={project.id}
                to={`/app/project/${project.id}`}
                className={({ isActive }) =>
                  `project-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="project-dot" />
                {project.name}
              </NavLink>
            ))}

            {projects.length === 0 && (
              <p className="projects-empty">No projects yet</p>
            )}
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">U</div>
          <div>
            <strong>My account</strong>
            <span>Personal workspace</span>
          </div>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="page-header">
          <div>
            <p className="page-breadcrumb">
              My workspace / {pageTitle}
            </p>
            <h1>{pageTitle}</h1>
            <p className="page-subtitle">
              {activeProject
                ? 'Manage tasks in this project.'
                : 'Keep everything organized in one place.'}
            </p>
          </div>

          <button
            className="main-add-button"
            onClick={() => setShowTaskForm(true)}
          >
            ＋ Add task
          </button>
        </header>

        <section className="tasks-content">
          <div className="tasks-toolbar">
            <h2>{pageTitle} tasks</h2>
            <span>{visibleTasks.length} tasks</span>
          </div>

          {visibleTasks.length > 0 ? (
            <div className="tasks-list">
              {visibleTasks.map(task => (
                <article className="task-item" key={task.id}>
                  <button
                    className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                    onClick={() => toggleCompleted(task.id)}
                    aria-label="Complete task"
                  >
                    {task.completed ? '✓' : ''}
                  </button>

                  <div className="task-details">
                    <h3 className={task.completed ? 'crossed' : ''}>
                      {task.title}
                    </h3>

                    {task.description && <p>{task.description}</p>}

                    {task.dueDate && (
                      <span className="task-due-date">
                        ◷ {task.dueDate}
                      </span>
                    )}
                  </div>

                  <div className="task-buttons">
                    <button
                      className={`pin-button ${task.pinned ? 'pinned' : ''}`}
                      onClick={() => togglePinned(task.id)}
                      title="Pin task"
                    >
                      ★
                    </button>

                    <button
                      className="delete-task-button"
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 160 140" fill="none">
                  <rect x="35" y="15" width="90" height="112" rx="12" fill="#F0EDFF" />
                  <rect x="48" y="37" width="63" height="7" rx="3.5" fill="#C8BFFF" />
                  <rect x="48" y="55" width="48" height="6" rx="3" fill="#DCD7F8" />
                  <rect x="48" y="73" width="63" height="6" rx="3" fill="#DCD7F8" />
                  <rect x="48" y="91" width="39" height="6" rx="3" fill="#DCD7F8" />
                  <circle cx="115" cy="100" r="21" fill="#7965EB" />
                  <path
                    d="M105 100L112 107L125 92"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3>No tasks yet</h3>
              <p>Your tasks will appear here.</p>

              <button
                className="empty-add-button"
                onClick={() => setShowTaskForm(true)}
              >
                ＋ Create your first task
              </button>
            </div>
          )}
        </section>
      </main>

      {showTaskForm && (
        <div
          className="modal-overlay"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setShowTaskForm(false);
          }}
        >
          <form className="task-modal" onSubmit={addTask}>
            <div className="modal-header">
              <h2>New task</h2>
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
              >
                ×
              </button>
            </div>

            <label>
              Task name
              <input
                type="text"
                placeholder="What do you need to do?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                required
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Add some details..."
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </label>

            <label>
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowTaskForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="submit-button">
                Add task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app/onboard/welsome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<Navigate to="/app/inbox" replace />} />
        <Route path="/app/*" element={<Workspace />} />
        <Route path="/" element={<Navigate to="/app/onboard/welsome" replace />} />
        <Route path="*" element={<Navigate to="/app/inbox" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;