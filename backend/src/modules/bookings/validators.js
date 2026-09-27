import { z } from 'zod';

export const createBookingSchema = z.object({
  train_id: z.number().int().positive('Train ID is required'),
  class: z.string().min(1, 'Travel class is required'),
  journey_date: z.string().min(10, 'Valid journey date is required'),
  passengers: z.array(
    z.object({
      name: z.string().min(2, 'Passenger name is required'),
      age: z.number().int().min(1).max(120, 'Valid age is required'),
      gender: z.enum(['M', 'F', 'Other']),
      berth_preference: z.string().default('No Preference'),
    })
  ).min(1, 'At least one passenger is required').max(6, 'Maximum 6 passengers per booking'),
});

export const pnrQuerySchema = z.object({
  pnr: z.string().length(10, 'PNR must be 10 digits'),
});
