import { z } from 'zod';

export const createTrainSchema = z.object({
  train_number: z.string().min(3, 'Train number is required'),
  name: z.string().min(3, 'Train name is required'),
  source: z.string().min(2, 'Source station is required'),
  destination: z.string().min(2, 'Destination station is required'),
  departure_time: z.string().min(4, 'Departure time required (e.g. 16:55)'),
  arrival_time: z.string().min(4, 'Arrival time required (e.g. 08:35)'),
  duration: z.string().min(2, 'Duration required (e.g. 15h 40m)'),
  classes_available: z.string().min(2, 'Available classes comma-separated (e.g. 1A,2A,3A,SL)'),
  distance: z.number().int().positive('Distance in KM required'),
  stops: z.array(
    z.object({
      station: z.string(),
      arrival: z.string(),
      departure: z.string(),
      distance: z.number(),
    })
  ).optional().default([]),
});
