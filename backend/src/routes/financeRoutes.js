
import express from "express";

import { requireApiAuth } from "../middlewares/apiRequireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

import {
  /* ==========================================================
     ANNÉES SCOLAIRES
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
     DÉTAILS DES PAIEMENTS
  ========================================================== */

  afficherElevesPaiementsParClasse,
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
     DASHBOARD FINANCE
  ========================================================== */

  afficherDashboardFinance,


  /* ==========================================================
     DÉPENSES
  ========================================================== */

  listerDepenses,
  ajouterDepense,
  supprimerDepense,
  modifierDepense,

} from "../controllers/financeControllers.js";


const router = express.Router();


/* ==========================================================
   AUTHENTIFICATION
========================================================== */

/*
 * Tous les utilisateurs doivent être authentifiés.
 *
 * Rôles :
 *
 * promoteur    ✅
 * superadmin   ✅
 * secretaire   ✅
 * comptable    ✅
 * agent        ✅
 * enseignant   ✅
 */

router.use(requireApiAuth);


/* ==========================================================
   ANNÉES SCOLAIRES — LECTURE
========================================================== */

/*
 * Les années scolaires sont des informations
 * communes à toute l'application.
 *
 * Tous les utilisateurs authentifiés peuvent
 * les consulter.
 *
 * promoteur    ✅
 * superadmin   ✅
 * secretaire   ✅
 * comptable    ✅
 * agent        ✅
 * enseignant   ✅
 */

router.get(
  "/annees",
  afficherAnneesScolaires
);

router.get(
  "/annees/:id",
  afficherAnneeScolaire
);


/* ==========================================================
   PROTECTION FINANCE
========================================================== */

/*
 * À partir d'ici, nous sommes dans les fonctionnalités
 * administratives / financières.
 *
 * Rôles autorisés :
 *
 * promoteur
 * superadmin
 * secretaire
 * comptable
 *
 * Refusés :
 *
 * agent
 * enseignant
 */

router.use(
  requireRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable"
  )
);


/* ==========================================================
   DASHBOARD FINANCE
========================================================== */

router.get(
  "/homepage",
  afficherDashboardFinance
);


/* ==========================================================
   ANNÉES SCOLAIRES — ADMINISTRATION
========================================================== */

/*
 * Seuls les rôles autorisés Finance peuvent
 * créer, modifier ou supprimer une année.
 */

router.post(
  "/annees",
  creerAnneeScolaire
);

router.put(
  "/annees/:id",
  modifierAnneeScolaire
);

router.delete(
  "/annees/:id",
  supprimerAnneeScolaire
);


/* ==========================================================
   TYPES DE FRAIS
========================================================== */

router.get(
  "/types-frais",
  afficherTypesFrais
);

router.get(
  "/types-frais/:id",
  afficherTypeFrais
);

router.post(
  "/types-frais",
  creerTypeFrais
);

router.put(
  "/types-frais/:id",
  modifierTypeFrais
);

router.delete(
  "/types-frais/:id",
  supprimerTypeFrais
);


/* ==========================================================
   FRAIS SCOLAIRES
========================================================== */

router.get(
  "/frais",
  afficherFraisScolaires
);

router.get(
  "/frais/:id",
  afficherFraisScolaire
);

router.post(
  "/frais",
  creerFraisScolaire
);

router.put(
  "/frais/:id",
  modifierFraisScolaire
);

router.delete(
  "/frais/:id",
  supprimerFraisScolaire
);


/* ==========================================================
   PAIEMENTS
========================================================== */

router.get(
  "/paiements",
  afficherPaiements
);

router.get(
  "/paiements/:paiementId",
  afficherPaiement
);

router.post(
  "/paiementseleves",
  enregistrerPaiement
);

router.put(
  "/paiements/:paiementId/annuler",
  annulerPaiementController
);

router.put(
  "/paiements/:paiementId/rembourser",
  rembourserPaiementController
);


/* ==========================================================
   DÉTAILS DES PAIEMENTS
========================================================== */

router.get(
  "/classe/:classeId",
  afficherElevesPaiementsParClasse
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
   HISTORIQUE DES PAIEMENTS
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
   OBLIGATIONS / FRAIS D'UN ÉLÈVE
========================================================== */

router.get(
  "/obligations/:inscriptionId",
  getObligationsInscription
);


/* ==========================================================
   DÉPENSES
========================================================== */

router.get(
  "/depenses",
  listerDepenses
);

router.post(
  "/depenses",
  ajouterDepense
);

router.delete(
  "/depenses/:id",
  supprimerDepense
);

router.put(
  "/depenses/:id",
  modifierDepense
);


/* ==========================================================
   EXPORT
========================================================== */

export default router;