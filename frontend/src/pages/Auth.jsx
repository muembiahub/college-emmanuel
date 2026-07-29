import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/UseAuth";

const initialLoginForm = {
  usernameOrEmail: "",
  password: "",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialLoginForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.usernameOrEmail || !form.password) {
      toast.warning("Veuillez remplir tous les champs.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.usernameOrEmail,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Identifiants incorrects.");
      }

      login(data.token, data.user);

      toast.success(
        `Bienvenue ${data.user.firstname || "dans votre espace"} 🎓`
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-5 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/login_bg.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2xvZ2luX2JnLmF2aWYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1MzE4NTgwLCJleHAiOjE4MTY4NTQ1ODB9.Trauc-fyTNyniY6tGVwYNGogiiYCOnBSl21YAah-eKw')" }}
    >
      
      {/* Calque sombre global pour l'arrière-plan */}
      <div className="absolute inset-0  z-0"></div>

      {/* Conteneur global très transparent (bg-white/40) avec un fort effet de flou de verre (backdrop-blur-xl) */}
      <div className="grid lg:grid-cols-2 max-w-5xl w-full shadow-2xl overflow-hidden relative z-10 border border-white/30">

        {/* SECTION FORMULAIRE DE CONNEXION */}
       <section className="p-8 lg:p-12 flex flex-col justify-center bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
  <div className="mb-8">
    <p className="text-sm uppercase tracking-widest text-blue-300 font-bold drop-shadow-md">
      Espace scolaire
    </p>
    <h1 className="text-3xl font-bold text-white mt-3 drop-shadow-md">
      Connexion
    </h1>
    <p className="text-slate-200 mt-3 font-medium drop-shadow-sm">
      Connectez-vous à votre compte d'administration.
    </p>
  </div>

  {error && (
    <div className="p-4 rounded-2xl mb-5 bg-red-500/20 border border-red-400/40 text-red-100 text-sm font-medium backdrop-blur-sm">
      {error}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-5">
    <div>
      <label className="text-sm font-semibold text-slate-100 drop-shadow-sm">
        Email ou identifiant
      </label>
      <input
        type="text"
        name="usernameOrEmail"
        value={form.usernameOrEmail}
        onChange={handleChange}
        placeholder="ex: jean@gmail.com"
        required
        className="mt-2 w-full rounded-2xl border border-white/30 bg-black/30 px-4 py-3 text-white placeholder-slate-400 focus:bg-black/50 focus:ring-2 focus:ring-blue-400 outline-none transition backdrop-blur-sm shadow-inner"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-100 drop-shadow-sm">
        Mot de passe
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Votre mot de passe"
          required
          className="mt-2 w-full rounded-2xl border border-white/30 bg-black/30 px-4 py-3 text-white placeholder-slate-400 focus:bg-black/50 focus:ring-2 focus:ring-blue-400 outline-none transition backdrop-blur-sm shadow-inner"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 text-sm text-blue-300 font-semibold hover:text-blue-100 transition"
        >
          {showPassword ? "Cacher" : "Voir"}
        </button>
      </div>
    </div>

    <button
      disabled={isSubmitting}
      className="w-full rounded-full bg-blue-600 text-white py-3.5 font-semibold hover:bg-blue-500 shadow-lg shadow-blue-900/50 transition disabled:opacity-50 backdrop-blur-sm border border-blue-400/30"
    >
      {isSubmitting ? "Connexion..." : "Se connecter"}
    </button>
  </form>
</section>

        {/* SECTION PRESENTATION ECOLE (Très transparente) */}
        <section className="p-8 lg:p-12 flex flex-col justify-between border-l border-white/25">
  <div>
    <h2 className="text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
      Collège Emmanuel 🎓
    </h2>
    <p className="mt-3 text-xl font-medium text-slate-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
      Votre plateforme numérique de gestion scolaire. 
      Accédez aux informations académiques, aux cours, aux notes et aux communications.
    </p>
  </div>

  <div className="mt-8 space-y-4">
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
      <strong className="text-white text-base drop-shadow-md">📚 Élèves</strong>
      <p className="text-slate-200 text-sm mt-1 font-normal">
        Consultation des notes, horaires et devoirs.
      </p>
    </div>
    
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
      <strong className="text-white text-base drop-shadow-md">👨‍🏫 Enseignants</strong>
      <p className="text-slate-200 text-sm mt-1 font-normal">
        Gestion des cours, présences et évaluations.
      </p>
    </div>
    
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
      <strong className="text-white text-base drop-shadow-md">🔐 Administration</strong>
      <p className="text-slate-200 text-sm mt-1 font-normal">
        Gestion des utilisateurs et paramètres scolaires.
      </p>
    </div>
  </div>
</section>

      </div>
    </div>
  );
}