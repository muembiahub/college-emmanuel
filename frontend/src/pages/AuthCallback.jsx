import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(
    "Vérification de votre invitation..."
  );

  useEffect(() => {
    const processInvitation = () => {
      try {
        /*
         * Supabase place généralement les informations
         * de session dans le hash de l'URL.
         *
         * Exemple :
         * #access_token=xxx&refresh_token=xxx&type=invite
         */

        const hash = window.location.hash;

        if (!hash) {
          setStatus(
            "Lien d'invitation invalide ou expiré."
          );
          return;
        }

        const params = new URLSearchParams(
          hash.substring(1)
        );

        const accessToken =
          params.get("access_token");

        const type =
          params.get("type");

        /*
         * Vérification du token d'invitation
         */

        if (!accessToken) {
          setStatus(
            "Aucun jeton d'invitation trouvé."
          );
          return;
        }

        /*
         * Stockage temporaire du token uniquement
         * pour permettre à la page de finalisation
         * d'appeler le backend.
         */

        sessionStorage.setItem(
          "invitation_access_token",
          accessToken
        );

        /*
         * Redirection vers la page de création
         * du compte.
         */

        navigate(
          "/account/create",
          {
            replace: true,
          }
        );

      } catch (error) {
        console.error(
          "❌ Erreur AuthCallback:",
          error
        );

        setStatus(
          "Impossible de traiter votre invitation."
        );
      }
    };

    processInvitation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">

        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />

        <p className="text-xl font-semibold text-slate-700">
          {status}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Veuillez patienter...
        </p>

      </div>
    </div>
  );
}
