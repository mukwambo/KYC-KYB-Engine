import IORedis from "ioredis";
import { env } from "../environment";

// BullMQ requires maxRetriesPerRequest disabled on any connection used for its
// blocking commands, so queues/workers use this dedicated connection instead
// of the general-purpose one in src/config/redis.ts.
export const queueConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
