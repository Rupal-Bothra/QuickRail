import { Router } from 'express';
import {
  getAdminStats,
  getAllTrainsAdmin,
  createTrainAdmin,
  updateTrainAdmin,
  deleteTrainAdmin,
  getAllBookingsAdmin,
} from './controller.js';
import { createTrainSchema } from './validators.js';
import { validateRequest } from '../../middleware/validate.js';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';

const router = Router();

// Apply auth + requireAdmin middleware to all admin routes
router.use(authenticateToken, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/trains', getAllTrainsAdmin);
router.post('/trains', validateRequest(createTrainSchema), createTrainAdmin);
router.put('/trains/:id', updateTrainAdmin);
router.delete('/trains/:id', deleteTrainAdmin);
router.get('/bookings', getAllBookingsAdmin);

export default router;
