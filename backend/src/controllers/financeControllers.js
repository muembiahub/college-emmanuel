import {
  getAnneesScolaires,
  getAnneeScolaireById,
  getObligationsByIds,
  updateObligationPaiement,
  getDetailsPaiement,
  createDetailPaiement,
  deleteDetailPaiement,
  getPaiementsByInscription,
  getMontantPaye,
  getInscriptionByNumero,
  getInscriptionById,
  createPaiement,
  getObligationsByInscription,
  generateNumeroRecu,
  getRecettesDuJour,
  getRecettesDuMois,
  getDerniersPaiements,
  getNombrePaiements,
  getrechercherInscription,
} from "../models/financeModel.js";

/* ==========================================================
   ANNEES SCOLAIRES
========================================================== */

export const afficherAnneesScolaires = async (req, res) => {
  try {
    const annees = await getAnneesScolaires();

    res.status(200).json({
      success: true,
      data: annees,
    });
  } catch (error) {
    console.error("Erreur récupération des années scolaires :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const afficherAnneeScolaire = async (req, res) => {
  try {
    const { id } = req.params;

    const annee = await getAnneeScolaireById(id);

    res.status(200).json({
      success: true,
      data: annee,
    });
  } catch (error) {
    console.error("Erreur récupération de l'année scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const creerAnneeScolaire = async (req, res) => {
  try {
    const annee = await createAnneeScolaire(req.body);

    res.status(201).json({
      success: true,
      message: "Année scolaire créée avec succès.",
      data: annee,
    });
  } catch (error) {
    console.error("Erreur création de l'année scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const modifierAnneeScolaire = async (req, res) => {
  try {
    const { id } = req.params;

    const annee = await updateAnneeScolaire(id, req.body);

    res.status(200).json({
      success: true,
      message: "Année scolaire mise à jour avec succès.",
      data: annee,
    });
  } catch (error) {
    console.error("Erreur modification de l'année scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const supprimerAnneeScolaire = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAnneeScolaire(id);

    res.status(200).json({
      success: true,
      message: "Année scolaire supprimée avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression de l'année scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   TYPES DE FRAIS
========================================================== */

export const afficherTypesFrais = async (req, res) => {
  try {
    const types = await getTypesFrais();

    res.status(200).json({
      success: true,
      data: types,
    });
  } catch (error) {
    console.error("Erreur récupération des types de frais :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const afficherTypeFrais = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await getTypeFraisById(id);

    res.status(200).json({
      success: true,
      data: type,
    });
  } catch (error) {
    console.error("Erreur récupération du type de frais :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const creerTypeFrais = async (req, res) => {
  try {
    const type = await createTypeFrais(req.body);

    res.status(201).json({
      success: true,
      message: "Type de frais créé avec succès.",
      data: type,
    });
  } catch (error) {
    console.error("Erreur création du type de frais :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const modifierTypeFrais = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await updateTypeFrais(id, req.body);

    res.status(200).json({
      success: true,
      message: "Type de frais mis à jour avec succès.",
      data: type,
    });
  } catch (error) {
    console.error("Erreur modification du type de frais :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const supprimerTypeFrais = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteTypeFrais(id);

    res.status(200).json({
      success: true,
      message: "Type de frais supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression du type de frais :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   FRAIS SCOLAIRES
========================================================== */

export const afficherFraisScolaires = async (req, res) => {
  try {
    const frais = await getFraisScolaires();

    res.status(200).json({
      success: true,
      data: frais,
    });
  } catch (error) {
    console.error("Erreur récupération des frais scolaires :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const afficherFraisScolaire = async (req, res) => {
  try {
    const { id } = req.params;

    const frais = await getFraisScolaireById(id);

    res.status(200).json({
      success: true,
      data: frais,
    });
  } catch (error) {
    console.error("Erreur récupération du frais scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const creerFraisScolaire = async (req, res) => {
  try {
    const frais = await createFraisScolaire(req.body);

    res.status(201).json({
      success: true,
      message: "Frais scolaire créé avec succès.",
      data: frais,
    });
  } catch (error) {
    console.error("Erreur création du frais scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const modifierFraisScolaire = async (req, res) => {
  try {
    const { id } = req.params;

    const frais = await updateFraisScolaire(id, req.body);

    res.status(200).json({
      success: true,
      message: "Frais scolaire mis à jour avec succès.",
      data: frais,
    });
  } catch (error) {
    console.error("Erreur modification du frais scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const supprimerFraisScolaire = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteFraisScolaire(id);

    res.status(200).json({
      success: true,
      message: "Frais scolaire supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression du frais scolaire :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   PAIEMENTS
========================================================== */

export const afficherPaiements = async (req, res) => {
  try {
    const paiements = await getPaiements();

    res.status(200).json({
      success: true,
      data: paiements,
    });
  } catch (error) {
    console.error("Erreur récupération des paiements :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const afficherPaiement = async (req, res) => {
  try {
    const { paiementId } = req.params;

    const paiement = await getPaiementById(paiementId);

    res.status(200).json({
      success: true,
      data: paiement,
    });
  } catch (error) {
    console.error("Erreur récupération du paiement :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const enregistrerPaiement = async (req, res) => {
  try {
   const {
  inscription_id,
  montant_verse,
  mode_paiement,
  reference_transaction = null,
  observation = "",
} = req.body;

    /* ==========================================================
       VALIDATION
    ========================================================== */

    if (!inscription_id) {
      return res.status(400).json({
        success: false,
        message: "L'inscription est obligatoire.",
      });
    }

    if (!montant_verse || Number(montant_verse) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Le montant versé est invalide.",
      });
    }

    if (!mode_paiement) {
      return res.status(400).json({
        success: false,
        message: "Le mode de paiement est obligatoire.",
      });
    }


  

  /* ==========================================================
   RECUPERATION DES OBLIGATIONS A PAYER
========================================================== */

const obligationsDB = await getObligationsByInscription(
  inscription_id
);

if (!obligationsDB.length) {
  return res.status(400).json({
    success: false,
    message: "Aucune obligation à payer.",
  });
}

let resteARepartir = Number(montant_verse);
let montant_total = 0;
const details = [];

/* ==========================================================
   REPARTITION AUTOMATIQUE DU MONTANT
========================================================== */

for (const obligation of obligationsDB) {
  if (resteARepartir <= 0) break;

  const resteObligation = Number(obligation.reste);

  const montantPaye = Math.min(
    resteARepartir,
    resteObligation
  );

  montant_total += montantPaye;

  details.push({
  obligation_id: obligation.obligation_id,
  montant_paye: montantPaye,
  periode: obligation.periode,
  mois: obligation.mois,
  types_frais: obligation.types_frais,
});

  resteARepartir -= montantPaye;
}

/* ==========================================================
   CREATION DU PAIEMENT
========================================================== */

const numero_recu = await generateNumeroRecu();

const paiement = await createPaiement({
  inscription_id,
  numero_recu,
  montant_verse: Number(montant_verse),
  montant_total,
  mode_paiement,
  reference_transaction,
  observation,
});

/* ==========================================================
   ENREGISTREMENT DES DETAILS
========================================================== */

await createDetailPaiement(
  details.map((d) => ({
    paiement_id: paiement.paiement_id,
    obligation_id: d.obligation_id,
    montant_paye: d.montant_paye,
  }))
);

/* ==========================================================
   MISE A JOUR DES OBLIGATIONS
========================================================== */

for (const detail of details) {
  const obligation = obligationsDB.find(
    (o) => o.obligation_id === detail.obligation_id
  );

  const nouveauMontantPaye =
    Number(obligation.montant_paye) +
    Number(detail.montant_paye);

  const nouveauReste = Math.max(
    Number(obligation.montant_du) -
      nouveauMontantPaye,
    0
  );

  let statut = "partiel";

  if (nouveauMontantPaye <= 0) {
    statut = "impaye";
  } else if (nouveauReste === 0) {
    statut = "paye";
  }

  await updateObligationPaiement(
    obligation.obligation_id,
    nouveauMontantPaye,
    nouveauReste,
    statut
  );
}

    /* ==========================================================
       REPONSE
    ========================================================== */

    return res.status(201).json({
      success: true,
      message: "Paiement enregistré avec succès.",
      data: {
        paiement,
        details,
      },
    });
  } catch (error) {
    console.error("Erreur enregistrement du paiement :", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const annulerPaiementController = async (req, res) => {
  try {
    const { paiementId } = req.params;

    const paiement = await annulerPaiement(paiementId);

    res.status(200).json({
      success: true,
      message: "Paiement annulé avec succès.",
      data: paiement,
    });
  } catch (error) {
    console.error("Erreur annulation du paiement :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rembourserPaiementController = async (req, res) => {
  try {
    const { paiementId } = req.params;

    const paiement = await rembourserPaiement(paiementId);

    res.status(200).json({
      success: true,
      message: "Paiement remboursé avec succès.",
      data: paiement,
    });
  } catch (error) {
    console.error("Erreur remboursement du paiement :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   DETAILS DES PAIEMENTS
========================================================== */

export const afficherDetailsPaiement = async (req, res) => {
  try {
    const { paiementId } = req.params;

    const details = await getDetailsPaiement(paiementId);

    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error("Erreur récupération des détails :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const creerDetailPaiement = async (req, res) => {
  try {
    const detail = await createDetailPaiement(req.body);

    res.status(201).json({
      success: true,
      message: "Détail de paiement créé avec succès.",
      data: detail,
    });
  } catch (error) {
    console.error("Erreur création du détail :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const supprimerDetailPaiement = async (req, res) => {
  try {
    const { detailId } = req.params;

    await deleteDetailPaiement(detailId);

    res.status(200).json({
      success: true,
      message: "Détail supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression du détail :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   HISTORIQUE D'UNE INSCRIPTION
========================================================== */

export const afficherHistoriquePaiements = async (req, res) => {
  try {
    const { inscriptionId } = req.params;

    const historique = await getPaiementsByInscription(inscriptionId);

    res.status(200).json({
      success: true,
      data: historique,
    });
  } catch (error) {
    console.error("Erreur historique des paiements :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const afficherMontantPaye = async (req, res) => {
  try {
    const { inscriptionId } = req.params;

    const montant = await getMontantPaye(inscriptionId);

    res.status(200).json({
      success: true,
      montant,
    });
  } catch (error) {
    console.error("Erreur montant payé :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   RECHERCHE D'UNE INSCRIPTION
========================================================== */



export const afficherInscription = async (req, res) => {
  try {
    const { inscriptionId } = req.params;

    const inscription = await getInscriptionById(inscriptionId);

    res.status(200).json({
      success: true,
      data: inscription,
    });
  } catch (error) {
    console.error("Erreur récupération inscription :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getObligationsInscription = async (req, res) => {
  try {
    const { inscriptionId } = req.params;

    const obligations = await getObligationsByInscription(inscriptionId);

    res.json({
      success: true,
      data: obligations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement des obligations.",
    });
  }
};

/* ==========================================================
   TABLEAU DE BORD FINANCIER
========================================================== */

export const afficherDashboardFinance = async (req, res) => {
  try {
    const [
      numeroRecu,
      recettesJour,
      recettesMois,
      derniersPaiements,
      nombrePaiements,
    ] = await Promise.all([
      generateNumeroRecu(),
      getRecettesDuJour(),
      getRecettesDuMois(),
      getDerniersPaiements(),
      getNombrePaiements(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        prochainNumeroRecu: numeroRecu,
        recettesJour,
        recettesMois,
        derniersPaiements,
        nombrePaiements,
      },
    });
  } catch (error) {
    console.error("Erreur dashboard finance :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================================
   RECHERCHE D'UN ELEVE
========================================================== */

export const rechercherEleve = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Le terme de recherche est obligatoire.",
      });
    }

    const eleves = await getrechercherInscription(q);

    res.status(200).json({
      success: true,
      data: eleves,
    });
  } catch (error) {
    console.error("Erreur recherche élève :", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};