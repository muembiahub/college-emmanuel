import { BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Rapports</h1>
            <p className="text-sm text-slate-500">Regroupe les rapports académiques et statistiques.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
