
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

        // IMPORTANT :
        // permet au navigateur de recevoir et renvoyer
        // le cookie HttpOnly "connect.sid"
        credentials: "include",

        body: JSON.stringify({
          email: form.usernameOrEmail.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Identifiants incorrects."
        );
      }

      /*
       * IMPORTANT :
       *
       * Le token Supabase n'est plus envoyé au frontend.
       * Il est conservé uniquement dans req.session
       * côté backend.
       *
       * Le frontend conserve uniquement les informations
       * utilisateur nécessaires à l'affichage.
       */
      login(data.user);

      toast.success(
        `Bienvenue ${
          data.user?.firstname || "dans votre espace"
        } 🎓`
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("❌ Erreur de connexion :", error);

      const message =
        error?.message || "Une erreur est survenue lors de la connexion.";

      setError(message);
      toast.error(message);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/login_bg.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2xvZ2luX2JnLmF2aWYiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1MzE4NTgwLCJleHAiOjE4MTY4NTQ1ODB9.Trauc-fyTNyniY6tGVwYNGogiiYCOnBSl21YAah-eKw')",
      }}
    >
      {/* Calque sombre global */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Conteneur principal */}
      <div className="grid lg:grid-cols-2 max-w-5xl w-full shadow-2xl overflow-hidden relative z-10 border border-white/30 rounded-3xl">

        {/* =====================================================
            SECTION FORMULAIRE DE CONNEXION
        ====================================================== */}

        <section className="p-8 lg:p-12 flex flex-col justify-center bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              Connexion
            </h1>

            <p className="text-slate-200 mt-2">
              Connectez-vous à votre espace College Emmanuel.
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="text-sm font-semibold text-slate-100 drop-shadow-sm"
              >
                Email
              </label>

              <input
                id="usernameOrEmail"
                type="email"
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="Votre adresse email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/30 bg-black/30 px-4 py-3 text-white placeholder-slate-400 focus:bg-black/50 focus:ring-2 focus:ring-blue-400 outline-none transition backdrop-blur-sm shadow-inner"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-100 drop-shadow-sm"
              >
                Mot de passe
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  required
                  className="mt-2 w-full rounded-2xl border border-white/30 bg-black/30 px-4 py-3 pr-20 text-white placeholder-slate-400 focus:bg-black/50 focus:ring-2 focus:ring-blue-400 outline-none transition backdrop-blur-sm shadow-inner"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 text-sm text-blue-300 font-semibold hover:text-blue-100 transition"
                >
                  {showPassword ? "Cacher" : "Voir"}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-blue-600 text-white py-3.5 font-semibold hover:bg-blue-500 shadow-lg shadow-blue-900/50 transition disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-blue-400/30"
            >
              {isSubmitting
                ? "Connexion..."
                : "Se connecter"}
            </button>
          </form>
        </section>

        {/* =====================================================
            SECTION PRESENTATION ECOLE
        ====================================================== */}

        <section className="p-8 lg:p-12 hidden lg:flex flex-col justify-between border-l border-white/25 bg-black/20 backdrop-blur-sm">

          <div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              College Emmanuel
            </h2>

            <p className="text-slate-200 mt-3 leading-relaxed">
              Une plateforme centralisée pour gérer
              efficacement votre établissement scolaire.
            </p>
          </div>

          <div className="space-y-4 mt-10">

            {/* Enseignants */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
              <strong className="text-white text-base drop-shadow-md">
                👨‍🏫 Enseignants
              </strong>

              <p className="text-slate-200 text-sm mt-1 font-normal">
                Gestion des cours, présences et évaluations.
              </p>
            </div>

            {/* Administration */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
              <strong className="text-white text-base drop-shadow-md">
                🔐 Administration
              </strong>

              <p className="text-slate-200 text-sm mt-1 font-normal">
                Gestion des utilisateurs et paramètres scolaires.
              </p>
            </div>

            {/* Gestion scolaire */}
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-lg">
              <strong className="text-white text-base drop-shadow-md">
                🎓 Gestion scolaire
              </strong>

              <p className="text-slate-200 text-sm mt-1 font-normal">
                Suivi des élèves, inscriptions et finances.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
