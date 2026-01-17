import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import routes from "./routes/index.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

// ✅ FIXED CORS (no mismatch + supports local)
const allowedOrigins = [
  env.clientUrl,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        env.clientUrl?.replace(/\/$/, ""),
        "http://localhost:5173",
        "http://localhost:3000",
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ Fix preflight
app.options("/*", cors());


app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("TaskFlow Backend is running");
});

app.use("/api", routes);

export default app;
