import prisma from '../config/prisma.js';
import { HttpError } from '../utils/httpError.js';
import { TASK_STATUSES, parseId, validateStatus, validateTask } from '../utils/validation.js';

// GET /api/tasks?status=TODO|IN_PROGRESS|DONE
export async function listTasks(req, res) {
  const where = { userId: req.userId };
  if (req.query.status) where.status = validateStatus(req.query.status);

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json(tasks);
}

// GET /api/tasks/stats -> { ALL, TODO, IN_PROGRESS, DONE }
export async function taskStats(req, res) {
  const groups = await prisma.task.groupBy({
    by: ['status'],
    where: { userId: req.userId },
    _count: { _all: true },
  });

  const stats = Object.fromEntries(TASK_STATUSES.map(s => [s, 0]));
  for (const g of groups) stats[g.status] = g._count._all;
  stats.ALL = TASK_STATUSES.reduce((sum, s) => sum + stats[s], 0);

  res.json(stats);
}

export async function getTask(req, res) {
  const task = await prisma.task.findFirst({
    where: { id: parseId(req.params.id), userId: req.userId },
  });
  if (!task) throw new HttpError(404, 'Task not found');

  res.json(task);
}

export async function createTask(req, res) {
  const data = validateTask(req.body);

  const task = await prisma.task.create({
    data: { ...data, userId: req.userId },
  });

  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const id = parseId(req.params.id);
  const data = validateTask(req.body, { partial: true });

  // userId in where guarantees users can only touch their own tasks
  const { count } = await prisma.task.updateMany({
    where: { id, userId: req.userId },
    data,
  });
  if (count === 0) throw new HttpError(404, 'Task not found');

  res.json(await prisma.task.findUnique({ where: { id } }));
}

export async function deleteTask(req, res) {
  const { count } = await prisma.task.deleteMany({
    where: { id: parseId(req.params.id), userId: req.userId },
  });
  if (count === 0) throw new HttpError(404, 'Task not found');

  res.status(204).end();
}
