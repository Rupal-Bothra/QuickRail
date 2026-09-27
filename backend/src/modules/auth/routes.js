import { Router } from 'express';
import { signup, login, getMe } from './controller.js';
import { signupSchema, loginSchema } from './validators.js';
import { validateRequest } from '../../middleware/validate.js';
import { authenticateToken } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authRateLimiter, validateRequest(signupSchema), signup);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.get('/me', authenticateToken, getMe);

export default router;
