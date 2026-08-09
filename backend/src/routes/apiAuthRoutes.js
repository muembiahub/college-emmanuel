import express from "express";
import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { login, logout, currentUser, completeInvitation } from "../controllers/apiAuthControllers.js";
import { listerAllOptions } from "../controllers/scolaireController.js";
import { getRapportsPagine } from "../controllers/financeController.js";

const router = express.Router();

/* =====================================================
   AUTH ROUTES
===================================================== */

// Finalisation invitation
router.post("/complete-invitation", completeInvitation);

// Connexion
router.post("/login", login);

// Déconnexion
router.post("/logout", logout);

// Utilisateur connecté (protégé par middleware)
router.get("/current-user", requireApiAuth, currentUser);

// Route pour les rapports financiers paginés
router.get("/finance/rapports", requireApiAuth, getRapportsPagine);

// Données de base protégées
router.get("/options", listerAllOptions);




export default router;
