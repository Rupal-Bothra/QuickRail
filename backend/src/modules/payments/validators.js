import { z } from 'zod';

export const processPaymentSchema = z.object({
  booking_id: z.number().int().positive('Booking ID is required'),
  method: z.enum(['UPI', 'CARD', 'NET_BANKING']),
  simulate_status: z.enum(['SUCCESS', 'FAILED']).default('SUCCESS'),
});
