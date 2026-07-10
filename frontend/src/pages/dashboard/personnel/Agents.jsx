import { Briefcase, ShieldCheck } from "lucide-react";

export default function Agents() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-sky-100 p-3 text-sky-600">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Agents</h1>
            <p className="text-sm text-slate-500">Administration du personnel de soutien.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck size={18} className="text-violet-500" />
          <h2 className="text-lg font-semibold">Rôle et responsabilités</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Suivi des missions administratives, logistiques et de sécurité.</p>
      </div>
    </div>
  );
}
