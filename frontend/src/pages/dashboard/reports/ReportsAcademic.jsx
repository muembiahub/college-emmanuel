import { GraduationCap } from "lucide-react";

export default function ReportsAcademic() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Rapports académiques</h1>
            <p className="text-sm text-slate-500">Rapports par classe, matière et période.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
