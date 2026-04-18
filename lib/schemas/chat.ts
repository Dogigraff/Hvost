import { z } from 'zod';

export const chatRequestSchema = z.object({
  dogId: z.string().uuid(),
  threadId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(2000),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
