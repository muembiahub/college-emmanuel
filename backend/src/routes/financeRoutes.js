import express from "express";

import {
  /* ==========================================================
     ANNEES SCOLAIRES
  ========================================================== */
  afficherAnneesScolaires,
  afficherAnneeScolaire,
  creerAnneeScolaire,
  modifierAnneeScolaire,
  supprimerAnneeScolaire,

  /* ==========================================================
     TYPES DE FRAIS
  ========================================================== */
  afficherTypesFrais,
  afficherTypeFrais,
  creerTypeFrais,
  modifierTypeFrais,
  supprimerTypeFrais,

  /* ==========================================================
     FRAIS SCOLAIRES
  ========================================================== */
  afficherFraisScolaires,
  afficherFraisScolaire,
  creerFraisScolaire,
  modifierFraisScolaire,
  supprimerFraisScolaire,

  /* ==========================================================
     PAIEMENTS
  ========================================================== */
  afficherPaiements,
  afficherPaiement,
  enregistrerPaiement,
  annulerPaiementController,
  rembourserPaiementController,

  /* ==========================================================
     DETAILS DES PAIEMENTS
  ========================================================== */
  afficherDetailsPaiement,
  creerDetailPaiement,
  supprimerDetailPaiement,

  /* ==========================================================
     HISTORIQUE / RECHERCHE
  ========================================================== */
  afficherHistoriquePaiements,
  afficherMontantPaye,
  rechercherEleve,
  afficherInscription,
  getObligationsInscription,

  /* ==========================================================
     DASHBOARD
  ========================================================== */
  afficherDashboardFinance,

//   ====================================
//  Depense 
// ======================================

  listerDepenses,
  ajouterDepense,
  supprimerDepense,
  modifierDepense,

} from "../controllers/financeControllers.js";

const router = express.Router();

/* ==========================================================
   DASHBOARD
========================================================== */

router.get("/homepage", afficherDashboardFinance);

/* ==========================================================
   ANNEES SCOLAIRES
========================================================== */

router.get("/annees", afficherAnneesScolaires);
router.get("/annees/:id", afficherAnneeScolaire);
router.post("/annees", creerAnneeScolaire);
router.put("/annees/:id", modifierAnneeScolaire);
router.delete("/annees/:id", supprimerAnneeScolaire);

/* ==========================================================
   TYPES DE FRAIS
========================================================== */

router.get("/types-frais", afficherTypesFrais);
router.get("/types-frais/:id", afficherTypeFrais);
router.post("/types-frais", creerTypeFrais);
router.put("/types-frais/:id", modifierTypeFrais);
router.delete("/types-frais/:id", supprimerTypeFrais);

/* ==========================================================
   FRAIS SCOLAIRES
========================================================== */

router.get("/frais", afficherFraisScolaires);
router.get("/frais/:id", afficherFraisScolaire);
router.post("/frais", creerFraisScolaire);
router.put("/frais/:id", modifierFraisScolaire);
router.delete("/frais/:id", supprimerFraisScolaire);

/* ==========================================================
   PAIEMENTS
========================================================== */

router.get("/paiements", afficherPaiements);
router.get("/paiements/:paiementId", afficherPaiement);
router.post("/paiementseleves", enregistrerPaiement);

router.put(
  "/paiements/:paiementId/annuler",
  annulerPaiementController
);

router.put(
  "/paiements/:paiementId/rembourser",
  rembourserPaiementController
);

/* ==========================================================
   DETAILS DES PAIEMENTS
========================================================== */

router.get(
  "/paiements/:paiementId/details",
  afficherDetailsPaiement
);

router.post(
  "/paiements/details",
  creerDetailPaiement
);

router.delete(
  "/paiements/details/:detailId",
  supprimerDetailPaiement
);

/* ==========================================================
   HISTORIQUE
========================================================== */

router.get(
  "/historique/:inscriptionId",
  afficherHistoriquePaiements
);

router.get(
  "/montant-paye/:inscriptionId",
  afficherMontantPaye
);

/* ==========================================================
   RECHERCHE INSCRIPTION
========================================================== */

router.get(
  "/rechercher",
  rechercherEleve
);

router.get(
  "/inscriptions/:inscriptionId",
  afficherInscription
);

/* ==========================================================
   FRAIS D'UN ELEVE
========================================================== */

router.get(
  "/obligations/:inscriptionId",
  getObligationsInscription
);


router.get("/depenses", listerDepenses);
router.post("/depenses", ajouterDepense);
router.delete("/depenses/:id", supprimerDepense);
router.put("/depenses/:id", modifierDepense);

export default router;