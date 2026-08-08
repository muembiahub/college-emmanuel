import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, KeyRound } from "lucide-react";

export default function CreateAccount() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Récupération du jeton stocké par la page de callback
  const accessToken = localStorage.getItem("supabase_access_token");

  useEffect(() => {
    // Si l'utilisateur arrive sur cette page sans être passé par le callback, on le redirige
    if (!accessToken) {
      toast.error("Session d'invitation non trouvée. Veuillez utiliser le lien reçu par e-mail.");
      navigate("/login");
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/complete-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // On envoie le jeton d'accès au backend pour qu'il puisse authentifier la requête auprès de Supabase
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      toast.success("Votre compte a été activé avec succès !");

      // Nettoyage des jetons d'invitation après utilisation
      localStorage.removeItem("supabase_access_token");
      localStorage.removeItem("supabase_refresh_token");

      // Redirection vers la page de connexion avec un message de succès
      navigate("/login", { state: { message: "Compte activé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe." } });

    } catch (error) {
      toast.error(error.message || "Impossible de finaliser le compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-slate-800 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-indigo-400" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">Finaliser votre inscription</h2>
          <p className="mt-2 text-sm text-slate-400">Choisissez un mot de passe pour activer votre compte.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Nouveau mot de passe</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="animate-spin" /> : "Définir le mot de passe et activer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}