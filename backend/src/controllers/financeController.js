import { supabase } from "../config/database.js";

/**
 * Récupère les mouvements financiers (recettes et dépenses) de manière paginée et filtrée.
 */
export const getRapportsPagine = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      sort = 'date',
      order = 'desc',
      search = '',
      type = 'TOUT',
      // ... autres filtres à ajouter ici
    } = req.query;

    const offset = (page - 1) * limit;

    // Pour une performance optimale, il est recommandé de créer une vue ou une fonction
    // dans Supabase qui unifie les paiements et les dépenses.
    // Par exemple, une vue nommée 'mouvements_financiers_vue'.
    // En attendant, nous allons simuler cela en ne paginant que les paiements pour l'exemple.

    let query = supabase.from("paiements").select(`
        detail_paiement_id,
        date_paiement,
        montant_paye,
        numero_recu,
        mode_paiement,
        statut,
        inscriptions (
          eleves ( nom, post_nom, prenom ),
          classes ( nom_classe, options ( nom_option ) )
        ),
        obligation_details (
          obligations (
            periode,
            frais ( types_frais ( nom ) )
          )
        )
      `, { count: 'exact' });

    // 1. Filtrage
    if (search) {
      // Cette recherche est simplifiée. Une recherche full-text serait plus performante.
      query = query.or(`inscriptions.eleves.nom.ilike.%${search}%,inscriptions.eleves.post_nom.ilike.%${search}%,numero_recu.ilike.%${search}%`);
    }
    
    // Le filtre 'type' (ENTREE/SORTIE) nécessiterait la vue unifiée.
    // if (type !== 'TOUT') { ... }

    // 2. Tri
    const sortColumn = sort === 'montant' ? 'montant_paye' : 'date_paiement';
    query = query.order(sortColumn, { ascending: order === 'asc' });

    // 3. Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transformation des données pour correspondre au format attendu par le frontend
    const mouvements = data.map(p => ({
      id: `recette-${p.detail_paiement_id}`,
      type: "ENTREE",
      date: p.date_paiement,
      description: p.obligation_details[0]?.obligation.frais.types_frais.nom || 'Frais divers',
      details: `${p.inscriptions.eleves.nom || ''} ${p.inscriptions.eleves.post_nom || ''} ${p.inscriptions.eleves.prenom || ''}`.trim(),
      context: `${p.inscriptions.classes.nom_classe || ''} (${p.inscriptions.classes.options?.nom_option || 'N/A'})`,
      amount: Number(p.montant_paye || 0),
      receipt: p.numero_recu,
      paymentMethod: p.mode_paiement,
      status: p.statut,
      original: p,
    }));

    // NOTE: Les dépenses et le calcul du solde total filtré ne sont pas inclus ici
    // car cela complexifie grandement la requête sans une vue SQL.

    return res.status(200).json({
      success: true,
      data: mouvements,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      },
    });

  } catch (error) {
    console.error("Erreur getRapportsPagine:", error);
    return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
  }
};