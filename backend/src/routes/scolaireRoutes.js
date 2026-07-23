import express from "express";

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

} from "../controllers/scolaireController.js";

const router = express.Router();

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

// Toutes les classes d'une option
// GET /dashboard/classes?option_id=UUID
router.get("/classes", listerClasses);

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

export default router;