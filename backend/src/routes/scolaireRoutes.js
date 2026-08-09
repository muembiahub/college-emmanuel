
import express from "express";

import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

import {
  /* ==========================================================
     DASHBOARD
  ========================================================== */

  afficherDashboard,


  /* ==========================================================
     STRUCTURE SCOLAIRE
  ========================================================== */

  listerSections,
  listerOptions,
  listerClasses,
  listerClasseById,
  listerParalleles,


  /* ==========================================================
     INSCRIPTIONS
  ========================================================== */

  inscrireEleve,
  listerEleves,
  supprimerEleve,
  modifierEleve,


  /* ==========================================================
     NOTIFICATIONS
  ========================================================== */

  listerNotifications,
  lireNotification,
  lireToutesNotifications,
  supprimerNotification,


  /* ==========================================================
     PERSONNEL
  ========================================================== */

  getPersonnel,
  getPersonnelById,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,

} from "../controllers/scolaireController.js";


const router = express.Router();


/* ==========================================================
   AUTHENTIFICATION GÉNÉRALE
========================================================== */

/*
 * Tous les utilisateurs doivent être connectés.
 *
 * Rôles disponibles :
 *
 * promoteur
 * superadmin
 * secretaire
 * comptable
 * agent
 * enseignant
 */

router.use(requireApiAuth);


/* ==========================================================
   DASHBOARD
========================================================== */

/*
 * Accessible à tous les utilisateurs authentifiés.
 */

router.get(
  "/homepage",
  afficherDashboard
);


/* ==========================================================
   STRUCTURE SCOLAIRE
========================================================== */

/*
 * Accessible à tous les utilisateurs authentifiés.
 *
 * promoteur    ✅
 * superadmin   ✅
 * secretaire   ✅
 * comptable    ✅
 * agent        ✅
 * enseignant   ✅
 */


/* ----------------------------------------------------------
   SECTIONS
---------------------------------------------------------- */

router.get(
  "/sections",
  listerSections
);


/* ----------------------------------------------------------
   OPTIONS
---------------------------------------------------------- */

/*
 * GET /dashboard/options?section_id=UUID
 */

router.get(
  "/options",
  listerOptions
);


/* ----------------------------------------------------------
   CLASSES
---------------------------------------------------------- */

/*
 * GET /dashboard/classes?option_id=UUID
 */

router.get(
  "/classes",
  listerClasses
);


router.get(
  "/classes/:id",
  listerClasseById
);


/* ----------------------------------------------------------
   PARALLÈLES
---------------------------------------------------------- */

/*
 * GET /dashboard/paralleles?classe_id=UUID
 */

router.get(
  "/paralleles",
  listerParalleles
);


/* ==========================================================
   INSCRIPTIONS
========================================================== */

/*
 * Les inscriptions sont accessibles à :
 *
 * promoteur    ✅
 * superadmin   ✅
 * secretaire   ✅
 * comptable    ✅
 * agent        ✅
 * enseignant   ❌
 *
 * IMPORTANT :
 * Le requireRole est placé directement avant
 * les routes d'inscription.
 */

router.use(
  "/inscription",
  requireRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable",
    "agent"
  )
);


/* ----------------------------------------------------------
   NOUVELLE INSCRIPTION
---------------------------------------------------------- */

router.post(
  "/inscription",
  inscrireEleve
);


/* ----------------------------------------------------------
   LISTE DES ÉLÈVES
---------------------------------------------------------- */

router.get(
  "/eleves",
  requireRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable",
    "agent"
  ),
  listerEleves
);


/* ----------------------------------------------------------
   SUPPRIMER UN ÉLÈVE
---------------------------------------------------------- */

router.delete(
  "/eleves/:id",
  requireRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable",
    "agent"
  ),
  supprimerEleve
);


/* ----------------------------------------------------------
   MODIFIER UN ÉLÈVE
---------------------------------------------------------- */

router.put(
  "/eleves/:id",
  requireRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable",
    "agent"
  ),
  modifierEleve
);


/* ==========================================================
   NOTIFICATIONS
========================================================== */

/*
 * Les notifications sont accessibles à tous.
 *
 * promoteur    ✅
 * superadmin   ✅
 * secretaire   ✅
 * comptable    ✅
 * agent        ✅
 * enseignant   ✅
 */


/* ----------------------------------------------------------
   LISTE DES NOTIFICATIONS
---------------------------------------------------------- */

router.get(
  "/notifications",
  listerNotifications
);


/* ----------------------------------------------------------
   MARQUER TOUTES LES NOTIFICATIONS COMME LUES
---------------------------------------------------------- */

router.put(
  "/notifications/read-all",
  lireToutesNotifications
);


/* ----------------------------------------------------------
   MARQUER UNE NOTIFICATION COMME LUE
---------------------------------------------------------- */

router.put(
  "/notifications/:id/read",
  lireNotification
);


/* ----------------------------------------------------------
   SUPPRIMER UNE NOTIFICATION
---------------------------------------------------------- */

router.delete(
  "/notifications/:id",
  supprimerNotification
);


/* ==========================================================
   PERSONNEL
========================================================== */

/*
 * La gestion du personnel est réservée à :
 *
 * promoteur    ✅
 * superadmin   ✅
 * secretaire   ✅
 * comptable    ✅
 * agent        ❌
 * enseignant   ❌
 */


/* ----------------------------------------------------------
   PROTECTION PERSONNEL
---------------------------------------------------------- */

router.use(
  "/personnel",
  requireRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable"
  )
);


/* ----------------------------------------------------------
   LISTE DU PERSONNEL
---------------------------------------------------------- */

router.get(
  "/personnel",
  getPersonnel
);


/* ----------------------------------------------------------
   PERSONNEL PAR ID
---------------------------------------------------------- */

router.get(
  "/personnel/:id",
  getPersonnelById
);


/* ----------------------------------------------------------
   CRÉER UN PERSONNEL
---------------------------------------------------------- */

router.post(
  "/personnel",
  createPersonnel
);


/* ----------------------------------------------------------
   MODIFIER UN PERSONNEL
---------------------------------------------------------- */

router.put(
  "/personnel/:id",
  updatePersonnel
);


/* ----------------------------------------------------------
   SUPPRIMER UN PERSONNEL
---------------------------------------------------------- */

router.delete(
  "/personnel/:id",
  deletePersonnel
);


/* ==========================================================
   EXPORT
========================================================== */

export default router;