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
