import { supabase } from "../config/database.js";

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
  .select("*");

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
    .gt("reste", 0)          // 👈 Ne récupérer que les frais restant à payer
    .order("created_at");

  if (error) throw error;

  return data.map((item) => ({
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
};




/* ==========================================================
   PAIEMENTS
========================================================== */

export const getPaiements = async () => {
  const { data, error } = await supabase
    .from("paiements")
    .select(`
      *,
      inscriptions(
        numero_inscription,
        eleve_id,
        annee_scolaire
      )
    `)
    .order("date_paiement", { ascending: false });

  if (error) throw error;

  return data;
};

export const getPaiementById = async (paiementId) => {
  const { data, error } = await supabase
    .from("paiements")
    .select(`
      *,
      inscriptions(
        numero_inscription,
        eleve_id,
        annee_scolaire
      )
    `)
    .eq("paiement_id", paiementId)
    .single();

  if (error) throw error;

  return data;
};

export const createPaiement = async (paiementData) => {
  const { data, error } = await supabase
    .from("paiements")
    .insert([
      {
        inscription_id: paiementData.inscription_id,
        numero_recu: paiementData.numero_recu,
        montant_verse: Number(paiementData.montant_verse),
        montant_total: Number(paiementData.montant_total),
        mode_paiement: paiementData.mode_paiement,
        reference_transaction: paiementData.reference_transaction || null,
        observation: paiementData.observation || "",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
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

export const getDetailsPaiement = async (paiementId) => {
  const { data, error } = await supabase
    .from("details_paiement")
    .select(`
      *,
      frais_scolaires(
        montant,
        periode,
        sexe,
        types_frais(nom)
      )
    `)
    .eq("paiement_id", paiementId);

  if (error) throw error;

  return data;
};

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

  if (optionId) {
    query = query.or(`option_id.eq.${optionId},option_id.is.null`);
  }

  const { data, error } = await query;

  console.log("ERROR =", error);
  console.log("DATA =", data);

  if (error) throw error;

  const sexeEleve = (sexe || "").trim().toLowerCase();

  const resultat = data.filter((f) => {
    const sexeFrais = (f.sexe || "").trim().toLowerCase();

    return (
      sexeFrais === "tous" ||
      sexeFrais === sexeEleve
    );
  });

  console.log("RESULTAT =", resultat);

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

export const getDerniersPaiements = async (
  limit = 20
) => {

  const { data, error } = await supabase
    .from("paiements")
    .select(`
      *,
      inscriptions(
        numero_inscription,
        eleve_id
      )
    `)
    .order("date_paiement", {
      ascending: false,
    })
    .limit(limit);

  if (error) throw error;

  return data;

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

  const { data, error } = await supabase
    .from("vue_eleves_complet")
    .select(`
      eleve_id,
      inscription_id,
      numero_inscription,

      nom,
      post_nom,
      prenom,
      sexe,

      annee_id,
      annee_scolaire,

      section_id,
      nom_section,

      option_id,
      nom_option,

      classe_id,
      nom_classe
    `)
    .or(
      [
        `nom.ilike.%${recherche}%`,
        `post_nom.ilike.%${recherche}%`,
        `prenom.ilike.%${recherche}%`,
        `numero_inscription.ilike.%${recherche}%`
      ].join(",")
    )
    .order("nom")
    .limit(10);

  if (error) throw error;

  return data;
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