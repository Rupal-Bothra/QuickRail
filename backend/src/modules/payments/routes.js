import { Router } from 'express';
import { processPayment } from './controller.js';
import { processPaymentSchema } from './validators.js';
import { validateRequest } from '../../middleware/validate.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.post('/process', authenticateToken, validateRequest(processPaymentSchema), processPayment);

export default router;
