import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  taskStats,
  updateTask,
} from '../controllers/tasks.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listTasks);
router.get('/stats', taskStats);
router.get('/:id', getTask);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
