import { useState } from "react";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdSend,
  MdSchool,
} from "react-icons/md";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de l'envoi.");
      }

      setFeedback({
        type: "success",
        message: "Votre message a été envoyé avec succès.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Une erreur est survenue.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-16">
      <section className="rounded-[2.5rem] bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 px-8 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-blue-950">
            <MdSchool size={42} />
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Contactez le Collège Emmanuel
          </h1>

          <p className="mt-6 text-blue-100 text-lg">
            Nous sommes à votre écoute pour toute demande
            d'information ou d'inscription.
          </p>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-950">
            Envoyez-nous un message
          </h2>

          {feedback && (
            <div className={`mt-6 rounded-xl p-4 ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <input className="rounded-xl border p-3" placeholder="Nom complet" name="name" value={form.name} onChange={handleChange}/>
              <input className="rounded-xl border p-3" placeholder="eleve_adresse email" name="email" type="email" value={form.email} onChange={handleChange}/>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input className="rounded-xl border p-3" placeholder="Téléphone" name="phone" value={form.phone} onChange={handleChange}/>
              <input className="rounded-xl border p-3" placeholder="Sujet" name="subject" value={form.subject} onChange={handleChange}/>
            </div>

            <textarea className="w-full rounded-xl border p-3" rows="6" placeholder="Votre message..." name="message" value={form.message} onChange={handleChange}/>

            <button disabled={sending} className="inline-flex items-center gap-3 rounded-full bg-yellow-500 px-8 py-4 font-bold text-blue-950">
              <MdSend size={22}/>
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>

        <aside className="rounded-[2rem] bg-blue-950 p-8 text-white space-y-8">
          <Info icon={<MdLocationOn size={28}/>} title="eleve_adresse">
            Lubumbashi, Haut-Katanga<br/>RDC
          </Info>

          <Info icon={<MdPhone size={28}/>} title="Téléphone">
            <a href="tel:+243971211539">+243 971 211 539</a>
          </Info>

          <Info icon={<MdEmail size={28}/>} title="Email">
            <a href="mailto:contact@college-emmanuel.cd">
              contact@college-emmanuel.cd
            </a>
          </Info>

          <Info icon={<MdAccessTime size={28}/>} title="Horaires">
            Lundi - Vendredi<br/>07h30 - 16h30
          </Info>
        </aside>
      </section>

      <section className="overflow-hidden rounded-[2rem] shadow-xl">
        <iframe
          title="Carte"
          src="https://www.google.com/maps/embed?pb="
          className="h-[450px] w-full"
          loading="lazy"
        />
      </section>
    </div>
  );
}

function Info({icon,title,children}){
  return (
    <div className="flex gap-4">
      <div className="rounded-2xl bg-yellow-400 p-4 text-blue-950">
        {icon}
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="mt-2 text-blue-100">{children}</div>
      </div>
    </div>
  );
}
