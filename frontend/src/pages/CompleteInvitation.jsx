import { useState, useEffect } from "react";

export default function CompleteInvitationPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    password: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Récupérer le token depuis le hash (#access_token=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("access_token");
    setAccessToken(token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!accessToken) {
      setErrorMessage("Token d'invitation manquant ou invalide.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/complete-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(data.message || "Une erreur est survenue lors de la finalisation.");
      }
    } catch (err) {
      setErrorMessage("Erreur réseau : Veuillez vérifier votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Finaliser votre invitation
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
          {errorMessage}
        </div>
      )}

      {!accessToken ? (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-center">
          ⚠️ Lien invalide ou expiré. Veuillez demander une nouvelle invitation.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              required
              placeholder="Ex: Jean"
              value={form.firstname}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              required
              placeholder="Ex: Dupont"
              value={form.lastname}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              required
              placeholder="Ex: 0612345678"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium p-2.5 rounded-md transition-colors duration-200"
          >
            {isSubmitting ? "Validation en cours..." : "Finaliser l'invitation"}
          </button>
        </form>
      )}
    </div>
  );
}