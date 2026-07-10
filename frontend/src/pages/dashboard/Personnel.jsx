import { Users } from "lucide-react";

export default function Personnel() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Personnel</h1>
            <p className="text-sm text-slate-500">Vue d'ensemble du personnel de l'établissement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
