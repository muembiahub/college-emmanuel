import { X, Save, User, Users, GraduationCap, FileText, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

// A small helper component for loading/error state of dropdowns
const FieldState = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="flex items-center text-xs text-slate-400">
        <Loader2 className="animate-spin w-4 h-4 mr-2" />
        Chargement...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center text-xs text-red-400">
        <AlertCircle className="w-4 h-4 mr-2" />
        {error}
        <button onClick={onRetry} className="ml-2 font-bold underline hover:text-red-300">
          Réessayer
        </button>
      </div>
    );
  }
  return null;
};

export default function EditStudentModal({ open, student, onClose, onSave }) {
  const [form, setForm] = useState({});
  const [activeTab, setActiveTab] = useState("eleve");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [sections, setSections] = useState([]);
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [paralleles, setParalleles] = useState([]);
  const [annees, setAnnees] = useState([]);

  const [loadingStates, setLoadingStates] = useState({
    sections: false, options: false, classes: false, paralleles: false, annees: false,
  });
  const [errorStates, setErrorStates] = useState({
    sections: null, options: null, classes: null, paralleles: null, annees: null,
  });

  const loadData = useCallback(async (key, url, setter) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    setErrorStates(prev => ({ ...prev, [key]: null }));
    try {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error("Réponse du réseau incorrecte.");
      const result = await response.json();

const list = Array.isArray(result)
  ? result
  : Array.isArray(result.data)
    ? result.data
    : [];

setter(list);
    } catch (error) {
      console.error(`Erreur ${key} :`, error);
      setErrorStates(prev => ({ ...prev, [key]: "Échec du chargement" }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const loadSections = useCallback(() => loadData('sections', "/dashboard/sections", setSections), [loadData]);
  const loadAnnees = useCallback(() => loadData('annees', "/finance/annees", setAnnees), [loadData]);

  useEffect(() => {
    if (open) {
      setForm(student || {});
      setActiveTab("eleve");
      setIsSaving(false);
      setErrors({});
      setErrorStates({ sections: null, options: null, classes: null, paralleles: null, annees: null });
      
      loadSections();
      loadAnnees();
    }
  }, [open, student, loadSections, loadAnnees]);

  useEffect(() => {
    if (form.section_id) {
      loadData('options', `/dashboard/options?section_id=${form.section_id}`, setOptions);
    } else {
      setOptions([]);
    }
  }, [form.section_id, loadData]);

  useEffect(() => {
    if (form.option_id) {
      loadData('classes', `/dashboard/classes?option_id=${form.option_id}`, setClasses);
    } else {
      setClasses([]);
    }
  }, [form.option_id, loadData]);

  useEffect(() => {
    if (form.classe_id) {
      loadData('paralleles', `/dashboard/paralleles?classe_id=${form.classe_id}`, setParalleles);
    } else {
      setParalleles([]);
    }
  }, [form.classe_id, loadData]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const newState = { ...prev, [name]: value };
      if (errors[name]) {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }

      // Réinitialiser les listes dépendantes
      if (name === 'section_id') {
        newState.option_id = '';
        newState.classe_id = '';
        newState.parallele_id = '';
      } else if (name === 'option_id') {
        newState.classe_id = '';
        newState.parallele_id = '';
      } else if (name === 'classe_id') {
        newState.parallele_id = '';
      }
      return newState;
    });
  }

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom) newErrors.nom = "Le nom est obligatoire.";
    if (!form.prenom) newErrors.prenom = "Le prénom est obligatoire.";
    if (!form.section_id) newErrors.section_id = "La section est obligatoire.";
    if (!form.classe_id) newErrors.classe_id = "La classe est obligatoire.";
    if (!form.annee_id) newErrors.annee_id = "L'année scolaire est obligatoire.";
    return newErrors;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Switch to the tab with the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      if (['nom', 'prenom'].includes(firstErrorKey)) setActiveTab('eleve');
      if (['section_id', 'classe_id', 'annee_id'].includes(firstErrorKey)) setActiveTab('inscription');
      return;
    }

    setIsSaving(true);
    
    // Clean payload for saving
    const payload = { ...form };
    
    try {
      await onSave(payload);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setErrors({ submit: "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer." });
    } finally {
      setIsSaving(false);
    }
  }

  const tabs = [
    { id: "eleve", label: "Élève", icon: User },
    { id: "parents", label: "Parents", icon: Users },
    { id: "inscription", label: "Inscription", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const getInputClassName = (fieldName) =>
    `w-full rounded-lg bg-slate-700/50 border ${
      errors[fieldName] ? 'border-red-500' : 'border-slate-600'
    } focus:border-indigo-500 focus:ring-indigo-500 p-3 text-white placeholder-slate-500 transition-all duration-200`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-indigo-900/50 w-full max-w-5xl border border-slate-700/50 transform scale-95 animate-in zoom-in-95 duration-300 ease-out">
        <div className="flex items-center justify-between border-b border-slate-700/70 px-6 py-4 bg-slate-800/60 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Modifier une inscription</h2>
            <p className="text-slate-400 text-sm mt-1">Mettre à jour les informations de l'élève et de son inscription.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200">
            <X size={22} />
          </button>
        </div>

        <div className="flex border-b border-slate-700/70 bg-slate-800/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-indigo-400 border-b-2 border-indigo-500"
                  : "text-slate-400 hover:text-white hover:border-b-2 hover:border-slate-600"
              } transition-all duration-200`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-white max-h-[70vh] overflow-y-auto">
          {activeTab === "eleve" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Matricule</label>
                <input type="text" name="matricule" value={form.matricule || ""} onChange={handleChange} className={getInputClassName('matricule')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <input type="text" name="nom" value={form.nom || ""} onChange={handleChange} className={getInputClassName('nom')} />
                {errors.nom && <p className="text-red-400 text-xs mt-1.5">{errors.nom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Post-nom</label>
                <input type="text" name="post_nom" value={form.post_nom || ""} onChange={handleChange} className={getInputClassName('post_nom')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prénom</label>
                <input type="text" name="prenom" value={form.prenom || ""} onChange={handleChange} className={getInputClassName('prenom')} />
                {errors.prenom && <p className="text-red-400 text-xs mt-1.5">{errors.prenom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sexe</label>
                <select name="sexe" value={form.sexe || ""} onChange={handleChange} className={`${getInputClassName('sexe')} appearance-none`}>
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date de naissance</label>
                <input type="date" name="date_naissance" value={form.date_naissance ? new Date(form.date_naissance).toISOString().split('T')[0] : ""} onChange={handleChange} className={getInputClassName('date_naissance')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Lieu de naissance</label>
                <input type="text" name="lieu_naissance" value={form.lieu_naissance || ""} onChange={handleChange} className={getInputClassName('lieu_naissance')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nationalité</label>
                <input type="text" name="nationalite" value={form.nationalite || ""} onChange={handleChange} className={getInputClassName('nationalite')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
                <input type="text" name="telephone" value={form.telephone || ""} onChange={handleChange} className={getInputClassName('telephone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" name="email" value={form.email || ""} onChange={handleChange} className={getInputClassName('email')} />
              </div>
            </div>
          )}

          {activeTab === "parents" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom du Père</label>
                <input type="text" name="nom_pere" value={form.nom_pere || ""} onChange={handleChange} className={getInputClassName('nom_pere')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone du Père</label>
                <input type="text" name="numero_telephone_du_pere" value={form.numero_telephone_du_pere || ""} onChange={handleChange} className={getInputClassName('numero_telephone_du_pere')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fonction du Père</label>
                <input type="text" name="fonction_du_pere" value={form.fonction_du_pere || ""} onChange={handleChange} className={getInputClassName('fonction_du_pere')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom de la Mère</label>
                <input type="text" name="nom_mere" value={form.nom_mere || ""} onChange={handleChange} className={getInputClassName('nom_mere')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone de la Mère</label>
                <input type="text" name="numero_telephone_de_la_mere" value={form.numero_telephone_de_la_mere || ""} onChange={handleChange} className={getInputClassName('numero_telephone_de_la_mere')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Fonction de la Mère</label>
                <input type="text" name="fonction_de_la_mere" value={form.fonction_de_la_mere || ""} onChange={handleChange} className={getInputClassName('fonction_de_la_mere')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Numéro WhatsApp</label>
                <input type="text" name="numero_whatsapp" value={form.numero_whatsapp || ""} onChange={handleChange} className={getInputClassName('numero_whatsapp')} />
              </div>
            </div>
          )}

          {activeTab === "inscription" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Section</label>
                <select name="section_id" value={form.section_id || ""} onChange={handleChange} className={`${getInputClassName('section_id')} appearance-none`} disabled={loadingStates.sections}>
                  <option value="">Sélectionner une section</option>
                  {sections.map((section) => (
                    <option key={section.section_id} value={section.section_id}>{section.nom_section}</option>
                  ))}
                </select>
                <FieldState loading={loadingStates.sections} error={errorStates.sections} onRetry={loadSections} />
                {errors.section_id && <p className="text-red-400 text-xs mt-1.5">{errors.section_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Option</label>
                <select name="option_id" value={form.option_id || ""} onChange={handleChange} className={`${getInputClassName('option_id')} appearance-none`} disabled={!form.section_id || loadingStates.options}>
                  <option value="">Sélectionner une option</option>
                  {options.map((option) => (
                    <option key={option.option_id} value={option.option_id}>{option.nom_option}</option>
                  ))}
                </select>
                 <FieldState loading={loadingStates.options} error={errorStates.options} onRetry={() => loadData('options', `/dashboard/options?section_id=${form.section_id}`, setOptions)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Classe</label>
                <select name="classe_id" value={form.classe_id || ""} onChange={handleChange} className={`${getInputClassName('classe_id')} appearance-none`} disabled={!form.option_id || loadingStates.classes}>
                  <option value="">Sélectionner une classe</option>
                  {classes.map((classe) => (
                    <option key={classe.classe_id} value={classe.classe_id}>{classe.nom_classe}</option>
                  ))}
                </select>
                <FieldState loading={loadingStates.classes} error={errorStates.classes} onRetry={() => loadData('classes', `/dashboard/classes?option_id=${form.option_id}`, setClasses)} />
                {errors.classe_id && <p className="text-red-400 text-xs mt-1.5">{errors.classe_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Parallèle</label>
                <select name="parallele_id" value={form.parallele_id || ""} onChange={handleChange} className={`${getInputClassName('parallele_id')} appearance-none`} disabled={!form.classe_id || loadingStates.paralleles}>
                  <option value="">Sélectionner un parallèle</option>
                  {paralleles.map((parallele) => (
                    <option key={parallele.parallele_id} value={parallele.parallele_id}>{parallele.nom_parallele}</option>
                  ))}
                </select>
                <FieldState loading={loadingStates.paralleles} error={errorStates.paralleles} onRetry={() => loadData('paralleles', `/dashboard/paralleles?classe_id=${form.classe_id}`, setParalleles)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Année scolaire</label>
                <select name="annee_id" value={form.annee_id || ""} onChange={handleChange} className={`${getInputClassName('annee_id')} appearance-none`} disabled={loadingStates.annees}>
                    <option value="">Sélectionner une année</option>
                    {annees.map((annee) => (
                        <option key={annee.annee_id} value={annee.annee_id}>{annee.libelle}</option>
                    ))}
                </select>
                <FieldState loading={loadingStates.annees} error={errorStates.annees} onRetry={loadAnnees} />
                {errors.annee_id && <p className="text-red-400 text-xs mt-1.5">{errors.annee_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type d'inscription</label>
                <select name="type_inscription" value={form.type_inscription || ""} onChange={handleChange} className={`${getInputClassName('type_inscription')} appearance-none`}>
                  <option value="Nouvelle">Nouvelle inscription</option>
                  <option value="Réinscription">Réinscription</option>
                  <option value="Transfert">Transfert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
                <select name="statut_inscription" value={form.statut_inscription || ""} onChange={handleChange} className={`${getInputClassName('statut_inscription')} appearance-none`}>
                  <option value="Active">Active</option>
                  <option value="Suspendue">Suspendue</option>
                  <option value="Terminée">Terminée</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Montant payé</label>
                <input type="number" name="montant_paye" value={form.montant_paye || 0} onChange={handleChange} className={getInputClassName('montant_paye')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Observations</label>
                <textarea rows={4} name="observations" value={form.observations || ""} onChange={handleChange} className={`${getInputClassName('observations')} resize-none`} />
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="p-4 text-slate-400">
              <p>Section pour la gestion des documents de l'élève (certificats, bulletins, etc.).</p>
              <p className="mt-2">*Implémentation future : Ajout de champs pour uploader et visualiser les documents.*</p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-700/70 pt-5">
            {errors.submit && <p className="text-red-400 text-sm mr-auto flex items-center"><AlertCircle className="w-5 h-5 mr-2"/>{errors.submit}</p>}
            <button type="button" onClick={onClose} className="px-5 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 transition-colors duration-200 disabled:opacity-50" disabled={isSaving}>
              Annuler
            </button>
            <button type="submit" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md shadow-indigo-500/30 disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={isSaving}>
              {isSaving ? <><Loader2 className="animate-spin" size={18} /> Enregistrement...</> : <><Save size={18} /> Enregistrer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
