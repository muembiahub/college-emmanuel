import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function FraisModal({ isOpen, onClose, onSubmit, editingItem, annees, typesFrais }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  // Listes déroulantes en cascade
  const [sections, setSections] = useState([]);
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);

  // 1. Charger toutes les sections au démarrage
  useEffect(() => {
    async function loadSections() {
      try {
        const response = await fetch("/dashboard/sections");
        const data = await response.json();
        setSections(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Erreur sections :", error);
      }
    }
    loadSections();
  }, []);

  // 2. Initialisation du formulaire (Création vs Édition)
  useEffect(() => {
    if (editingItem) {
      setForm({
        ...editingItem,
        annee_id: editingItem.annee_id ? String(editingItem.annee_id) : '',
        section_id: editingItem.section_id ? String(editingItem.section_id) : '',
        option_id: editingItem.option_id ? String(editingItem.option_id) : '',
        classe_id: editingItem.classe_id ? String(editingItem.classe_id) : '',
        type_frais_id: editingItem.type_frais_id ? String(editingItem.type_frais_id) : '',
        periode: editingItem.periode || 'annuel',
        sexe: editingItem.sexe || 'Tous',
        actif: editingItem.actif ?? true,
      });
    } else {
      setForm({
        periode: 'annuel',
        sexe: 'Tous',
        actif: true,
        montant: ''
      });
      setOptions([]);
      setClasses([]);
    }
  }, [editingItem, isOpen]);

  // 3. Charger les options en fonction de la section
  useEffect(() => {
    if (!form.section_id) {
      setOptions([]);
      return;
    }
    async function loadOptions() {
      try {
        const response = await fetch(`/dashboard/options?section_id=${form.section_id}`);
        const data = await response.json();
        setOptions(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Erreur options :", error);
      }
    }
    loadOptions();
  }, [form.section_id]);

  // 4. Charger les classes en fonction de l'option
  useEffect(() => {
    if (!form.option_id) {
      setClasses([]);
      return;
    }
    async function loadClasses() {
      try {
        const response = await fetch(`/dashboard/classes?option_id=${form.option_id}`);
        const data = await response.json();
        setClasses(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Erreur classes :", error);
      }
    }
    loadClasses();
  }, [form.option_id]);

//   load type_frais 
  useEffect(() => {
    async function loadTypesFrais() {
      try {
        const response = await fetch("/finance/types-frais");
        const data = await response.json();
        setTypesFrais(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Erreur types de frais :", error);
      }
    }
    loadTypesFrais();
  })

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Si on change l'année, on bloque et réinitialise tout le reste en cascade
      if (name === 'annee_id' && !value) {
        updated.section_id = '';
        updated.option_id = '';
        updated.classe_id = '';
        setOptions([]);
        setClasses([]);
      }

      // Réinitialisation en cascade standard
      if (name === 'section_id') {
        updated.option_id = '';
        updated.classe_id = '';
        setOptions([]);
        setClasses([]);
      }
      if (name === 'option_id') {
        updated.classe_id = '';
        setClasses([]);
      }

      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      annee_id: form.annee_id || null,
      section_id: form.section_id || null,
      option_id: form.option_id || null,
      classe_id: form.classe_id || null,
      type_frais_id: form.type_frais_id || null,
      montant: parseFloat(form.montant) || 0,
      periode: form.periode || 'annuel',
      sexe: form.sexe || 'Tous',
      actif: form.actif ?? true
    };

    await onSubmit(payload, editingItem ? editingItem.frais_id : null);
    setLoading(false);
  }

  // Détermine si les champs dépendants doivent être bloqués
  const isAnneeSelected = Boolean(form.annee_id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-indigo-900/50 w-full max-w-3xl border border-slate-700/50">
        
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between border-b border-slate-700/70 px-6 py-4 bg-slate-800/60 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editingItem ? "✏️ Modifier le Frais Scolaire" : "➕ Configurer un Frais Scolaire"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Gérez les montants par section, option, classe et période.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-white max-h-[75vh] overflow-y-auto">
          <div className="grid md:grid-cols-3 gap-5">
            
            {/* Année Scolaire */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Année Scolaire</label>
              <select 
                name="annee_id" 
                value={form.annee_id || ""} 
                onChange={handleChange} 
                required 
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Choisir --</option>
                {annees?.map(a => (
                  <option key={a.annee_id} value={String(a.annee_id)}>
                    {a.libelle}
                  </option>
                ))}
              </select>
            </div>

            {/* Section (Bloqué si Année non sélectionnée) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Section</label>
              <select 
                name="section_id" 
                value={form.section_id || ""} 
                onChange={handleChange} 
                required 
                disabled={!isAnneeSelected}
                className={`w-full rounded-lg border p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none ${
                  !isAnneeSelected 
                    ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed opacity-60' 
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <option value="">{isAnneeSelected ? "-- Choisir --" : "🔒 Choisissez l'année d'abord"}</option>
                {sections?.map(s => (
                  <option key={s.section_id} value={String(s.section_id)}>
                    {s.nom_section}
                  </option>
                ))}
              </select>
            </div>

            {/* Option (Bloqué si Section non sélectionnée) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Option</label>
              <select 
                name="option_id" 
                value={form.option_id || ""} 
                onChange={handleChange} 
                disabled={!form.section_id}
                className={`w-full rounded-lg border p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none ${
                  !form.section_id 
                    ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed opacity-60' 
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <option value="">{form.section_id ? "-- Aucune / Toutes --" : "🔒 Choisissez la section"}</option>
                {options.map(o => (
                  <option key={o.option_id} value={String(o.option_id)}>
                    {o.nom_option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            
            {/* Classe (Bloqué si Option non sélectionnée) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Classe</label>
              <select 
                name="classe_id" 
                value={form.classe_id || ""} 
                onChange={handleChange} 
                disabled={!form.option_id && options.length > 0}
                className={`w-full rounded-lg border p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none ${
                  (!form.option_id && options.length > 0)
                    ? 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed opacity-60' 
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <option value="">{form.option_id ? "-- Aucune / Toutes --" : "🔒 Choisissez l'option"}</option>
                {classes.map(c => (
                  <option key={c.classe_id} value={String(c.classe_id)}>
                    {c.nom_classe}
                  </option>
                ))}
              </select>
            </div>

            {/* Type de Frais */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type de Frais</label>
              <select 
                name="type_frais_id" 
                value={form.type_frais_id || ""} 
                onChange={handleChange} 
                required 
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Choisir --</option>
                {typesFrais?.map(tf => (
                  <option key={tf.type_frais_id} value={String(tf.type_frais_id)}>
                    {tf.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Montant</label>
              <input 
                type="number" 
                step="0.01" 
                name="montant" 
                placeholder="Ex: 45000" 
                value={form.montant || ""} 
                onChange={handleChange} 
                required 
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-center">
            
            {/* Période (Avec options globales et mois individuels) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Période / Mois</label>
              <select 
                name="periode" 
                value={form.periode || "annuel"} 
                onChange={handleChange} 
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="annuel">Annuel</option>
                 <optgroup label="Mois spécifiques">
                  <option value="Septembre">Septembre</option>
                  <option value="Octobre">Octobre</option>
                  <option value="Novembre">Novembre</option>
                  <option value="Décembre">Décembre</option>
                  <option value="Janvier">Janvier</option>
                  <option value="Février">Février</option>
                  <option value="Mars">Mars</option>
                  <option value="Avril">Avril</option>
                  <option value="Mai">Mai</option>
                  <option value="Juin">Juin</option>
                </optgroup>
              </select>
            </div>

            {/* Sexe */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sexe concerné</label>
              <select 
                name="sexe" 
                value={form.sexe || "Tous"} 
                onChange={handleChange} 
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Tous">Tous</option>
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            {/* Actif */}
            <div className="pt-6">
              <label className="flex items-center gap-3 cursor-pointer text-slate-300 font-medium">
                <input 
                  type="checkbox" 
                  name="actif" 
                  checked={form.actif ?? true} 
                  onChange={handleChange} 
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500" 
                />
                Frais Actif
              </label>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 border-t border-slate-700/70 pt-5">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30"
            >
              <Save size={18} />
              {loading ? "Traitement..." : "Enregistrer"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}