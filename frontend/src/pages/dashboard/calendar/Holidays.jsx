import { Sun } from "lucide-react";

export default function Holidays() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-3 text-amber-600">
            <Sun size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Jours fériés</h1>
            <p className="text-sm text-slate-500">Calendrier des jours fériés et vacances.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
