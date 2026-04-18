import { z } from 'zod';

export const profileSchema = z.object({
  display_name: z.string().min(1, 'Имя обязательно').max(100),
});

export type ProfileInput = z.infer<typeof profileSchema>;
