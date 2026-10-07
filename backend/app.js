const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./docs/openapi");

function createApp() {
  const app = express();
  app.use(express.json());

  const allowedOrigins = (
    process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
    })
  );

  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));
  app.use("/api/bloodbank", require("./routes/bloodbankRoutes"));
  app.use("/api/user", require("./routes/userRoutes"));
  app.use("/api/events", require("./routes/eventsRoutes"));
  app.use("/api/public", require("./routes/publicRoutes"));
  app.use("/api/ai", require("./routes/aiRoutes"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));

  return app;
}

module.exports = createApp;
