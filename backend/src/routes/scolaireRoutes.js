import express from "express";
import { requireApiAuth } from "../middlewares/apiRequireAuth.js";

import {
  /* ===========================
     DASHBOARD
  =========================== */
  afficherDashboard,

  /* ===========================
     STRUCTURE SCOLAIRE
  =========================== */
  listerSections,
  listerOptions,
  listerClasses,
  listerClasseById,
  listerParalleles,

  /* ===========================
     INSCRIPTIONS
  =========================== */
  inscrireEleve,
  listerEleves,
  supprimerEleve,
  modifierEleve,

  /* ===========================
     NOTIFICATIONS
  =========================== */
  listerNotifications,
  lireNotification,
  lireToutesNotifications,

  supprimerNotification,

  getPersonnel,
  getPersonnelById,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,


} from "../controllers/scolaireController.js";

const router = express.Router();

/* ==========================================================
   ALL DASHBOARD ROUTES ARE PROTECTED
========================================================== */
router.use(requireApiAuth);

/* ==========================================================
   DASHBOARD
========================================================== */

router.get("/homepage", afficherDashboard);

/* ==========================================================
   STRUCTURE SCOLAIRE
========================================================== */

// Toutes les sections
router.get("/sections", listerSections);

// Toutes les options d'une section
// GET /dashboard/options?section_id=UUID
router.get("/options", listerOptions);
// get all option without section id


// Toutes les classes d'une option
// GET /dashboard/classes?option_id=UUID
router.get("/classes", listerClasses);
router.get("/classes/:id", listerClasseById);

// Tous les parallèles d'une classe
// GET /dashboard/paralleles?classe_id=UUID
router.get("/paralleles", listerParalleles);

/* ==========================================================
   INSCRIPTIONS
========================================================== */

// Nouvelle inscription
router.post("/inscription", inscrireEleve);



// Liste complète des élèves
router.get("/eleves", listerEleves);
router.delete("/eleves/:id", supprimerEleve);
// Modifier un élève
router.put("/eleves/:id", modifierEleve);

/* ==========================================================
   NOTIFICATIONS
========================================================== */




router.get("/notifications", listerNotifications);
router.put("/notifications/read-all", lireToutesNotifications);
router.put("/notifications/:id/read", lireNotification);
router.delete("/notifications/:id", supprimerNotification);


// ========================================================
//  Personnel 
// ========================================================

router.get("/personnel", getPersonnel);
router.get("/personnel/:id", getPersonnelById);
router.post("/personnel", createPersonnel);
router.put("/personnel/:id", updatePersonnel);
router.delete("/personnel/:id", deletePersonnel);


export default router;