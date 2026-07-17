import { MonitorUp, Archive } from "lucide-react";

export default function Bureaux() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full  p-3 text-slate-700">
            <MonitorUp size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Bureaux</h1>
            <p className="text-sm text-slate-500">Suivi des bureaux administratifs et de leur utilisation.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Archive size={18} className="text-sky-500" />
          <h2 className="text-lg font-semibold">Équipement des bureaux</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Inventaire du mobilier, ordinateurs et fournitures de bureau.</p>
      </div>
    </div>
  );
}
