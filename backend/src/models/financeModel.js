import { supabase } from "../config/database.js";
import { notify } from "../services/notifications.js";

/* ==========================================================
   ANNEES SCOLAIRES
========================================================== */




export const getAnneesScolaires = async () => {
  const { data, error } = await supabase
    .from("annees_scolaires")
    .select("*")
    .order("date_debut", { ascending: false });

  if (error) throw error;

  return data;
};

export const getAnneeScolaireById = async (anneeId) => {
  const { data, error } = await supabase
    .from("annees_scolaires")
    .select("*")
    .eq("annee_id", anneeId)
    .single();

  if (error) throw error;

  return data;
};

export const createAnneeScolaire = async (anneeData) => {
  const { data, error } = await supabase
    .from("annees_scolaires")
    .insert([
      {
        libelle: anneeData.libelle,
        date_debut: anneeData.date_debut,
        date_fin: anneeData.date_fin,
        active: anneeData.active ?? false,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateAnneeScolaire = async (id, anneeData) => {
  const { data, error } = await supabase
    .from("annees_scolaires")
    .update({
      libelle: anneeData.libelle,
      date_debut: anneeData.date_debut,
      date_fin: anneeData.date_fin,
      active: anneeData.active,
      updated_at: new Date().toISOString(),
    })
    .eq("annee_id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteAnneeScolaire = async (id) => {
  const { error } = await supabase
    .from("annees_scolaires")
    .delete()
    .eq("annee_id", id);

  if (error) throw error;

  return true;
};

/* ==========================================================
   TYPES DE FRAIS
========================================================== */

export const genererObligationsFinancieres = async (
  inscription,
  eleve
) => {
  console.log("\n============================");
  console.log("GÉNÉRATION DES OBLIGATIONS");
  console.log("============================");

  console.log("📌 Inscription :", inscription);
  console.log("📌 Élève :", eleve);

  /* ==========================================================
     RECUPERATION DES FRAIS APPLICABLES
  ========================================================== */

  const { data: tousLesFrais, error } = await supabase
  .from("frais_scolaires")
  .select("*")
if (error) throw error;

console.log("TOTAL FRAIS :", tousLesFrais.length);

console.log(
  "Frais même année :",
  tousLesFrais.filter(f => f.annee_id === inscription.annee_id).length
);

console.log(
  "Frais même section :",
  tousLesFrais.filter(f => f.section_id === inscription.section_id).length
);

console.log(
  "Frais même classe :",
  tousLesFrais.filter(f => f.classe_id === inscription.classe_id).length
);

console.log(
  "Frais actifs :",
  tousLesFrais.filter(f => f.actif).length
);

const frais = tousLesFrais.filter(f =>
  f.annee_id === inscription.annee_id &&
  f.section_id === inscription.section_id &&
  f.classe_id === inscription.classe_id &&
  f.actif === true
);

console.log("Frais filtrés JS :", frais);

  if (error) {
    console.error("❌ Erreur récupération des frais :", error);
    throw error;
  }

  console.log("📚 Frais trouvés :", frais);

  if (!frais || frais.length === 0) {
    console.warn("⚠ Aucun frais trouvé pour cette inscription.");
    console.log({
      annee_id: inscription.annee_id,
      section_id: inscription.section_id,
      option_id: inscription.option_id,
      classe_id: inscription.classe_id,
    });

    return [];
  }

  /* ==========================================================
     FILTRAGE (OPTION + SEXE)
  ========================================================== */

  const fraisApplicables = frais.filter((f) => {
    const optionOk =
      !f.option_id || f.option_id === inscription.option_id;

    const sexeOk =
      f.sexe === "Tous" || f.sexe === eleve.sexe;

    return optionOk && sexeOk && Number(f.montant) > 0;
  });

  console.log("✅ Frais applicables :", fraisApplicables);

  if (fraisApplicables.length === 0) {
    console.warn("⚠ Aucun frais applicable après filtrage.");
    return [];
  }

  /* ==========================================================
     VERIFICATION DES DOUBLONS
  ========================================================== */

  const { data: existantes, error: existError } = await supabase
    .from("obligations_financieres")
    .select("frais_id")
    .eq("inscription_id", inscription.inscription_id);

  if (existError) {
    console.error("❌ Erreur vérification doublons :", existError);
    throw existError;
  }

  console.log("📄 Obligations existantes :", existantes);

  const dejaCrees = new Set(
    (existantes || []).map((o) => o.frais_id)
  );

  /* ==========================================================
     CONSTRUCTION DES OBLIGATIONS
  ========================================================== */

  const obligations = fraisApplicables
    .filter((f) => !dejaCrees.has(f.frais_id))
    .map((f) => ({
      inscription_id: inscription.inscription_id,
      frais_id: f.frais_id,
      mois_id: null,
      montant_du: Number(f.montant),
      montant_paye: 0,
      reste: Number(f.montant),
      statut: "impaye",
    }));

  console.log("📝 Obligations à créer :", obligations);

  if (obligations.length === 0) {
    console.warn("⚠ Toutes les obligations existent déjà.");
    return [];
  }

  /* ==========================================================
     INSERTION
  ========================================================== */

  const { data, error: insertError } = await supabase
    .from("obligations_financieres")
    .insert(obligations)
    .select();

  if (insertError) {
    console.error("❌ Erreur insertion obligations :", insertError);
    throw insertError;
  }

  console.log("🎉 Obligations créées :", data);

  return data;
};


export const getTypesFrais = async () => {
  const { data, error } = await supabase
    .from("types_frais")
    .select("*")
    .order("nom");

  if (error) throw error;

  return data;
};

export const getTypeFraisById = async (id) => {
  const { data, error } = await supabase
    .from("types_frais")
    .select("*")
    .eq("type_frais_id", id)
    .single();

  if (error) throw error;

  return data;
};

export const createTypeFrais = async (typeData) => {
  const { data, error } = await supabase
    .from("types_frais")
    .insert([
      {
        nom: typeData.nom,
        description: typeData.description,
        obligatoire: typeData.obligatoire ?? true,
        actif: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateTypeFrais = async (id, typeData) => {
  const { data, error } = await supabase
    .from("types_frais")
    .update({
      nom: typeData.nom,
      description: typeData.description,
      obligatoire: typeData.obligatoire,
      actif: typeData.actif,
      updated_at: new Date().toISOString(),
    })
    .eq("type_frais_id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteTypeFrais = async (id) => {
  const { error } = await supabase
    .from("types_frais")
    .delete()
    .eq("type_frais_id", id);

  if (error) throw error;

  return true;
};

/* ==========================================================
   FRAIS SCOLAIRES
========================================================== */

// 1. READ : Récupérer tous les frais via une vue ou des jointures optimisées
export const getFraisScolaires = async () => {
  const { data, error } = await supabase
    .from("vue_frais_scolaires_complet") 
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Solution de secours : si la vue n'existe pas encore, on fait les jointures directement
    console.warn("Vue non trouvée, utilisation des jointures directes :", error.message);
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("frais_scolaires")
      .select(`
        *,
        annees_scolaires(libelle),
        types_frais(nom),
        sections(nom),
        options(nom),
        classes(nom)
      `)
      .order("created_at", { ascending: false });

    if (fallbackError) throw fallbackError;
    return fallbackData;
  }

  return data;
};
// Récupérer un frais scolaire par son ID (en privilégiant la vue si elle existe)
export const getFraisScolaireById = async (id) => {
  // 1. Essayer de récupérer depuis la vue pour avoir les libellés complets
  const { data: vueData, error: vueError } = await supabase
    .from("vue_frais_scolaires_complet")
    .select("*")
    .eq("frais_id", id)
    .single();

  if (!vueError && vueData) {
    return vueData;
  }

  // 2. Fallback sur la table de base avec la colonne correcte nom_classe
  const { data, error } = await supabase
    .from("frais_scolaires")
    .select(`
      *,
      annees_scolaires(libelle),
      types_frais(nom),
      sections(nom),
      options(nom),
      classes(nom_classe)
    `)
    .eq("frais_id", id)
    .single();

  if (error) throw error;
  return data;
};

// 2. CREATE : La création pointe toujours sur la vraie table
export const createFraisScolaire = async (fraisData) => {
  const { data, error } = await supabase
    .from("frais_scolaires")
    .insert([
      {
        annee_id: fraisData.annee_id,
        type_frais_id: fraisData.type_frais_id,
        section_id: fraisData.section_id,
        option_id: fraisData.option_id || null,
        sexe: fraisData.sexe || 'tous',
        periode: fraisData.periode || 'annuel',
        montant: parseFloat(fraisData.montant),
        actif: fraisData.actif ?? true,
        classe_id: fraisData.classe_id || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 3. UPDATE : Modification sur la vraie table
export const updateFraisScolaire = async (id, fraisData) => {
  const { data, error } = await supabase
    .from("frais_scolaires")
    .update({
      annee_id: fraisData.annee_id,
      type_frais_id: fraisData.type_frais_id,
      section_id: fraisData.section_id,
      option_id: fraisData.option_id || null,
      sexe: fraisData.sexe,
      periode: fraisData.periode,
      montant: parseFloat(fraisData.montant),
      actif: fraisData.actif,
      classe_id: fraisData.classe_id || null,
      updated_at: new Date().toISOString(),
    })
    .eq("frais_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 4. DELETE : Suppression sur la vraie table
export const deleteFraisScolaire = async (id, ) => {
  const { error } = await supabase
    .from("frais_scolaires")
    .delete()
    .eq("frais_id", id);

  if (error) throw error;
  return true;
};




/* ==========================================================
   MODÈLE :  Creat FRAIS SCOLAIRES lors de l'inscription
========================================================== */

export const getObligationsByInscription = async (inscriptionId) => {
  const { data, error } = await supabase
    .from("obligations_financieres")
    .select(`
      obligation_id,
      inscription_id,
      montant_du,
      montant_paye,
      reste,
      statut,
      frais_scolaires (
        frais_id,
        montant,
        periode,
        sexe,
        types_frais (
          type_frais_id,
          nom
        )
      ),
      mois_scolaires (
        mois_id,
        nom
      )
    `)
    .eq("inscription_id", inscriptionId)
    .gt("reste", 0);

  if (error) throw error;

  // 1. Mappage des données
  const obligationsFormatees = data.map((item) => ({
    obligation_id: item.obligation_id,
    frais_id: item.frais_scolaires?.frais_id,
    montant: Number(item.montant_du),
    periode: item.frais_scolaires?.periode,
    sexe: item.frais_scolaires?.sexe,
    types_frais: item.frais_scolaires?.types_frais,
    montant_du: Number(item.montant_du),
    montant_paye: Number(item.montant_paye || 0),
    reste: Number(item.reste || item.montant_du),
    statut: item.statut,
    mois: item.mois_scolaires,
  }));

  // 2. Dictionnaire de tri de l'année scolaire (gère minuscules et majuscules)
  const ordreScolaire = {
    'annuel': 1,
    'septembre': 2,
    'Septembre': 2,
    'octobre': 3,
    'Octobre': 3,
    'novembre': 4,
    'Novembre': 4,
    'décembre': 5,
    'Décembre': 5,
    'janvier': 6,
    'Janvier': 6,
    'février': 7,
    'Février': 7,
    'mars': 8,
    'Mars': 8,
    'avril': 9,
    'Avril': 9,
    'mai': 10,
    'Mai': 10,
    'juin': 11,
    'Juin': 11
  };

  // 3. Application du tri combiné (Mois scolaire + Nom du frais)
  obligationsFormatees.sort((a, b) => {
    const periodeA = (a.periode || '').trim();
    const periodeB = (b.periode || '').trim();

    const indexA = ordreScolaire[periodeA] !== undefined ? ordreScolaire[periodeA] : 99;
    const indexB = ordreScolaire[periodeB] !== undefined ? ordreScolaire[periodeB] : 99;

    if (indexA !== indexB) {
      return indexA - indexB;
    }

    const nomA = (a.types_frais?.nom || '').toLowerCase();
    const nomB = (b.types_frais?.nom || '').toLowerCase();
    return nomA.localeCompare(nomB);
  });

  return obligationsFormatees;
};




/* ==========================================================
   PAIEMENTS
========================================================== */

export const getPaiements = async () => {
  const { data, error } = await supabase
    .from("vue_rapport_paiements")
    .select("*")
    .order("date_paiement", { ascending: false });

  if (error) throw error;

  return data;
};
export const getPaiementById = async (paiementId) => {
  const { data, error } = await supabase
    .from("vue_rapport_paiements")
    .select("*")
    .eq("paiement_id", paiementId);

  if (error) throw error;

  return data;
};

export const createPaiement = async (paiementData) => {
  /* =====================================================
     ENREGISTREMENT DU PAIEMENT
  ===================================================== */

  const { data: paiement, error } = await supabase
    .from("paiements")
    .insert([
      {
        inscription_id: paiementData.inscription_id,
        numero_recu: paiementData.numero_recu,
        montant_verse: Number(paiementData.montant_verse),
        montant_total: Number(paiementData.montant_total),
        mode_paiement: paiementData.mode_paiement,
        reference_transaction:
          paiementData.reference_transaction || null,
        observation: paiementData.observation || "",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  /* =====================================================
     RECUPERATION DE L'ELEVE
  ===================================================== */

  const { data: eleve, error: eleveError } = await supabase
  .from("vue_eleves_complet")
  .select("nom, post_nom, prenom")
  .eq("inscription_id", paiement.inscription_id)
  .single();

console.log("Paiement :", paiement);
console.log("Élève :", eleve);
console.log("Erreur élève :", eleveError);

  /* =====================================================
     NOTIFICATION
  ===================================================== */

  try {
    await notify({
      type: "paiement",
      titre: "Paiement reçu",
      message: `${
        eleve
          ? `${eleve.nom} ${eleve.post_nom} ${eleve.prenom}`
          : "Un élève"
      } a effectué un paiement de ${Number(
        paiement.montant_verse
      ).toLocaleString()} FC (Reçu : ${paiement.numero_recu}).`,
      reference_id: paiement.paiement_id,
    });

    console.log("✅ Notification de paiement créée");
  } catch (notificationError) {
    console.error(
      "Erreur lors de la création de la notification :",
      notificationError
    );
  }

  return paiement;
};



export const annulerPaiement = async (paiementId) => {
  const { data, error } = await supabase
    .from("paiements")
    .update({
      statut: "annule",
      updated_at: new Date().toISOString(),
    })
    .eq("paiement_id", paiementId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const rembourserPaiement = async (paiementId) => {
  const { data, error } = await supabase
    .from("paiements")
    .update({
      statut: "rembourse",
      updated_at: new Date().toISOString(),
    })
    .eq("paiement_id", paiementId)
    .select()
    .single();

  if (error) throw error;

  return data;
};


/* ==========================================================
   DETAILS DES PAIEMENTS
========================================================== */

export const createDetailPaiement = async (details) => {
  const { data, error } = await supabase
    .from("details_paiement")
    .insert(details)
    .select();

  if (error) throw error;

  return data;
};


export const deleteDetailPaiement = async (detailId) => {
  const { error } = await supabase
    .from("details_paiement")
    .delete()
    .eq("details_paiement_id", detailId);

  if (error) throw error;

  return true;
};

/* ==========================================================
   HISTORIQUE D'UN ELEVE
========================================================== */

export const getPaiementsByInscription = async (inscriptionId) => {
  const { data, error } = await supabase
    .from("paiements")
    .select(`
      *,
      details_paiement(
        *,
        frais_scolaires(
          types_frais(nom)
        )
      )
    `)
    .eq("inscription_id", inscriptionId)
    .order("date_paiement", {
      ascending: false,
    });

  if (error) throw error;

  return data;
};

/* ==========================================================
   TOTAL PAYE
========================================================== */

export const getMontantPaye = async (inscriptionId) => {
  const { data, error } = await supabase
    .from("paiements")
    .select("montant_total")
    .eq("inscription_id", inscriptionId)
    .eq("statut", "valide");

  if (error) throw error;

  const total =
    data?.reduce(
      (somme, paiement) =>
        somme + Number(paiement.montant_total),
      0
    ) || 0;

  return total;
};

/* ==========================================================
   RECHERCHER UNE INSCRIPTION
========================================================== */

export const getInscriptionByNumero = async (numero) => {
  const { data, error } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .eq("numero_inscription", numero)
    .single();

  if (error) throw error;

  return data;
};

/* ==========================================================
   RECHERCHER UNE INSCRIPTION PAR ID
========================================================== */

export const getInscriptionById = async (inscriptionId) => {
  const { data, error } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .eq("inscription_id", inscriptionId)
    .single();

  if (error) throw error;

  return data;
};

/* ==========================================================
   FRAIS D'UN ELEVE
========================================================== */
// 1. Définir l'ordre logique de l'année scolaire (avec clés en minuscules et majuscules pour parer à tout)
const ordreScolaire = {
  'annuel': 1,
  'septembre': 2,
  'Septembre': 2,
  'octobre': 3,
  'Octobre': 3,
  'novembre': 4,
  'Novembre': 4,
  'décembre': 5,
  'Décembre': 5,
  'janvier': 6,
  'Janvier': 6,
  'février': 7,
  'Février': 7,
  'mars': 8,
  'Mars': 8,
  'avril': 9,
  'Avril': 9,
  'mai': 10,
  'Mai': 10,
  'juin': 11,
  'Juin': 11
};

// 2. Définir la fonction de tri combinée (mois scolaire + nom du type de frais)
const trierParMoisScolaire = (a, b) => {
  const periodeA = (a.periode || '').trim();
  const periodeB = (b.periode || '').trim();

  const indexA = ordreScolaire[periodeA] !== undefined ? ordreScolaire[periodeA] : 99;
  const indexB = ordreScolaire[periodeB] !== undefined ? ordreScolaire[periodeB] : 99;

  // Si les périodes sont différentes, on trie par mois scolaire
  if (indexA !== indexB) {
    return indexA - indexB;
  }

  // Si c'est la même période, on trie par nom de type de frais par ordre alphabétique
  const nomA = (a.types_frais?.nom || '').toLowerCase();
  const nomB = (b.types_frais?.nom || '').toLowerCase();
  return nomA.localeCompare(nomB);
};

// 3. Fonction principale getFraisEleve
export const getFraisEleve = async (
  anneeId,
  sectionId,
  optionId,
  classeId,
  sexe
) => {
  console.log("PARAMS", {
    anneeId,
    sectionId,
    optionId,
    classeId,
    sexe,
  });

  let query = supabase
    .from("frais_scolaires")
    .select(`
      *,
      types_frais(nom)
    `)
    .eq("annee_id", anneeId)
    .eq("section_id", sectionId)
    .eq("classe_id", classeId)
    .eq("actif", true);

  // Gestion propre de l'option (si elle existe ou si elle est nulle/maternelle)
  if (optionId && optionId !== "null" && optionId !== "undefined") {
    query = query.or(`option_id.eq.${optionId},option_id.is.null`);
  } else {
    query = query.is("option_id", null);
  }

  const { data, error } = await query;

  console.log("ERROR =", error);
  console.log("DATA =", data);

  if (error) throw error;

  const sexeEleve = (sexe || "").trim().toLowerCase();

  // Filtrage par sexe
  const resultat = (data || []).filter((f) => {
    const sexeFrais = (f.sexe || "").trim().toLowerCase();

    return (
      sexeFrais === "tous" ||
      sexeFrais === sexeEleve
    );
  });

  // Application du tri par mois scolaire et ordre alphabétique
  resultat.sort(trierParMoisScolaire);

  console.log("RESULTAT TRIÉ =", resultat);

  return resultat;
};


/* ==========================================================
   NUMERO DE RECU
========================================================== */

export const generateNumeroRecu = async () => {

  const year = new Date().getFullYear();

  const { count, error } = await supabase
    .from("paiements")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) throw error;

  const numero =
    String((count ?? 0) + 1).padStart(5, "0");

  return `REC-${year}-${numero}`;

};

/* ==========================================================
   RECETTES DU JOUR
========================================================== */

export const getRecettesDuJour = async () => {

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("paiements")
    .select("montant_total")
    .gte("date_paiement", `${today}T00:00:00`)
    .lte("date_paiement", `${today}T23:59:59`)
    .eq("statut", "valide");

  if (error) throw error;

  return data.reduce(
    (s, p) => s + Number(p.montant_total),
    0
  );

};

/* ==========================================================
   RECETTES DU MOIS
========================================================== */

export const getRecettesDuMois = async () => {

  const now = new Date();

  const debut =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )
      .toISOString();

  const fin =
    new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    )
      .toISOString();

  const { data, error } = await supabase
    .from("paiements")
    .select("montant_total")
    .gte("date_paiement", debut)
    .lte("date_paiement", fin)
    .eq("statut", "valide");

  if (error) throw error;

  return data.reduce(
    (s, p) => s + Number(p.montant_total),
    0
  );

};

/* ==========================================================
   DERNIERS PAIEMENTS
========================================================== */

export const getDerniersPaiements = async() => {
  // 1. Récupérer les derniers paiements
  const { data: paiements, error } = await supabase
    .from("paiements")
    .select(`
      *,
      inscriptions (
        inscription_id,
        numero_inscription
      )
    `)
    .eq("statut", "valide")
    .order("date_paiement", { ascending: false });

  if (error) throw error;

  if (!paiements || paiements.length === 0) {
    return [];
  }

  // 2. Récupérer tous les IDs d'inscription
  const inscriptionIds = paiements
    .map((p) => p.inscriptions?.inscription_id)
    .filter(Boolean);

  // 3. Récupérer les élèves en une seule requête
  const { data: eleves, error: elevesError } = await supabase
    .from("vue_eleves_complet")
    .select("inscription_id, nom, post_nom, prenom")
    .in("inscription_id", inscriptionIds);

  if (elevesError) throw elevesError;

  // 4. Créer une map inscription_id -> élève
  const elevesMap = {};
  eleves.forEach((e) => {
    elevesMap[e.inscription_id] =
      `${e.nom} ${e.post_nom} ${e.prenom}`;
  });

  // 5. Fusionner les informations
  return paiements.map((paiement) => ({
    ...paiement,
    eleve:
      elevesMap[paiement.inscriptions?.inscription_id] || "-",
  }));
};

/* ==========================================================
   NOMBRE DE PAIEMENTS
========================================================== */

export const getNombrePaiements = async () => {

  const { count, error } = await supabase
    .from("paiements")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) throw error;

  return count ?? 0;

};

/* ==========================================================
   RECHERCHE D'UNE INSCRIPTION
========================================================== */

/* ==========================================================
   RECHERCHE D'UN ELEVE
========================================================== */

export const getrechercherInscription = async (q) => {
  if (!q?.trim()) return [];

  const recherche = q.trim();

  // 1. Rechercher les élèves dans la vue globale (par nom, post-nom, prénom ou numéro)
  const { data: eleves, error: errorEleves } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .or(
      [
        `nom.ilike.%${recherche}%`,
        `post_nom.ilike.%${recherche}%`,
        `prenom.ilike.%${recherche}%`,
        `numero_inscription.ilike.%${recherche}%`,
      ].join(",")
    )
    .order("nom")
    .limit(50);

  if (errorEleves) throw errorEleves;
  if (!eleves || eleves.length === 0) return [];

  // Extraire les identifiants d'inscription des élèves trouvés
  const inscriptionIds = eleves.map((e) => e.inscription_id);

  // 2. Récupérer leurs obligations financières associées
  const { data: obligations, error: errorObligations } = await supabase
    .from("vue_obligations_financieres")
    .select("*")
    .in("inscription_id", inscriptionIds);

  if (errorObligations) throw errorObligations;

  // 3. Fusionner les données et calculer les totaux financiers pour chaque élève trouvé
  const resultat = eleves.map((eleve) => {
    const obligationsEleve = (obligations || []).filter(
      (o) => o.inscription_id === eleve.inscription_id
    );

    const totalDu = obligationsEleve.reduce(
      (acc, curr) => acc + Number(curr.montant_du || 0),
      0
    );
    const totalPaye = obligationsEleve.reduce(
      (acc, curr) => acc + Number(curr.montant_paye || 0),
      0
    );
    const totalReste = obligationsEleve.reduce(
      (acc, curr) => acc + Number(curr.reste || 0),
      0
    );

    return {
      ...eleve,
      obligations: obligationsEleve,
      finances: {
        total_du: totalDu,
        total_paye: totalPaye,
        total_reste: totalReste,
      },
    };
  });

  return resultat;
};



export const getObligationsByIds = async (ids) => {
  const { data, error } = await supabase
    .from("obligations_financieres")
    .select("*")
    .in("obligation_id", ids);

  if (error) throw error;

  return data;
};



export const updateObligationPaiement = async (
  obligation_id,
  montant_paye,
  reste,
  statut
) => {
  const { data, error } = await supabase
    .from("obligations_financieres")
    .update({
      montant_paye,
      reste,
      statut,
    })
    .eq("obligation_id", obligation_id)
    .select()
    .single();

  if (error) throw error;

  return data;
};



/* ==========================================================
   MONTANT TOTAL ENCAISSÉ
========================================================== */

export const getMontantEncaisse = async () => {
  const { data, error } = await supabase
    .from("paiements")
    .select("montant_total")
    .eq("statut", "valide");

  if (error) throw error;

  return (
    data?.reduce(
      (total, paiement) => total + Number(paiement.montant_total),
      0
    ) || 0
  );
};

/* ==========================================================
   MONTANT RESTANT À RECOUVRER
========================================================== */

export const getMontantRestant = async () => {
  const { data, error } = await supabase
    .from("obligations_financieres")
    .select("reste")
    .gt("reste", 0);

  if (error) throw error;

  return (
    data?.reduce(
      (total, obligation) => total + Number(obligation.reste),
      0
    ) || 0
  );
};

/* ==========================================================
   NOMBRE TOTAL D'OBLIGATIONS
========================================================== */

export const getNombreObligations = async () => {
  const { count, error } = await supabase
    .from("obligations_financieres")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) throw error;

  return count ?? 0;
};

/* ==========================================================
   OBLIGATIONS IMPAYÉES
========================================================== */

export const getNombreObligationsImpayees = async () => {
  const { count, error } = await supabase
    .from("obligations_financieres")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("statut", "impaye");

  if (error) throw error;

  return count ?? 0;
};

/* ==========================================================
   OBLIGATIONS PARTIELLES
========================================================== */

export const getNombreObligationsPartielles = async () => {
  const { count, error } = await supabase
    .from("obligations_financieres")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("statut", "partiel");

  if (error) throw error;

  return count ?? 0;
};

/* ==========================================================
   OBLIGATIONS PAYÉES
========================================================== */

export const getNombreObligationsPayees = async () => {
  const { count, error } = await supabase
    .from("obligations_financieres")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("statut", "paye");

  if (error) throw error;

  return count ?? 0;
};

/* ==========================================================
   ÉLÈVES DÉBITEURS
========================================================== */

export const getNombreDebiteurs = async () => {
  const { data, error } = await supabase
    .from("obligations_financieres")
    .select("inscription_id")
    .gt("reste", 0);

  if (error) {
    console.error("Erreur lors de la récupération des débiteurs :", error);
    throw error;
  }

  const nombreDebiteurs = new Set(data.map((obligation) => obligation.inscription_id));
  return nombreDebiteurs.size;
};
/* ==========================================================
   ÉVOLUTION DES RECETTES PAR MOIS
========================================================== */

export const getEvolutionRecettesMensuelles = async () => {
  const { data, error } = await supabase
    .from("paiements")
    .select("date_paiement,montant_total")
    .eq("statut", "valide");

  if (error) throw error;

  const mois = Array.from({ length: 12 }, (_, i) => ({
    mois: i + 1,
    total: 0,
  }));

  data.forEach((paiement) => {
    const index = new Date(paiement.date_paiement).getMonth();
    mois[index].total += Number(paiement.montant_total);
  });

  return mois;
};

/* ==========================================================
   RÉPARTITION PAR MODE DE PAIEMENT
========================================================== */

export const getRepartitionModesPaiement = async () => {
  const { data, error } = await supabase
    .from("paiements")
    .select("mode_paiement,montant_total")
    .eq("statut", "valide");

  if (error) throw error;

  const repartition = {};

  data.forEach((paiement) => {
    const mode = paiement.mode_paiement || "Autre";

    repartition[mode] =
      (repartition[mode] || 0) + Number(paiement.montant_total);
  });

  return Object.entries(repartition).map(([mode, montant]) => ({
    mode,
    montant,
  }));
};




// =============================================================
//  Depenses
// =============================================================

/**
 * Créer une nouvelle dépense
 */
export const createDepense = async ({ motif, montant, categorie, date_depense, description = "" }) => {
  const { data, error } = await supabase
    .from("depenses")
    .insert([
      {
        motif,
        montant: parseFloat(montant),
        categorie,
        date_depense,
        description,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de la création de la dépense :", error);
    throw error;
  }

  return data;
};

/**
 * Récupérer toutes les dépenses (triées par date récente)
 */
export const getDepenses = async () => {
  const { data, error } = await supabase
    .from("depenses")
    .select("*")
    .order("date_depense", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération des dépenses :", error);
    throw error;
  }

  return data ?? [];
};

/**
 * Supprimer une dépense par son ID
 */
export const deleteDepense = async (depenseId) => {
  const { error } = await supabase
    .from("depenses")
    .delete()
    .eq("depense_id", depenseId);

  if (error) {
    console.error("Erreur lors de la suppression de la dépense :", error);
    throw error;
  }

  return true;
};

/**
 * Mettre à jour une dépense
 */
export const updateDepense = async (
  depenseId,
  {
    motif,
    montant,
    categorie,
    date_depense,
    description = "",
  }
) => {
  const { data, error } = await supabase
    .from("depenses")
    .update({
      motif,
      montant: parseFloat(montant),
      categorie,
      date_depense,
      description,
      updated_at: new Date().toISOString(), // si la colonne existe
    })
    .eq("depense_id", depenseId)
    .select()
    .single();

  if (error) {
    console.error(
      "Erreur lors de la mise à jour de la dépense :",
      error
    );
    throw error;
  }

  return data;
};



/* ==========================================================
   ÉLÈVES ET OBLIGATIONS FINANCIÈRES PAR CLASSE
========================================================== */

export const getElevesPaiementsParClasse = async (classeId) => {
  if (!classeId) return [];

  // 1. Récupérer tous les élèves de la classe via la vue globale
  const { data: eleves, error: errorEleves } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .eq("classe_id", classeId)
    .order("date_inscription", { ascending: false });

  if (errorEleves) throw errorEleves;
  if (!eleves || eleves.length === 0) return [];

  // Extraire les identifiants d'inscription de ces élèves
  const inscriptionIds = eleves.map((e) => e.inscription_id);

  // 2. Récupérer leurs obligations financières associées
  const { data: obligations, error: errorObligations } = await supabase
    .from("vue_obligations_financieres")
    .select("*")
    .in("inscription_id", inscriptionIds);

  if (errorObligations) throw errorObligations;

  // 3. Fusionner les données et calculer les totaux financiers
  const resultat = eleves.map((eleve) => {
    const obligationsEleve = (obligations || []).filter(
      (o) => o.inscription_id === eleve.inscription_id
    );

    const totalDu = obligationsEleve.reduce(
      (acc, curr) => acc + Number(curr.montant_du || 0),
      0
    );
    const totalPaye = obligationsEleve.reduce(
      (acc, curr) => acc + Number(curr.montant_paye || 0),
      0
    );
    const totalReste = obligationsEleve.reduce(
      (acc, curr) => acc + Number(curr.reste || 0),
      0
    );

    return {
      ...eleve,
      obligations: obligationsEleve,
      finances: {
        total_du: totalDu,
        total_paye: totalPaye,
        total_reste: totalReste,
      },
    };
  });

  return resultat;
};