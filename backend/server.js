import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import { fileURLToPath } from "url";

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
const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();

/* =========================================================
   MIDDLEWARE
========================================================= */
// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TRUST PROXY (Render)
app.set("trust proxy", 1);

/* =========================================================
   SECURITY
========================================================= */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com", // ✅ allow Google Fonts CSS
          "'unsafe-inline'"
        ],
        imgSrc: ["'self'", "data:", SUPABASE_URL].filter(Boolean),
        connectSrc: [
          "'self'",
          SUPABASE_URL,
          "https://nominatim.openstreetmap.org",
          "https://cdn.jsdelivr.net"
        ].filter(Boolean),
        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://fonts.gstatic.com", // ✅ allow Google Fonts font files
          "data:"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
  })
);


/* =========================================================
   LOGGER DEV
========================================================= */
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
  });
}

/* =========================================================
   ROUTES
========================================================= */
app.use("/api", apiRoutes);
app.use("/", authRouter);
app.use("/dashboard", dashboardRouter);

/* =========================================================
   STATIC FRONTEND
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.resolve(__dirname, "../frontend/dist");

app.use(express.static(clientPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

/* =========================================================
   ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (NODE_ENV !== "production") {
    console.error(err.stack);
  }
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Une erreur inattendue s’est produite.",
  });
});

/* =========================================================
   START SERVER
========================================================= */
app.listen(PORT, () => {
  console.log(`✅ Server running at port ${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
  console.log(`🚀 App ready on Render`);
});
