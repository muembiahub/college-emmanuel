import { DollarSign, FileText } from "lucide-react";

export default function Depenses() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-rose-100 p-3 text-rose-600">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Dépenses</h1>
            <p className="text-sm text-slate-500">Suivi et catégorisation des dépenses.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
