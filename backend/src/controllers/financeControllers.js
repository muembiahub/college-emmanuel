import {
  getAnneesScolaires,
  getAnneeScolaireById,
  getTypesFrais,

  // frais scolaires
  getFraisScolaires,
  getFraisScolaireById,
  createFraisScolaire,
  updateFraisScolaire,
  deleteFraisScolaire,

  // inscriptions

  getObligationsByIds,
  updateObligationPaiement,
  getObligationsByInscription,

 
  createDetailPaiement,
  deleteDetailPaiement,
  getPaiements,
  getPaiementById,
  getPaiementsByInscription,
  getMontantPaye,

  getInscriptionByNumero,
  getInscriptionById,
  getrechercherInscription,

  createPaiement,


  generateNumeroRecu,
  getRecettesDuJour,
  getRecettesDuMois,
  getDerniersPaiements,
  getNombrePaiements,

  getMontantEncaisse,
  getMontantRestant,
  getNombreObligations,
  getNombreObligationsImpayees,
  getNombreObligationsPartielles,
  getNombreObligationsPayees,
  getNombreDebiteurs,
  getEvolutionRecettesMensuelles,
  getRepartitionModesPaiement,
  getElevesPaiementsParClasse,

  createDepense,
  getDepenses,
  deleteDepense,
  updateDepense,
  
} from "../models/financeModel.js";

