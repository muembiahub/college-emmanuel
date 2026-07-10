"use client";

import { useEffect, useState } from "react";
import { 
  ChevronDown, 
  User, 
  Users, 
  BookOpen, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Globe,
  Loader,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Nouvelle() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [niveaux, setNiveaux] = useState([]);
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [paralleles, setParalleles] = useState([]);

  const [formData, setFormData] = useState({
    nom: "",
    post_nom: "",
    prenom: "",
    sexe: "",
    date_naissance: "",
    lieu_naissance: "",
    nationalite: "Congolaise",
    telephone: "",
    email: "",
    adresse: "",
    nom_pere: "",
    numero_telephone_du_pere: "",
    fonction_du_pere: "",
    nom_mere: "",
    numero_telephone_de_la_mere: "",
    fonction_de_la_mere: "",
    numero_whatsapp: "",
    niveau_id: "",
    section_id: "",
    classe_id: "",
    parallele_id: "",
    annee_scolaire: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        niveauxRes,
        sectionsRes,
        classesRes,
        parallelesRes,
      ] = await Promise.all([
        fetch("/dashboard/niveaux"),
        fetch("/dashboard/sections"),
        fetch("/dashboard/classes"),
        fetch("/dashboard/paralleles"),
      ]);

      setNiveaux(await niveauxRes.json());
      setSections(await sectionsRes.json());
      setClasses(await classesRes.json());
      setParalleles(await parallelesRes.json());
    } catch (err) {
      console.log(err);
      setError("Impossible de charger les données.");
    }
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/dashboard/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      setSuccess(true);
      setFormData({
        nom: "",
        post_nom: "",
        prenom: "",
        sexe: "",
        date_naissance: "",
        lieu_naissance: "",
        nationalite: "Congolaise",
        telephone: "",
        email: "",
        adresse: "",
        nom_pere: "",
        numero_telephone_du_pere: "",
        fonction_du_pere: "",
        nom_mere: "",
        numero_telephone_de_la_mere: "",
        fonction_de_la_mere: "",
        numero_whatsapp: "",
        niveau_id: "",
        section_id: "",
        classe_id: "",
        parallele_id: "",
        annee_scolaire: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Success Alert */}
        {success && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <p className="text-green-100 font-medium">✅ Élève inscrit avec succès!</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-100 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:border-white/30 transition-all duration-300">
          
          {/* Header with gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <div className="relative px-8 md:px-12 py-8 md:py-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Nouvelle Inscription
                  </h2>
                  <p className="text-indigo-100 text-sm md:text-base mt-1">
                    Complétez les informations de l'élève
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">

            {/* Section 1: Informations de l'élève */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Informations de l'élève
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nom */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Nom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le nom"
                      className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-200"></div>
                  </div>
                </div>

                {/* Post-nom */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Post-nom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="post_nom"
                      value={formData.post_nom}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le post-nom"
                      className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                    />
                  </div>
                </div>

                {/* Prénom */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Prénom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      placeholder="Entrez le prénom"
                      className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                    />
                  </div>
                </div>

                {/* Sexe */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Sexe
                  </label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-white">Sélectionner</option>
                    <option value="Masculin" className="bg-slate-900 text-white">Masculin</option>
                    <option value="Féminin" className="bg-slate-900 text-white">Féminin</option>
                  </select>
                </div>

                {/* Date de naissance */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleChange}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  />
                </div>

                {/* Lieu de naissance */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    name="lieu_naissance"
                    value={formData.lieu_naissance}
                    onChange={handleChange}
                    placeholder="Ville/Région"
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  />
                </div>

                {/* Nationalité */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Nationalité
                  </label>
                  <input
                    type="text"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleChange}
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  />
                </div>

                {/* Téléphone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+243..."
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  />
                </div>

                {/* Adresse */}
                <div className="lg:col-span-3 group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Adresse
                  </label>
                  <textarea
                    rows="3"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Adresse complète..."
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Section 2: Informations des parents */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Informations des parents
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "nom_pere", placeholder: "Nom du père", icon: User },
                  { name: "fonction_du_pere", placeholder: "Profession du père", icon: BookOpen },
                  { name: "numero_telephone_du_pere", placeholder: "Téléphone du père", icon: Phone },
                  { name: "nom_mere", placeholder: "Nom de la mère", icon: User },
                  { name: "fonction_de_la_mere", placeholder: "Profession de la mère", icon: BookOpen },
                  { name: "numero_telephone_de_la_mere", placeholder: "Téléphone de la mère", icon: Phone },
                  { name: "numero_whatsapp", placeholder: "Numéro WhatsApp", icon: Phone },
                ].map((field) => (
                  <div key={field.name} className="group">
                    <div className="relative">
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Section 3: Informations scolaires */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Informations scolaires
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Niveau */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Niveau *
                  </label>
                  <select
                    name="niveau_id"
                    value={formData.niveau_id}
                    onChange={handleChange}
                    required
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-white">Sélectionner</option>
                    {niveaux.map((item) => (
                      <option key={item.niveau_id} value={item.niveau_id} className="bg-slate-900 text-white">
                        {item.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Section *
                  </label>
                  <select
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    required
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-white">Sélectionner</option>
                    {sections.map((item) => (
                      <option key={item.section_id} value={item.section_id} className="bg-slate-900 text-white">
                        {item.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Classe */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Classe *
                  </label>
                  <select
                    name="classe_id"
                    value={formData.classe_id}
                    onChange={handleChange}
                    required
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-white">Sélectionner</option>
                    {classes.map((item) => (
                      <option key={item.classe_id} value={item.classe_id} className="bg-slate-900 text-white">
                        {item.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parallèle */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Parallèle *
                  </label>
                  <select
                    name="parallele_id"
                    value={formData.parallele_id}
                    onChange={handleChange}
                    required
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-white">Sélectionner</option>
                    {paralleles.map((item) => (
                      <option key={item.parallele_id} value={item.parallele_id} className="bg-slate-900 text-white">
                        {item.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Année scolaire */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Année scolaire *
                  </label>
                  <input
                    type="text"
                    name="annee_scolaire"
                    placeholder="2026-2027"
                    value={formData.annee_scolaire}
                    onChange={handleChange}
                    required
                    className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50"></div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Enregistrer l'inscription</span>
                    </>
                  )}
                </div>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
