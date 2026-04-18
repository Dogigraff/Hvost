import { z } from 'zod';

export const dogSchema = z.object({
  name: z.string().min(1, 'Кличка обязательна'),
  breed: z.string().optional(),
  sex: z.enum(['male', 'female']).optional(),
  birth_date: z.string().optional(),
  weight_kg: z.string().optional(),
  features: z.string().optional(),
  notes: z.string().optional(),
});

export type DogInput = z.infer<typeof dogSchema>;
