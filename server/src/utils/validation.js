import { HttpError } from './httpError.js';

export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_MIN = 8;
// bcrypt only looks at the first 72 bytes, so longer passwords would be silently truncated
const PASSWORD_MAX_BYTES = 72;

export function getPasswordProblems(password, email = '') {
  const problems = [];
  const emailName = email.split('@')[0];

  if (password.length < PASSWORD_MIN) problems.push(`at least ${PASSWORD_MIN} characters`);
  if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) problems.push(`at most ${PASSWORD_MAX_BYTES} bytes`);
  if (!/[a-z]/.test(password)) problems.push('a lowercase letter');
  if (!/[A-Z]/.test(password)) problems.push('an uppercase letter');
  if (!/\d/.test(password)) problems.push('a digit');
  if (/\s/.test(password)) problems.push('no spaces');
  if (emailName.length >= 3 && password.toLowerCase().includes(emailName)) {
    problems.push('not contain your email name');
  }

  return problems;
}

function readCredentials(body) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  return { email, password };
}

export function validateRegister(body) {
  const { email, password } = readCredentials(body);
  const errors = {};

  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = 'Valid email is required';

  const problems = getPasswordProblems(password, email);
  if (problems.length) errors.password = `Password must contain ${problems.join(', ')}`;

  if (Object.keys(errors).length) throw new HttpError(400, 'Validation failed', errors);

  return { email, password };
}

// Login only checks the shape: password rules are enforced at sign-up,
// and revealing them here would not help anyone but an attacker.
export function validateLogin(body) {
  const { email, password } = readCredentials(body);

  if (!email || !password || email.length > 254 || password.length > 200) {
    throw new HttpError(400, 'Email and password are required');
  }

  return { email, password };
}

export function validateStatus(status) {
  if (!TASK_STATUSES.includes(status)) {
    throw new HttpError(400, `Status must be one of: ${TASK_STATUSES.join(', ')}`);
  }
  return status;
}

// partial = true for PATCH (all fields optional)
export function validateTask(body = {}, { partial = false } = {}) {
  const data = {};

  if (body.title !== undefined || !partial) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) throw new HttpError(400, 'Title is required');
    if (title.length > TITLE_MAX) throw new HttpError(400, `Title is too long (max ${TITLE_MAX})`);
    data.title = title;
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== 'string') {
      throw new HttpError(400, 'Description must be a string');
    }
    if (body.description?.trim().length > DESCRIPTION_MAX) {
      throw new HttpError(400, `Description is too long (max ${DESCRIPTION_MAX})`);
    }
    data.description = body.description?.trim() || null;
  }

  if (body.status !== undefined) data.status = validateStatus(body.status);

  if (partial && Object.keys(data).length === 0) {
    throw new HttpError(400, 'Nothing to update');
  }

  return data;
}

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid id');
  return id;
}
