import { SlidersHorizontal, CheckCircle2 } from "lucide-react";

export default function Options() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-3 text-amber-600">
            <SlidersHorizontal size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Options et services</h1>
            <p className="text-sm text-slate-500">Configuration des options proposées aux familles.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Options disponibles</h2>
        <ul className="mt-4 space-y-3">
          {[
            "Transport scolaire",
            "Cantine",
            "Activités extrascolaires",
            "Aide aux devoirs"
          ].map((option) => (
            <li key={option} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 size={16} className="text-emerald-500" />
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
