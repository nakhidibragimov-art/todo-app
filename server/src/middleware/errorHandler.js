import { HttpError } from '../utils/httpError.js';

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large' });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
