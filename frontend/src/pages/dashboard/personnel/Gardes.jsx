import { Shield, BellRing } from "lucide-react";

export default function Gardes() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-rose-100 p-3 text-rose-600">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Gardes</h1>
            <p className="text-sm text-slate-500">Planification et suivi des agents de garde.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <BellRing size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold">Planning de sécurité</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Horaires de garde, alertes et coordination du service de sécurité.</p>
      </div>
    </div>
  );
}
