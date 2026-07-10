import express from "express";
import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { login, logout, currentUser } from "../controllers/apiAuthControllers.js";

const router = express.Router();

/* =====================================================
   AUTH ROUTES
===================================================== */

// Connexion
router.post("/login", login);

// Déconnexion
router.post("/logout", logout);

// Utilisateur connecté (protégé par middleware)
router.get("/current-user", requireApiAuth, currentUser);

export default router;
