import { rateLimit } from 'express-rate-limit';

const minutes = n => n * 60 * 1000;
const num = (value, fallback) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback);

function limiter({ windowMs, limit, message, ...options }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8', // RateLimit-* headers so clients can see the remaining quota
    legacyHeaders: false,
    handler: (req, res, next, opts) => {
      const retryAfter = Math.ceil(opts.windowMs / 60000);
      res.status(opts.statusCode).json({ message: `${message} Try again in ${retryAfter} min.` });
    },
    ...options,
  });
}

// Statuses that look like guessing: wrong credentials (401) and probing for
// registered emails (409). Typos caught by validation (400) don't count.
const SUSPICIOUS_STATUSES = new Set([401, 409]);

// Brute-force protection for login/register: only suspicious failures count,
// so a normal user who logs in successfully or mistypes a form is never blocked.
export const authLimiter = limiter({
  windowMs: minutes(num(process.env.AUTH_RATE_LIMIT_WINDOW_MIN, 15)),
  limit: num(process.env.AUTH_RATE_LIMIT_MAX, 10),
  skipSuccessfulRequests: true,
  requestWasSuccessful: (req, res) => !SUSPICIOUS_STATUSES.has(res.statusCode),
  message: 'Too many failed attempts.',
});

// General safety net for the whole API.
export const apiLimiter = limiter({
  windowMs: minutes(num(process.env.API_RATE_LIMIT_WINDOW_MIN, 15)),
  limit: num(process.env.API_RATE_LIMIT_MAX, 500),
  message: 'Too many requests.',
});
