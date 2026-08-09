import { useState, useEffect } from "react";

export default function CompleteInvitationPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    password: "",
  });

  // Récupérer le token depuis le hash (#access_token=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("access_token");
    setAccessToken(token);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      alert("Token d'invitation manquant ou invalide !");
      return;
    }

    try {
      const res = await fetch("/complete-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
        credentials: "include", // indispensable pour envoyer le cookie
      });

      const data = await res.json();
      if (data.success) {
        alert("Invitation finalisée !");
        window.location.href = "/dashboard";
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (err) {
      alert("Erreur réseau: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Finaliser votre invitation</h2>
      {!accessToken ? (
        <p className="text-red-600">
          ⚠️ Lien invalide ou expiré. Veuillez demander une nouvelle invitation.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="Prénom"
            value={form.firstname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Nom"
            value={form.lastname}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Finaliser l'invitation
          </button>
        </form>
      )}
    </div>
  );
}