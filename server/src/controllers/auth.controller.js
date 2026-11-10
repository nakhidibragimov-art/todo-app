import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { signToken } from '../middleware/auth.js';
import { HttpError } from '../utils/httpError.js';
import { validateLogin, validateRegister } from '../utils/validation.js';

const DUMMY_HASH = bcrypt.hashSync('timing-safe-dummy-password', 10);

const publicUser =user => ({ id: user.id, email: user.email, createdAt: user.createdAt });

export async function register(req, res) {
  const { email, password } = validateRegister(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, 'User with this email already exists');

  const user = await prisma.user.create({
    data: { email, password: await bcrypt.hash(password, 10) },
  });

  res.status(201).json({ token: signToken(user.id), user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = validateLogin(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  // compare against a dummy hash when the user doesn't exist, so response time
  // doesn't reveal which emails are registered
  const valid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user) throw new HttpError(401, 'Invalid email or password');
  if (!valid) throw new HttpError(401, 'Invalid email or password');

  res.json({ token: signToken(user.id), user: publicUser(user) });
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) throw new HttpError(401, 'User not found');

  res.json({ user: publicUser(user) });
}
