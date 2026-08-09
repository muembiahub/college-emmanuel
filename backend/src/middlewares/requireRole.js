/* =========================================================
   PROTECTION DES RÔLES
========================================================= */

/*
 * Rôles disponibles dans l'application :
 *
 * - promoteur
 * - superadmin
 * - secretaire
 * - comptable
 * - agent
 * - enseignant
 *
 *
 * UTILISATION :
 *
 * router.get(
 *   "/dashboard/finances",
 *   requireApiAuth,
 *   requireRole(
 *     "promoteur",
 *     "superadmin",
 *     "secretaire",
 *     "comptable"
 *   ),
 *   controller
 * );
 *
 *
 * Exemple pour une route réservée aux enseignants :
 *
 * router.get(
 *   "/dashboard/notes",
 *   requireApiAuth,
 *   requireRole(
 *     "promoteur",
 *     "superadmin",
 *     "secretaire",
 *     "comptable",
 *     "enseignant"
 *   ),
 *   controller
 * );
 */


export const requireRole = (...allowedRoles) => {

  return (req, res, next) => {

    try {

      /* -------------------------------------------------
         1. Vérifier que l'utilisateur est authentifié
      ------------------------------------------------- */

      if (!req.user) {

        return res.status(401).json({
          success: false,
          message: "Utilisateur non authentifié.",
        });

      }


      /* -------------------------------------------------
         2. Récupérer le rôle
      ------------------------------------------------- */

      /*
       * Ton middleware requireApiAuth construit :
       *
       * req.user = {
       *   ...profile,
       *   id: user.id,
       *   email: user.email
       * }
       *
       * Et profile contient :
       *
       * roles.name
       */

      const userRole =
        req.user?.roles?.name ||
        req.user?.role ||
        "";


      /* -------------------------------------------------
         3. Normaliser le rôle
      ------------------------------------------------- */

      const normalizedRole =
        userRole
          .toString()
          .toLowerCase()
          .trim();


      /* -------------------------------------------------
         4. Normaliser les rôles autorisés
      ------------------------------------------------- */

      const normalizedAllowedRoles =
        allowedRoles
          .filter(Boolean)
          .map((role) =>
            role
              .toString()
              .toLowerCase()
              .trim()
          );


      /* -------------------------------------------------
         5. Logs
      ------------------------------------------------- */

      console.log("=================================");
      console.log("🛡️ VÉRIFICATION AUTORISATION");

      console.log(
        "👤 Utilisateur:",
        req.user?.email
      );

      console.log(
        "👤 Nom:",
        `${req.user?.firstname || ""} ${req.user?.lastname || ""}`.trim()
      );

      console.log(
        "🔐 Rôle:",
        normalizedRole
      );

      console.log(
        "🎯 Rôles autorisés:",
        normalizedAllowedRoles
      );


      /* -------------------------------------------------
         6. Vérifier que le rôle existe
      ------------------------------------------------- */

      if (!normalizedRole) {

        console.warn(
          "⛔ Aucun rôle trouvé pour:",
          req.user?.email
        );

        console.log("=================================");

        return res.status(403).json({
          success: false,
          message:
            "Accès refusé. Aucun rôle utilisateur n'a été trouvé.",
        });

      }


      /* -------------------------------------------------
         7. Vérifier l'autorisation
      ------------------------------------------------- */

      const isAllowed =
        normalizedAllowedRoles.includes(
          normalizedRole
        );


      /* -------------------------------------------------
         8. Refuser l'accès
      ------------------------------------------------- */

      if (!isAllowed) {

        console.warn(
          "⛔ ACCÈS REFUSÉ:",
          req.user?.email,
          "→",
          normalizedRole
        );

        console.log("=================================");

        return res.status(403).json({
          success: false,
          message:
            "Accès refusé. Vous n'avez pas les permissions nécessaires.",
          role: normalizedRole,
        });

      }


      /* -------------------------------------------------
         9. Autoriser l'accès
      ------------------------------------------------- */

      console.log(
        "✅ ACCÈS AUTORISÉ:",
        req.user?.email
      );

      console.log("=================================");

      next();

    } catch (error) {

      console.error(
        "❌ Erreur vérification rôle:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Erreur lors de la vérification des permissions.",
      });

    }

  };

};
