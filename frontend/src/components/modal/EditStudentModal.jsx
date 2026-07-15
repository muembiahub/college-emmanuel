import { X, Save, User, Users, GraduationCap, FileText } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditStudentModal({
  open,
  student,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState("eleve");

  const [sections, setSections] = useState([]);
const [options, setOptions] = useState([]);
const [classes, setClasses] = useState([]);
const [paralleles, setParalleles] = useState([]);


  useEffect(() => {
  async function loadSections() {
    try {
      const response = await fetch("/dashboard/sections");
      const data = await response.json();

      setSections(data);
    } catch (error) {
      console.error("Erreur sections :", error);
    }
  }

  loadSections();
}, []);


useEffect(() => {
  if (!form.section_id) {
    setOptions([]);
    return;
  }

  async function loadOptions() {
    try {
      const response = await fetch(
        `/dashboard/options?section_id=${form.section_id}`
      );

      const data = await response.json();

      setOptions(data);
    } catch (error) {
      console.error("Erreur options :", error);
    }
  }

  loadOptions();
}, [form.section_id]);


useEffect(() => {
  if (!form.option_id) {
    setClasses([]);
    return;
  }

  async function loadClasses() {
    try {
      const response = await fetch(
        `/dashboard/classes?option_id=${form.option_id}`
      );

      const data = await response.json();

      setClasses(data);
    } catch (error) {
      console.error("Erreur classes :", error);
    }
  }

  loadClasses();
}, [form.option_id]);

useEffect(() => {
  if (!form.classe_id) {
    setParalleles([]);
    return;
  }

  async function loadParalleles() {
    try {
      const response = await fetch(
        `/dashboard/paralleles?classe_id=${form.classe_id}`
      );

      const data = await response.json();

      setParalleles(data);
    } catch (error) {
      console.error("Erreur parallèles :", error);
    }
  }

  loadParalleles();
}, [form.classe_id]);



 useEffect(() => {
  if (student) {
    setForm(student);
  }
}, [student]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Reconstruct nested data for onSave if necessary
    const updatedStudent = {
      ...form,
      parent_data: {
        nom_pere: form.nom_pere,
        numero_telephone_du_pere: form.numero_telephone_du_pere,
        fonction_du_pere: form.fonction_du_pere,
        nom_mere: form.nom_mere,
        numero_telephone_de_la_mere: form.numero_telephone_de_la_mere,
        fonction_de_la_mere: form.fonction_de_la_mere,
        numero_whatsapp: form.numero_whatsapp,
      },
      inscription_data: {
        niveau_id: form.niveau_id,
        section_id: form.section_id,
        option_id: form.option_id,
        classe_id: form.classe_id,
        parallele_id: form.parallele_id,
        statut: form.statut,
        date_inscription: form.date_inscription,
      }
    };
    onSave(form);
  }

  const tabs = [
    { id: "eleve", label: "Élève", icon: User },
    { id: "parents", label: "Parents", icon: Users },
    { id: "inscription", label: "Inscription", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-indigo-900/50 w-full max-w-5xl border border-slate-700/50 transform scale-95 animate-in zoom-in-95 duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/70 px-6 py-4 bg-slate-800/60 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Modifier une inscription
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Mettre à jour les informations de l'élève et de son inscription.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-700/70 bg-slate-800/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 text-sm font-medium
                ${activeTab === tab.id
                  ? "text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-400 hover:text-white hover:border-b-2 hover:border-slate-600"
                }
                transition-all duration-200
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 text-white"
        >
          {activeTab === "eleve" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Matricule</label>
                <input type="text" name="matricule" value={form.matricule || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <input type="text" name="nom" value={form.nom || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Post-nom</label>
                <input type="text" name="post_nom" value={form.post_nom || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prénom</label>
                <input type="text" name="prenom" value={form.prenom || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sexe</label>
                <select name="sexe" value={form.sexe || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200 appearance-none">
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date de naissance</label>
                <input type="date" name="date_naissance" value={form.date_naissance ? new Date(form.date_naissance).toISOString().split('T')[0] : ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Lieu de naissance</label>
                <input type="text" name="lieu_naissance" value={form.lieu_naissance || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nationalité</label>
                <input type="text" name="nationalite" value={form.nationalite || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
                <input type="text" name="telephone" value={form.telephone || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
            </div>
          )}

          {activeTab === "parents" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom du Père</label>
                <input type="text" name="nom_pere" value={form.nom_pere || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone du Père</label>
                <input type="text" name="numero_telephone_du_pere" value={form.numero_telephone_du_pere || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fonction du Père</label>
                <input type="text" name="fonction_du_pere" value={form.fonction_du_pere || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom de la Mère</label>
                <input type="text" name="nom_mere" value={form.nom_mere || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone de la Mère</label>
                <input type="text" name="numero_telephone_de_la_mere" value={form.numero_telephone_de_la_mere || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fonction de la Mère</label>
                <input type="text" name="fonction_de_la_mere" value={form.fonction_de_la_mere || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Numéro WhatsApp</label>
                <input type="text" name="numero_whatsapp" value={form.numero_whatsapp || ""} onChange={handleChange} className="w-full rounded-lg bg-slate-700/50 border border-slate-600 focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200" />
              </div>
            </div>
          )}

          {activeTab === "inscription" && (
  <div className="grid md:grid-cols-2 gap-5">

    {/* Section */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Section
      </label>

      <select
        name="section_id"
        value={form.section_id || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      >
        <option value="">Sélectionner une section</option>

        {sections.map((section) => (
          <option
            key={section.section_id}
            value={section.section_id}
          >
            {section.nom_section}
          </option>
        ))}
      </select>
    </div>

    {/* Option */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Option
      </label>

      <select
        name="option_id"
        value={form.option_id || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      >
        <option value="">Sélectionner une option</option>

        {options.map((option) => (
          <option
            key={option.option_id}
            value={option.option_id}
          >
            {option.nom_option}
          </option>
        ))}
      </select>
    </div>

    {/* Classe */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Classe
      </label>

      <select
        name="classe_id"
        value={form.classe_id || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      >
        <option value="">Sélectionner une classe</option>

        {classes.map((classe) => (
          <option
            key={classe.classe_id}
            value={classe.classe_id}
          >
            {classe.nom_classe}
          </option>
        ))}
      </select>
    </div>

    {/* Parallèle */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Parallèle
      </label>

      <select
        name="parallele_id"
        value={form.parallele_id || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      >
        <option value="">Sélectionner un parallèle</option>

        {paralleles.map((parallele) => (
          <option
            key={parallele.parallele_id}
            value={parallele.parallele_id}
          >
            {parallele.nom_parallele}
          </option>
        ))}
      </select>
    </div>

    {/* Année scolaire */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Année scolaire
      </label>

      <input
        type="text"
        name="annee_scolaire"
        value={form.annee_scolaire || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      />
    </div>

    {/* Type inscription */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Type d'inscription
      </label>

      <select
        name="type_inscription"
        value={form.type_inscription || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      >
        <option value="Nouvelle">
          Nouvelle inscription
        </option>

        <option value="Réinscription">
          Réinscription
        </option>

        <option value="Transfert">
          Transfert
        </option>
      </select>
    </div>

    {/* Statut */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Statut
      </label>

      <select
        name="statut_inscription"
        value={form.statut_inscription || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      >
        <option value="Active">
          Active
        </option>

        <option value="Suspendue">
          Suspendue
        </option>

        <option value="Terminée">
          Terminée
        </option>
      </select>
    </div>

    {/* Montant payé */}

    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Montant payé
      </label>

      <input
        type="number"
        name="montant_paye"
        value={form.montant_paye || 0}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white"
      />
    </div>

    {/* Observations */}

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Observations
      </label>

      <textarea
        rows={4}
        name="observations"
        value={form.observations || ""}
        onChange={handleChange}
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white resize-none"
      />
    </div>

  </div>
)}

          {activeTab === "documents" && (
            <div className="p-4 text-slate-400">
              <p>Section pour la gestion des documents de l'élève (certificats, bulletins, etc.).</p>
              <p className="mt-2">*Implémentation future : Ajout de champs pour uploader et visualiser les documents.*</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-700/70 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md shadow-indigo-500/30"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
