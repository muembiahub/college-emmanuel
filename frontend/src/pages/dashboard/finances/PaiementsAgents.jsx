import { BadgeDollarSign, Users } from "lucide-react";

export default function PaiementsAgents() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-3 text-amber-600">
            <BadgeDollarSign size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Paiements agents</h1>
            <p className="text-sm text-slate-500">Suivi des rémunérations et versements internes.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Users size={18} className="text-indigo-500" />
          <h2 className="text-lg font-semibold">Équipe administrative</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Gestion des salaires, primes et échéanciers de paiement pour les agents.</p>
      </div>
    </div>
  );
}
