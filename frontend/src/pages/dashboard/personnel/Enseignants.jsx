import { GraduationCap, BookOpenCheck } from "lucide-react";

export default function Enseignants() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Enseignants</h1>
            <p className="text-sm text-slate-500">Gestion du personnel enseignant et des affectations.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <BookOpenCheck size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold">Disponibilité pédagogique</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Suivi des emplois du temps, des matières et des absences du personnel.</p>
      </div>
    </div>
  );
}
