import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import "./config/redis.js";

connectDB();
app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
});