import express from "express";
import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { login, logout, currentUser, completeInvitation } from "../controllers/apiAuthControllers.js";
import { listerAllOptions } from "../controllers/scolaireController.js";

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

// Finalisation du compte après invitation
router.post("/complete-invitation", completeInvitation);

// Données de base protégées
router.get("/options", listerAllOptions);




export default router;
