import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import FraisModal from '../../../components/modal/FraisModal';

// Services API isolés
const API_URL = '/finance/frais';

const callCreateFrais = async (payload) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
};

const callUpdateFrais = async (id, payload) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
};

const callDeleteFrais = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return await response.json();
};

export default function GestionFraisScolaires() {
  const [annees, setAnnees] = useState([]);
  const [sections, setSections] = useState([]);
  const [typesFrais, setTypesFrais] = useState([]);
  const [listeFrais, setListeFrais] = useState([]);

  // États pour les critères de filtrage par liste déroulante / select
  const [filterTypeFrais, setFilterTypeFrais] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterClasse, setFilterClasse] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [filterPeriode, setFilterPeriode] = useState('');
  const [filterCible, setFilterCible] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);

  const chargerDonneesInitiales = async () => {
    try {
      const [resFrais, resAnnee, resSection, resType] = await Promise.all([
        fetch(API_URL).catch(() => ({ ok: false })),
        fetch('/finance/annees').catch(() => ({ ok: false })),
        fetch('/dashboard/sections').catch(() => ({ ok: false })),
        fetch('/finance/types-frais').catch(() => ({ ok: false }))
      ]);

      if (resFrais.ok) {
        const jsonFrais = await resFrais.json();
        setListeFrais(jsonFrais.data || []);
      }
      if (resAnnee.ok) setAnnees((await resAnnee.json()).data || []);
      if (resSection.ok) setSections((await resSection.json()).data || []);
      if (resType.ok) setTypesFrais((await resType.json()).data || []);

    } catch (error) {
      console.error("Erreur de chargement initial :", error);
    }
  };

  useEffect(() => {
    chargerDonneesInitiales();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload, id) => {
    try {
      let result;
      if (id) {
        result = await callUpdateFrais(id, payload);
      } else {
        result = await callCreateFrais(payload);
      }

      if (result.success) {
        setMessage({ text: result.message || "Opération réussie !", type: 'success' });
        setIsModalOpen(false);
        chargerDonneesInitiales();
      } else {
        setMessage({ text: `Erreur : ${result.message || "Opération échouée"}`, type: 'error' });
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage({ text: "Erreur de connexion au serveur.", type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce frais ?")) return;

    try {
      const result = await callDeleteFrais(id);

      if (result.success) {
        setMessage({ text: "Frais supprimé avec succès !", type: 'success' });
        setListeFrais(prev => prev.filter(f => f.frais_id !== id));
      } else {
        setMessage({ text: result.message || "Erreur lors de la suppression.", type: 'error' });
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage({ text: "Erreur de connexion au serveur.", type: 'error' });
    }
  };

  // Extraction dynamique des options uniques pour les filtres à partir des données existantes
  const uniqueTypesFrais = [...new Set(listeFrais.map(item => item.type_frais_nom || item.type_frais_id))].filter(Boolean);
  const uniqueSections = [...new Set(listeFrais.map(item => item.section_nom))].filter(Boolean);
  const uniqueClasses = [...new Set(listeFrais.map(item => item.classe_nom))].filter(Boolean);
  const uniqueOptions = [...new Set(listeFrais.map(item => item.option_nom))].filter(Boolean);
  const uniquePeriodes = [...new Set(listeFrais.map(item => item.periode))].filter(Boolean);
  const uniqueCibles = [...new Set(listeFrais.map(item => item.sexe))].filter(Boolean);

  // Filtrage par sélection exacte (Filtrage)
  const filteredFrais = listeFrais.filter((item) => {
    const typeFraisVal = item.type_frais_nom || item.type_frais_id || '';
    const sectionVal = item.section_nom || '';
    const classeVal = item.classe_nom || '';
    const optionVal = item.option_nom || '';
    const periodeVal = item.periode || '';
    const cibleVal = item.sexe || '';

    if (filterTypeFrais && typeFraisVal !== filterTypeFrais) return false;
    if (filterSection && sectionVal !== filterSection) return false;
    if (filterClasse && classeVal !== filterClasse) return false;
    if (filterOption && optionVal !== filterOption) return false;
    if (filterPeriode && periodeVal !== filterPeriode) return false;
    if (filterCible && cibleVal !== filterCible) return false;

    return true;
  });

  const handleResetFilters = () => {
    setFilterTypeFrais('');
    setFilterSection('');
    setFilterClasse('');
    setFilterOption('');
    setFilterPeriode('');
    setFilterCible('');
  };

  return (
    <div className="max-w-[1200px] mx-auto my-8 p-6 font-sans bg-[#34587B] rounded-xl shadow-lg">
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        
        {/* En-tête avec titre et bouton de création */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-gray-800 text-lg font-semibold">📋 Liste des Frais Configurés</h3>
          <button 
            onClick={handleOpenCreate} 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-md font-bold text-sm cursor-pointer shadow transition-colors">
            ➕ Configurer un Frais
          </button>
        </div>

        {/* Panneau de Filtrage par listes déroulantes */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Filtrer par critères</h4>
            {(filterTypeFrais || filterSection || filterClasse || filterOption || filterPeriode || filterCible) && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:underline font-semibold"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Filtre Type de Frais */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Frais</label>
              <select
                value={filterTypeFrais}
                onChange={(e) => setFilterTypeFrais(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#428DD9]"
              >
                <option value="">Tous les frais</option>
                {uniqueTypesFrais.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Filtre Section */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Section</label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#428DD9]"
              >
                <option value="">Toutes sections</option>
                {uniqueSections.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Filtre Classe */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Classe</label>
              <select
                value={filterClasse}
                onChange={(e) => setFilterClasse(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#428DD9]"
              >
                <option value="">Toutes classes</option>
                {uniqueClasses.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Filtre Option */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Option</label>
              <select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#428DD9]"
              >
                <option value="">Toutes options</option>
                {uniqueOptions.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Filtre Période */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Période</label>
              <select
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#428DD9]"
              >
                <option value="">Toutes périodes</option>
                {uniquePeriodes.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Filtre Cible */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cible</label>
              <select
                value={filterCible}
                onChange={(e) => setFilterCible(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#428DD9]"
              >
                <option value="">Toutes cibles</option>
                {uniqueCibles.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-md mb-5 text-center font-medium ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#428DD9] text-white">
                <th className="p-3">Type de Frais</th>
                <th className="p-3">Section</th>
                <th className="p-3">Classe / Option</th>
                <th className="p-3">Montant</th>
                <th className="p-3">Période</th>
                <th className="p-3">Cible</th>
                <th className="p-3">Statut</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFrais.length > 0 ? (
                filteredFrais.map((item) => (
                  <tr key={item.frais_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">{item.type_frais_nom || item.type_frais_id}</td>
                    <td className="p-3 text-gray-600">{item.section_nom || "Toutes sections"}</td>
                    <td className="p-3 text-gray-600">
                      {item.classe_nom || "Toutes classes"} {item.option_nom ? `(${item.option_nom})` : ''}
                    </td>
                    <td className="p-3 font-bold text-gray-800">{Number(item.montant).toLocaleString()}</td>
                    <td className="p-3 capitalize text-gray-600">{item.periode}</td>
                    <td className="p-3 text-gray-600">{item.sexe}</td>
                    <td className="p-3">
                      <span className={`p-1 px-2 rounded text-xs font-semibold ${item.actif ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-500'}`}>
                        {item.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleOpenEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white border-none py-1.5 px-3 rounded cursor-pointer font-semibold text-xs transition-colors">
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(item.frais_id)} className="bg-red-500 hover:bg-red-600 text-white border-none py-1.5 px-3 rounded cursor-pointer font-semibold text-xs transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400 p-8">
                    {listeFrais.length === 0 ? "Aucun frais enregistré pour le moment." : "Aucun résultat trouvé pour ces critères de filtre."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FraisModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingItem={editingItem}
        annees={annees}
        sections={sections}
        typesFrais={typesFrais}
      />

    </div>
  );
}