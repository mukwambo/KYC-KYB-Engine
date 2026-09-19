import Redis from "ioredis";
import { env } from "../environment";

// General-purpose Redis client (caching, rate limiting, etc). BullMQ queues
// and workers use their own dedicated connection — see src/queues/connection.ts —
// rather than sharing this one, per BullMQ's connection guidance.
export const redisClient = new Redis(env.REDIS_URL);

redisClient.on("connect", () => {
  console.log(
    "----------------------------✅ Connected to Redis----------------------------",
  );
});

redisClient.on("error", (error) => {
  console.error(
    "----------------------------❌ Redis connection error:----------------------------",
    error,
  );
});
