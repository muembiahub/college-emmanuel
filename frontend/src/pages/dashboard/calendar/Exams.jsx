import { FileText } from "lucide-react";

export default function Exams() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-100 p-3 text-violet-600">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Examens</h1>
            <p className="text-sm text-slate-500">Planification et résultats des examens.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
