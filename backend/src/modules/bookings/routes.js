import { Router } from 'express';
import { createBooking, getBookingByPNR, getUserBookings, cancelBooking } from './controller.js';
import { createBookingSchema } from './validators.js';
import { validateRequest } from '../../middleware/validate.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, validateRequest(createBookingSchema), createBooking);
router.get('/my-bookings', authenticateToken, getUserBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.post('/cancel/:id', authenticateToken, cancelBooking);

export default router;
