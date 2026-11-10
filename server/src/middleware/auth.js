import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { HttpError } from '../utils/httpError.js';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Authorization token is missing');
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }

  // a valid token is not enough if the account no longer exists
  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
    select: { id: true },
  });
  if (!user) throw new HttpError(401, 'User no longer exists');

  req.userId = user.id;
  next();
}
