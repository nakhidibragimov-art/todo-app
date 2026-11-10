import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { getPasswordRules } from '../utils/password';

const content = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to continue organizing your day.',
    submit: 'Log in',
    pending: 'Logging in…',
    switchText: 'No account yet?',
    switchLink: { to: '/register', label: 'Create one' },
  },
  register: {
    title: 'Create your account',
    subtitle: 'Start organizing your everyday life.',
    submit: 'Create account',
    pending: 'Creating account…',
    switchText: 'Already have an account?',
    switchLink: { to: '/login', label: 'Log in' },
  },
};

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const text = content[mode];
  const isRegister = mode === 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const passwordRules = isRegister ? getPasswordRules(password, email) : [];
  const passwordValid = passwordRules.every(rule => rule.ok);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister && !passwordValid) {
      const failed = passwordRules.filter(rule => !rule.ok).map(rule => rule.label.toLowerCase());
      setError(`Password needs: ${failed.join(', ')}`);
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setPending(true);
    try {
      await auth[mode]({ email, password });
      navigate('/app/all', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="register-screen">
      <div className="register-card">
        <h1>{text.title}</h1>
        <p>{text.subtitle}</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              aria-describedby={isRegister ? 'password-rules' : undefined}
              required
            />
          </label>

          {isRegister && (
            <ul className="password-rules" id="password-rules" aria-live="polite">
              {passwordRules.filter(rule => !rule.hidden || !rule.ok).map(rule => (
                <li key={rule.label} className={rule.ok ? 'ok' : ''}>
                  <span aria-hidden="true">{rule.ok ? '✓' : '•'}</span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

          {isRegister && (
            <label>
              Confirm password
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {error && <p className="register-error" role="alert">{error}</p>}

          <button type="submit" disabled={pending}>
            {pending ? text.pending : text.submit}
          </button>
        </form>

        <p className="auth-switch">
          {text.switchText} <Link to={text.switchLink.to}>{text.switchLink.label}</Link>
        </p>
      </div>
    </main>
  );
}
