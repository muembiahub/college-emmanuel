import React, { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  History, 
  ArrowRightCircle, 
  School, 
  AlertCircle,
  Save,
  User,
  Calendar
} from 'lucide-react';

const Reinscription = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Simulation de données (À remplacer par votre appel API)
  const studentsMock = [
    { 
      id: "1", 
      name: "Jean-Paul Mukendi", 
      oldClass: "3ème Primaire A", 
      status: "Admis", 
      year: "2025-2026",
      matricule: "CE-2025-001"
    }
  ];

  const handleSearch = () => {
    // Simuler une recherche
    setSelectedStudent(studentsMock[0]);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ArrowRightCircle className="text-indigo-600" />
          Réinscription Annuelle
        </h1>
        <p className="text-slate-500 text-sm">Réinscrivez les élèves admis pour l'année scolaire 2026-2027.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne de Gauche : Recherche et Profil */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Barre de Recherche */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-3 text-pro">Rechercher l'élève</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Nom ou Matricule..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="w-full mt-4 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Trouver l'élève
            </button>
          </div>

          {/* Profil trouvé */}
          {selectedStudent && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                  <User size={40} />
                </div>
                <h2 className="font-bold text-lg text-slate-900">{selectedStudent.name}</h2>
                <span className="text-xs font-mono text-slate-400">{selectedStudent.matricule}</span>
                
                <div className="mt-6 w-full space-y-3">
                    <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-slate-500">Ancienne classe :</span>
                        <span className="font-semibold text-slate-700">{selectedStudent.oldClass}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-slate-500">Année écoulée :</span>
                        <span className="font-semibold text-slate-700">{selectedStudent.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Résultat :</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            {selectedStudent.status}
                        </span>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne de Droite : Formulaire de Réinscription */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="h-full min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                <History size={48} className="mb-4 opacity-20" />
                <p>Veuillez rechercher et sélectionner un élève pour commencer la réinscription.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="text-indigo-600" size={20} />
                  Détails de la réinscription
                </h3>
              </div>

              <div className="p-8 space-y-8">
                {/* Section Académique */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nouvelle Année Scolaire</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl text-slate-600 border border-slate-200">
                      <Calendar size={18} />
                      <span className="font-semibold text-pro">2026 - 2027</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-pro">Nouvelle Classe</label>
                    <select className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option>Sélectionner la classe...</option>
                      <option>4ème Primaire A</option>
                      <option>4ème Primaire B</option>
                    </select>
                  </div>
                </div>

                {/* Section Frais Scolaires */}
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h4 className="text-indigo-900 font-bold text-sm mb-4 flex items-center gap-2">
                        <School size={16} /> Frais de réinscription
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-indigo-700/70">Frais de fonctionnement :</span>
                            <span className="font-bold text-indigo-900">15 000 FC</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-indigo-700/70">Acompte Mensualité (Septembre) :</span>
                            <span className="font-bold text-indigo-900">35 000 FC</span>
                        </div>
                        <div className="pt-3 border-t border-indigo-200 flex justify-between">
                            <span className="font-bold text-indigo-900">Total à payer :</span>
                            <span className="text-lg font-black text-indigo-600">50 000 FC</span>
                        </div>
                    </div>
                </div>

                {/* Note d'information */}
                <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <p className="text-xs text-amber-800 leading-relaxed">
                        Assurez-vous que l'élève a apuré tous les frais de l'année précédente avant de valider la réinscription. Cette action générera automatiquement un reçu de paiement.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-all">
                        Annuler
                    </button>
                    <button className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                        <Save size={18} />
                        Confirmer la Réinscription
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reinscription;