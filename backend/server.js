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
import financeRoutes from "./src/routes/financeRoutes.js";

/* =========================================================
   CONFIGURATION
========================================================= */

dotenv.config();

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

/* =========================================================
   PATH
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   PROXY
========================================================= */

// Fonctionne en local et derrière Render/proxy HTTPS
app.set("trust proxy", 1);

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://college-emmanuel.space",
      process.env.FRONTEND_URL,
    ].filter(Boolean),

    credentials: true,
  })
);

/* =========================================================
   SESSION
========================================================= */

app.use(
  session({
    name: "connect.sid",

    secret:
      process.env.SESSION_SECRET ||
      "college-emmanuel-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,

      // HTTP local = false
      // HTTPS production = true
      secure: "auto",

      sameSite: "lax",

      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

/* =========================================================
   AUTH SESSION LOGGER
========================================================= */

/*
 * On garde ce log même en production
 * pour vérifier le problème de session.
 *
 * Aucun token n'est affiché.
 */
app.use((req, res, next) => {
  console.log("=================================");
  console.log("➡️", req.method, req.originalUrl);

  console.log("🆔 Session ID:", req.sessionID);

  console.log(
    "🍪 Cookie reçu:",
    req.headers.cookie
      ? "OUI"
      : "NON"
  );

  console.log(
    "🔐 Token session:",
    req.session?.supabaseAccessToken
      ? "OUI"
      : "NON"
  );

  next();
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api", apiRoutes);

app.use("/", authRouter);

app.use("/dashboard", dashboardRouter);

app.use("/finance", financeRoutes);

/* =========================================================
   FRONTEND
========================================================= */

const clientPath =
  NODE_ENV === "production"
    ? path.resolve(__dirname, "../frontend/dist")
    : path.resolve(__dirname, "../../frontend/dist");

if (existsSync(clientPath)) {
  console.log("✅ Frontend:", clientPath);

  app.use(express.static(clientPath));

  app.get("*", (req, res, next) => {
    const indexFile = path.join(
      clientPath,
      "index.html"
    );

    if (existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }

    next();
  });
} else {
  console.log(
    "⚠️ Frontend dist introuvable:",
    clientPath
  );
}

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Erreur serveur",
  });
});

/* =========================================================
   SERVER
========================================================= */

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 College Emmanuel");
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔌 Port: ${PORT}`);
  console.log("🔐 Auth: express-session");
  console.log("=================================");
});