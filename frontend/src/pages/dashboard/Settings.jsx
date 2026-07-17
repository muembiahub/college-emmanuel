import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full  p-3 text-slate-700">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Paramètres</h1>
          <p className="text-sm text-slate-500">Configuration du tableau de bord et de l’établissement.</p>
        </div>
      </div>
    </div>
  );
}
