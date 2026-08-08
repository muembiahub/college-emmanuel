import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Le lien de Supabase contient les tokens dans le fragment de l'URL (#)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Supprime le '#'

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type"); // 'recovery' ou 'invite'

    // Nous traitons les invitations et les récupérations de mot de passe de la même manière
    if ((type === "recovery" || type === "invite") && accessToken && refreshToken) {
      // On stocke les jetons pour les utiliser sur la page de création de mot de passe
      localStorage.setItem("supabase_access_token", accessToken);
      localStorage.setItem("supabase_refresh_token", refreshToken);
      
      // Redirection vers la page de finalisation
      navigate("/create-account");
    } else {
      // Si les paramètres sont incorrects, on redirige vers la page de connexion avec une erreur
      navigate("/login", { state: { error: "Lien d'invitation invalide ou expiré." } });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
      <p className="ml-4 text-lg">Redirection en cours...</p>
    </div>
  );
}