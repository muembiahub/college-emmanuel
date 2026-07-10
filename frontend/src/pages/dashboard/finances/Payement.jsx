import { CreditCard } from "lucide-react";

export default function Payement() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Paiement</h1>
            <p className="text-sm text-slate-500">Traitement et suivi des paiements.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
