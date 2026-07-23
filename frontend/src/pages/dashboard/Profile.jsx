import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";
import { User, Shield, AlertTriangle, LogOut, ArrowLeft, Loader2, UserCheck } from "lucide-react";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setFetching(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`/dashboard/profile/${user?.id || ""}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Le serveur a renvoyé du HTML au lieu de JSON (Statut: ${response.status}).`);
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Impossible de charger le profil");
        }

        setProfile(data.data);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Erreur de chargement du profil");
        console.error("Profile fetch error:", err);
      } finally {
        setFetching(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }

    return () => controller.abort();
  }, [navigate, user]);

  const currentUser = profile || user || null;
  const currentLoading = loading || fetching;

  const roleName = useMemo(() => {
    if (!currentUser?.roles?.name) return "Utilisateur";
    const name = currentUser.roles.name.toLowerCase();
    if (name === "superadmin") return "Super Administrateur";
    if (name === "admin") return "Administrateur";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [currentUser]);

  const displayName = useMemo(() => {
    if (!currentUser) return "Utilisateur";
    if (currentUser.firstname || currentUser.lastname) {
      return `${currentUser.firstname || ""} ${currentUser.lastname || ""}`.trim();
    }
    if (currentUser.full_name) {
      return currentUser.full_name;
    }
    return currentUser.username || currentUser.email || "Utilisateur";
  }, [currentUser]);

  if (currentLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <Loader2 className="animate-spin text-indigo-400 w-10 h-10 mx-auto relative z-10" />
          </div>
          <p className="text-slate-300 font-medium text-xs sm:text-sm tracking-wide">
            Chargement sécurisé du profil...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="space-y-6 max-w-xl w-full mx-auto p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center">
          <div className="inline-flex p-4 bg-rose-500/10 rounded-2xl shadow-inner border border-rose-500/20 text-rose-400">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">Profil introuvable</h1>
            <p className="mt-1.5 text-xs lg:text-sm text-slate-400">
              {error || "Vous devez vous reconnecter pour afficher vos informations personnelles."}
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 py-3 text-xs lg:text-sm font-bold text-white transition-all hover:brightness-110 shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            Aller à la page de connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-8 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="relative z-10 max-w-7xl mx-auto space-y-5 lg:space-y-6">
        
        {/* EN-TÊTE PROFIL */}
        <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 lg:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>

          <div className="relative flex items-center gap-4.5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl lg:text-3xl font-black shadow-lg shadow-indigo-500/25 ring-1 ring-white/25 shrink-0">
              {displayName[0]?.toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-bold">
                Mon Compte Sécurisé
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
                {displayName}
              </h1>
              <p className="text-xs lg:text-sm text-slate-300 flex items-center gap-2 mt-1">
                <Shield size={14} className="text-indigo-400 shrink-0" /> 
                <span>Rôle attribué :</span> 
                <span className="font-bold text-indigo-300 px-2 py-0.5 bg-white/[0.05] rounded-lg border border-white/10">
                  {roleName}
                </span>
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-all shadow-md active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Tableau de bord</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* ALERTE EN MODE DÉGRADÉ SI ERREUR MAIS UTILISATEUR DISPO */}
        {error && (
          <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 lg:p-5 shadow-xl text-amber-300 backdrop-blur-md flex items-center gap-3.5">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <div className="text-xs">
              <span className="font-bold">Mode dégradé actif :</span> {error}
            </div>
          </div>
        )}

        {/* GRILLE D'INFORMATIONS */}
        <div className="grid gap-5 lg:gap-6 xl:grid-cols-[1.5fr_1fr]">
          
          {/* INFORMATIONS PERSONNELLES */}
          <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 lg:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-base lg:text-lg font-bold text-white tracking-tight">
                  Informations personnelles
                </h2>
                <p className="text-[11px] text-slate-400">Vos données nominatives enregistrées</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Nom complet" value={displayName} />
              <ProfileField label="Nom d'utilisateur" value={currentUser.username || "-"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Adresse Email" value={currentUser.email || "-"} required />
              <ProfileField label="Numéro de téléphone" value={currentUser.phone || "-"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Date de naissance" value={currentUser.birthday || "-"} />
              
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 shadow-inner">
                <p className="text-xs font-semibold text-slate-400">Statut du compte</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${currentUser.is_active ? "bg-emerald-400 shadow-emerald-400/50 shadow-md animate-pulse" : "bg-rose-400"}`} />
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    {currentUser.is_active ? "Actif et vérifié" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* DÉTAILS TECHNIQUES DU COMPTE */}
          <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 lg:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm">
                <UserCheck size={18} />
              </div>
              <div>
                <h2 className="text-base lg:text-lg font-bold text-white tracking-tight">
                  Détails techniques
                </h2>
                <p className="text-[11px] text-slate-400">Métadonnées système</p>
              </div>
            </div>

            <div className="space-y-3">
              <AccountDetail label="ID utilisateur" value={currentUser.user_id || currentUser.uid || currentUser.id || "-"} />
              <AccountDetail label="Rôle attribué" value={roleName} />
              <AccountDetail label="Création du compte" value={currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"} />
              <AccountDetail label="Dernière mise à jour" value={currentUser.updated_at ? new Date(currentUser.updated_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"} />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, required }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 shadow-inner transition-all hover:border-white/20">
      <p className={`text-xs font-semibold text-slate-400 ${required ? "after:content-['_*'] after:text-rose-400" : ""}`}>
        {label}
      </p>
      <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-100 truncate">{value}</p>
    </div>
  );
}

function AccountDetail({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/10 px-4 py-3 text-xs text-slate-300 shadow-inner hover:border-white/20 transition-all">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="font-bold text-slate-100 font-mono text-[11px]">{value}</span>
    </div>
  );
}