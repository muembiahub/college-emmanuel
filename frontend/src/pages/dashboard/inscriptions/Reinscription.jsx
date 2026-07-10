import { Repeat } from "lucide-react";

export default function Reinscription() {
  return (
    <div className="relative z-10 space-y-6">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
            <Repeat size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Réinscriptions</h1>
            <p className="text-sm text-slate-500">Gérez les réinscriptions et renouvellements de dossiers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
