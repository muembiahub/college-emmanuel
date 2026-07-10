import express from "express";

import {
  inscrireEleve,
  listerEleves,
  listerNiveaux,
  listerSections,
  listerClasses,
  listerParalleles,
  listerNotifications,
  lireNotification,
  lireToutesNotifications,
  afficherDashboard
} from "../controllers/scolaireController.js";



const router = express.Router();




/* ======================================================
   DASHBOARD
====================================================== */


router.get(
  "/homepage",
  afficherDashboard
);




/* ======================================================
   NOTIFICATIONS
====================================================== */


router.get(
  "/notifications",
  listerNotifications
);


router.put(
  "/notification/:id/read",
  lireNotification
);


router.put(
  "/notifications/read-all",
  lireToutesNotifications
);





/* ======================================================
   INSCRIPTIONS / ELEVES
====================================================== */


router.post(
  "/inscription",
  inscrireEleve
);


router.get(
  "/eleves",
  listerEleves
);






/* ======================================================
   STRUCTURE SCOLAIRE
====================================================== */


router.get(
  "/niveaux",
  listerNiveaux
);


router.get(
  "/sections",
  listerSections
);


router.get(
  "/classes",
  listerClasses
);


router.get(
  "/paralleles",
  listerParalleles
);




export default router;