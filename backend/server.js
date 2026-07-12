import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import { fileURLToPath } from "url";
import { existsSync } from "fs";

import apiRoutes from "./src/routes/api.js";
import authRouter from "./src/routes/apiAuthRoutes.js";
import dashboardRouter from "./src/routes/scolaireRoutes.js";

/* =========================================================
   ENV
========================================================= */
dotenv.config();

const app = express();
const NODE_ENV = (process.env.NODE_ENV || "development").trim();
const PORT = process.env.PORT || 3000;

/* =========================================================
   PATH
========================================================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   MIDDLEWARE
========================================================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "college-emmanuel-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

/* =========================================================
   SECURITY
========================================================= */
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

/* =========================================================
   LOGGER
========================================================= */
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
  });
}

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api", apiRoutes);
app.use("/", authRouter);
app.use("/dashboard", dashboardRouter);

/* =========================================================
   FRONTEND HANDLING
========================================================= */
let clientPath;

// En développement local → build du frontend
if (NODE_ENV === "development") {
  clientPath = path.resolve(__dirname, "../../frontend/dist");
}
// En production (Render) → build généré par vite
else {
  clientPath = path.resolve(__dirname, "../frontend/dist");
}

if (clientPath && existsSync(clientPath)) {
  console.log("✅ Frontend path:", clientPath);

  app.use(express.static(clientPath));

  // Catch-all pour React Router
  app.get("*", (req, res, next) => {
    const indexFile = path.join(clientPath, "index.html");
    if (existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }
    next();
  });
} else {
  console.log("ℹ️ Frontend static disabled");
}

/* =========================================================
   ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Erreur serveur",
  });
});

/* =========================================================
   START SERVER
========================================================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
  console.log("🚀 College Emmanuel ready");
});
