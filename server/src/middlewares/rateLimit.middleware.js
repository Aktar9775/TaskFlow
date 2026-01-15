import { redis } from "../config/redis.js";
import { fail } from "../utils/response.js";

export function loginRateLimit(maxAttempts = 5, windowSeconds = 60) {
  return async (req, res, next) => {
    const key = `login_attempt:${req.ip}`;

    const attempts = await redis.incr(key);
    if (attempts === 1) await redis.expire(key, windowSeconds);

    if (attempts > maxAttempts) {
      return fail(res, 429, "Too many login attempts. Please try again later.");
    }
    next();
  };
}
