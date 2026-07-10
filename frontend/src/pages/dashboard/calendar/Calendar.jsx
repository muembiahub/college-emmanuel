import { Calendar } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Calendrier</h1>
            <p className="text-sm text-slate-500">Vue globale des événements et examens.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