import { notify } from "../services/notifications.js";

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

  /* ==========================================================
     TEST : VÉRIFIER QUE CE CONTRÔLEUR EST BIEN APPELÉ
  ========================================================== */

  console.log("");
  console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
  console.log("🔥 ENREGISTRER PAIEMENT APPELÉ");
  console.log("🔥 ROUTE :", req.method, req.originalUrl);
  console.log("🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥");
  console.log("");

  console.log(
    "📦 BODY COMPLET :",
    JSON.stringify(req.body, null, 2)
  );

  try {

    /* ==========================================================
       RÉCUPÉRATION DES DONNÉES
    ========================================================== */

    const {
      inscription_id,
      montant_verse,
      mode_paiement,
      reference_transaction = null,
      observation = "",
      obligations = [],
    } = req.body;


    console.log("========================================");
    console.log("💰 NOUVEAU PAIEMENT");
    console.log("🧾 Inscription :", inscription_id);
    console.log("💵 Montant versé :", montant_verse);
    console.log("💳 Mode paiement :", mode_paiement);

    console.log(
      "📋 OBLIGATIONS REÇUES DU FRONTEND :"
    );

    console.log(
      JSON.stringify(
        obligations,
        null,
        2
      )
    );

    console.log("========================================");


    /* ==========================================================
       VALIDATION DE BASE
    ========================================================== */

    if (!inscription_id) {
      return res.status(400).json({
        success: false,
        message: "L'inscription est obligatoire.",
      });
    }


    if (
      !montant_verse ||
      Number(montant_verse) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Le montant versé est invalide.",
      });
    }


    if (!mode_paiement) {
      return res.status(400).json({
        success: false,
        message:
          "Le mode de paiement est obligatoire.",
      });
    }


    /* ==========================================================
       VÉRIFIER LES OBLIGATIONS SÉLECTIONNÉES
    ========================================================== */

    if (
      !Array.isArray(obligations) ||
      obligations.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Veuillez sélectionner au moins un frais à payer.",
      });
    }


    /* ==========================================================
       RÉCUPÉRER LES OBLIGATIONS DE L'INSCRIPTION
    ========================================================== */

    console.log("");
    console.log(
      "🔎 Recherche des obligations pour :",
      inscription_id
    );

    const obligationsDB =
      await getObligationsByInscription(
        inscription_id
      );


    if (!obligationsDB.length) {
      return res.status(400).json({
        success: false,
        message:
          "Aucune obligation financière trouvée.",
      });
    }


    /* ==========================================================
       AFFICHER LES OBLIGATIONS DISPONIBLES
    ========================================================== */

    console.log("");
    console.log(
      "📦 OBLIGATIONS DISPONIBLES EN BASE"
    );

    console.table(
      obligationsDB.map((o) => ({
        obligation_id:
          o.obligation_id,

        frais:
          o.types_frais?.nom,

        periode:
          o.periode,

        mois:
          o.mois?.nom,

        montant_du:
          o.montant_du,

        montant_paye:
          o.montant_paye,

        reste:
          o.reste,

        statut:
          o.statut,
      }))
    );


    /* ==========================================================
       PRÉPARER LES DÉTAILS
    ========================================================== */

    const details = [];

    let montant_total = 0;


    /* ==========================================================
       TRAITER CHAQUE OBLIGATION SÉLECTIONNÉE
    ========================================================== */

    for (const item of obligations) {

      console.log("");
      console.log(
        "========================================"
      );

      console.log(
        "🔎 OBLIGATION DEMANDÉE PAR LE FRONTEND"
      );

      console.log({
        obligation_id:
          item.obligation_id,

        montant_paye:
          item.montant_paye,
      });


      /* ========================================================
         RECHERCHE EXACTE PAR obligation_id

         IMPORTANT :
         On ne cherche PAS par :
         - inscription_id
         - frais_id
         - mois
         - index

         On cherche uniquement par obligation_id.
      ======================================================== */

      const obligation =
        obligationsDB.find(
          (o) =>
            String(
              o.obligation_id
            ) ===
            String(
              item.obligation_id
            )
        );


      /* ========================================================
         OBLIGATION INTROUVABLE
      ======================================================== */

      if (!obligation) {

        console.error(
          "❌ OBLIGATION INTROUVABLE"
        );

        console.error(
          "ID reçu :",
          item.obligation_id
        );

        return res.status(400).json({
          success: false,
          message:
            "Une des obligations sélectionnées est invalide.",

          obligation_id:
            item.obligation_id,
        });
      }


      /* ========================================================
         AFFICHER L'OBLIGATION EXACTEMENT TROUVÉE
      ======================================================== */

      console.log(
        "✅ OBLIGATION TROUVÉE"
      );

      console.log({
        obligation_id:
          obligation.obligation_id,

        frais:
          obligation.types_frais?.nom,

        periode:
          obligation.periode,

        mois:
          obligation.mois?.nom,

        montant_du:
          obligation.montant_du,

        montant_paye:
          obligation.montant_paye,

        reste:
          obligation.reste,

        statut:
          obligation.statut,
      });


      /* ========================================================
         MONTANT À PAYER
      ======================================================== */

      const montantPaye =
        Number(
          item.montant_paye
        );


      if (
        !Number.isFinite(
          montantPaye
        ) ||
        montantPaye <= 0
      ) {

        return res.status(400).json({
          success: false,

          message:
            `Le montant du frais "${
              obligation.types_frais?.nom ||
              "inconnu"
            }" est invalide.`,
        });
      }


      /* ========================================================
         RESTE DE L'OBLIGATION
      ======================================================== */

      const resteObligation =
        Number(
          obligation.reste || 0
        );


      /* ========================================================
         NE PAS DÉPASSER LE RESTE
      ======================================================== */

      if (
        montantPaye >
        resteObligation
      ) {

        return res.status(400).json({
          success: false,

          message:
            `Le montant payé pour "${
              obligation.types_frais?.nom ||
              "ce frais"
            }${
              obligation.mois?.nom
                ? ` - ${obligation.mois.nom}`
                : ""
            }" dépasse le montant restant.`,

          reste:
            resteObligation,

          montant_demande:
            montantPaye,
        });
      }


      /* ========================================================
         AJOUTER LE DÉTAIL
      ======================================================== */

      details.push({
        obligation_id:
          obligation.obligation_id,

        montant_paye:
          montantPaye,
      });


      montant_total +=
        montantPaye;


      console.log(
        "✅ DÉTAIL AJOUTÉ :",
        {
          obligation_id:
            obligation.obligation_id,

          frais:
            obligation.types_frais?.nom,

          mois:
            obligation.mois?.nom,

          montant_paye:
            montantPaye,
        }
      );
    }


    /* ==========================================================
       VÉRIFICATION DU TOTAL
    ========================================================== */

    const montantVerseNumber =
      Number(
        montant_verse
      );


    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "💵 MONTANT VERSÉ :",
      montantVerseNumber
    );

    console.log(
      "💰 TOTAL SÉLECTIONNÉ :",
      montant_total
    );


    const difference =
      Math.abs(
        montantVerseNumber -
        montant_total
      );


    if (
      difference > 0.01
    ) {

      console.error(
        "❌ LE TOTAL NE CORRESPOND PAS"
      );

      return res.status(400).json({
        success: false,

        message:
          `Le montant versé (${montantVerseNumber}) ne correspond pas au total des frais sélectionnés (${montant_total}).`,

        montant_verse:
          montantVerseNumber,

        montant_selectionne:
          montant_total,
      });
    }


    /* ==========================================================
       CRÉATION DU NUMÉRO DE REÇU
    ========================================================== */

    const numero_recu =
      await generateNumeroRecu();


    /* ==========================================================
       CRÉATION DU PAIEMENT
    ========================================================== */

    const paiement =
      await createPaiement({

        inscription_id,

        numero_recu,

        montant_verse:
          montantVerseNumber,

        montant_total,

        mode_paiement,

        reference_transaction,

        observation,
      });


    console.log("");
    console.log(
      "✅ PAIEMENT CRÉÉ"
    );

    console.log(
      "🧾 Paiement ID :",
      paiement.paiement_id
    );

    console.log(
      "🧾 Numéro reçu :",
      numero_recu
    );


    /* ==========================================================
       CRÉER LES DÉTAILS DU PAIEMENT
    ========================================================== */

    const detailsPaiement =
      details.map(
        (detail) => ({
          paiement_id:
            paiement.paiement_id,

          obligation_id:
            detail.obligation_id,

          montant_paye:
            detail.montant_paye,
        })
      );


    console.log("");
    console.log(
      "📋 DÉTAILS DU PAIEMENT"
    );

    console.log(
      JSON.stringify(
        detailsPaiement,
        null,
        2
      )
    );


    await createDetailPaiement(
      detailsPaiement
    );


    /* ==========================================================
       MISE À JOUR DES OBLIGATIONS
    ========================================================== */

    for (
      const detail of details
    ) {

      /* --------------------------------------------------------
         Retrouver EXACTEMENT la même obligation
      -------------------------------------------------------- */

      const obligation =
        obligationsDB.find(
          (o) =>
            String(
              o.obligation_id
            ) ===
            String(
              detail.obligation_id
            )
        );


      if (!obligation) {
        throw new Error(
          `Obligation ${detail.obligation_id} introuvable lors de la mise à jour.`
        );
      }


      /* --------------------------------------------------------
         Ancien montant payé
      -------------------------------------------------------- */

      const ancienMontantPaye =
        Number(
          obligation.montant_paye ||
          0
        );


      /* --------------------------------------------------------
         Montant dû
      -------------------------------------------------------- */

      const montantDu =
        Number(
          obligation.montant_du ||
          0
        );


      /* --------------------------------------------------------
         Nouveau montant payé
      -------------------------------------------------------- */

      const montantPaye =
        Number(
          detail.montant_paye
        );


      const nouveauMontantPaye =
        ancienMontantPaye +
        montantPaye;


      /* --------------------------------------------------------
         Nouveau reste
      -------------------------------------------------------- */

      const nouveauReste =
        Math.max(
          montantDu -
          nouveauMontantPaye,
          0
        );


      /* --------------------------------------------------------
         Nouveau statut
      -------------------------------------------------------- */

      const statut =
        nouveauReste === 0
          ? "paye"
          : nouveauMontantPaye > 0
          ? "partiel"
          : "impaye";


      /* --------------------------------------------------------
         LOG IMPORTANT
      -------------------------------------------------------- */

      console.log("");
      console.log(
        "🔄 MISE À JOUR DE L'OBLIGATION"
      );

      console.log({
        obligation_id:
          obligation.obligation_id,

        frais:
          obligation.types_frais?.nom,

        periode:
          obligation.periode,

        mois:
          obligation.mois?.nom,

        ancienMontantPaye,

        montantPaye,

        nouveauMontantPaye,

        nouveauReste,

        statut,
      });


      /* --------------------------------------------------------
         UPDATE
      -------------------------------------------------------- */

      await updateObligationPaiement(
        obligation.obligation_id,

        nouveauMontantPaye,

        nouveauReste,

        statut
      );
    }


    /* ==========================================================
       RÉCUPÉRER LE RAPPORT DU PAIEMENT
    ========================================================== */

    const rapport =
      await getPaiementById(
        paiement.paiement_id
      );


    /* ==========================================================
       SUCCÈS
    ========================================================== */

    console.log("");
    console.log(
      "✅✅✅ PAIEMENT TERMINÉ AVEC SUCCÈS"
    );

    console.log(
      "🧾 Reçu :",
      numero_recu
    );

    console.log(
      "💰 Total :",
      montant_total
    );

    console.log(
      "========================================"
    );


    return res.status(201).json({
      success: true,

      message:
        "Paiement enregistré avec succès.",

      data:
        rapport,
    });


  } catch (error) {

    console.error("");
    console.error(
      "❌❌❌ ERREUR ENREGISTREMENT PAIEMENT"
    );

    console.error(
      error
    );

    console.error(
      "========================================"
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Erreur lors de l'enregistrement du paiement.",
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
      montantEncaisse,
      montantRestant,
      nombreObligations,
      obligationsImpayees,
      obligationsPartielles,
      obligationsPayees,
      nombreDebiteurs,
      evolutionMensuelle,
      repartitionPaiements,
    ] = await Promise.all([
      generateNumeroRecu(),
      getRecettesDuJour(),
      getRecettesDuMois(),
      getDerniersPaiements(10),
      getNombrePaiements(),

      getMontantEncaisse(),
      getMontantRestant(),
      getNombreObligations(),

      getNombreObligationsImpayees(),
      getNombreObligationsPartielles(),
      getNombreObligationsPayees(),

      getNombreDebiteurs(),

      getEvolutionRecettesMensuelles(),
      getRepartitionModesPaiement(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        statistiques: {
          prochainNumeroRecu: numeroRecu,

          recettesJour,
          recettesMois,

          montantEncaisse,
          montantRestant,

          nombrePaiements,
          nombreObligations,
          nombreDebiteurs,

          obligationsImpayees,
          obligationsPartielles,
          obligationsPayees,
        },

        graphiques: {
          evolutionMensuelle,
          repartitionPaiements,
        },

        derniersPaiements,
      },
    });
  } catch (error) {
    console.error("Erreur dashboard finance :", error);

    return res.status(500).json({
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




/* ==========================================================
   CONTRÔLEUR : RÉCUPÉRER LES ÉLÈVES ET LEURS FINANCES PAR CLASSE
========================================================== */

export const afficherElevesPaiementsParClasse = async (req, res) => {
  try {
    const { classeId } = req.params;

    if (!classeId) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant de la classe (classeId) est obligatoire.",
      });
    }

    // Appel de la fonction du modèle
    const elevesFinances = await getElevesPaiementsParClasse(classeId);

    return res.status(200).json({
      success: true,
      count: elevesFinances.length,
      data: elevesFinances,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves par classe :", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Erreur interne du serveur.",
    });
  }
};






// ==================================================
//  Depenses 
// ==================================================

export const listerDepenses = async (req, res) => {
  try {
    const depenses = await getDepenses();
    return res.status(200).json(depenses);
  } catch (error) {
    return res.status(500).json({ error: "Impossible de charger les dépenses." });
  }
};

export const ajouterDepense = async (req, res) => {
  try {
    const nouvelleDepense = await createDepense(req.body);
    return res.status(201).json(nouvelleDepense);
  } catch (error) {
    return res.status(500).json({ error: "Impossible d'ajouter la dépense." });
  }
};

export const supprimerDepense = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDepense(id);
    return res.status(200).json({ success: true, message: "Dépense supprimée." });
  } catch (error) {
    return res.status(500).json({ error: "Impossible de supprimer la dépense." });
  }
};

export const modifierDepense = async (req, res) => {
  try {
    const { id } = req.params;

    const depense = await updateDepense(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Dépense mise à jour avec succès.",
      data: depense,
    });
  } catch (error) {
    console.error("Erreur modification dépense :", error);

    return res.status(500).json({
      success: false,
      error: "Impossible de mettre à jour la dépense.",
    });
  }
};




