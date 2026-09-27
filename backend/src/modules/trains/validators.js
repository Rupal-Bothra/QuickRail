import { z } from 'zod';

export const searchTrainSchema = z.object({
  source: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
});
