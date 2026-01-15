import Redis from "ioredis";
import { env } from "./env.js";

export const redis = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("connect", () => console.log("✅ Redis Cloud connected"));
redis.on("ready", () => console.log("✅ Redis is ready"));
redis.on("error", (err) => console.log("❌ Redis error:", err.message));
