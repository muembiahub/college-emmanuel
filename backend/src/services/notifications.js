import { createNotification } from "../models/scolaireModel.js";
/**
 * Crée une notification
 */
export const notify = async ({
  type,
  titre,
  message,
  reference_id = null,
}) => {
  try {
    await createNotification({
      type,
      titre,
      message,
      reference_id,
    });
  } catch (error) {
    console.error("Erreur Notification :", error.message);
  }
};

/**
 * Notification d'une nouvelle inscription
 */
export const notifyInscription = async (eleve) => {
  await notify({
    type: "inscription",
    titre: "Nouvelle inscription",
    message: `${eleve.nom} ${eleve.post_nom} ${eleve.prenom} a été inscrit avec succès.`,
    reference_id: eleve.eleve_id,
  });
};

/**
 * Notification d'un paiement
 */
export const notifyPaiement = async (paiement) => {
  await notify({
    type: "paiement",
    titre: "Paiement reçu",
    message: `Le paiement de ${paiement.montant} $ a été enregistré.`,
    reference_id: paiement.paiement_id,
  });
};

/**
 * Notification d'un nouvel enseignant
 */
export const notifyPersonnel = async (personnel) => {
  await notify({
    type: "personnel",
    titre: "Nouveau membre du personnel",
    message: `${personnel.nom} ${personnel.post_nom} a été ajouté au personnel.`,
    reference_id: personnel.personnel_id,
  });
};

/**
 * Notification d'une nouvelle année scolaire
 */
export const notifyAnneeScolaire = async (annee) => {
  await notify({
    type: "annee",
    titre: "Nouvelle année scolaire",
    message: `L'année scolaire ${annee.libelle} a été créée.`,
    reference_id: annee.annee_id,
  });
};

/**
 * Notification d'une nouvelle classe
 */
export const notifyClasse = async (classe) => {
  await notify({
    type: "classe",
    titre: "Nouvelle classe",
    message: `La classe ${classe.nom} a été ajoutée.`,
    reference_id: classe.classe_id,
  });
};