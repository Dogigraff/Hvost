import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let hourLimit: Ratelimit | null = null;
let dayLimit: Ratelimit | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redis;
}

function getHourLimit(): Ratelimit {
  if (!hourLimit) {
    hourLimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(20, '1 h'),
      prefix: 'ai:hour',
    });
  }
  return hourLimit;
}

function getDayLimit(): Ratelimit {
  if (!dayLimit) {
    dayLimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(100, '1 d'),
      prefix: 'ai:day',
    });
  }
  return dayLimit;
}

export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const [hourResult, dayResult] = await Promise.all([
    getHourLimit().limit(userId),
    getDayLimit().limit(userId),
  ]);

  if (!hourResult.success) {
    return { allowed: false, reason: 'Превышен лимит: 20 сообщений в час' };
  }
  if (!dayResult.success) {
    return { allowed: false, reason: 'Превышен лимит: 100 сообщений в день' };
  }

  return { allowed: true };
}
