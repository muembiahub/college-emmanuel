import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function CompleteInvitationPage() {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/complete-invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(form),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      alert("Invitation finalisée !");
      window.location.href = "/dashboard";
    } else {
      alert("Erreur: " + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Prénom"
        value={form.firstname}
        onChange={(e) => setForm({ ...form, firstname: e.target.value })}
      />
      <input
        type="text"
        placeholder="Nom"
        value={form.lastname}
        onChange={(e) => setForm({ ...form, lastname: e.target.value })}
      />
      <input
        type="text"
        placeholder="Téléphone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Finaliser l'invitation</button>
    </form>
  );
}
