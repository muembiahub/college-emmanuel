import React from "react";
import { ShieldCheck, ShieldAlert, Clock } from "lucide-react";

const statutInfo = {
  Payé: { icon: ShieldCheck, colorClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", label: "Payé" },
  Partiel: { icon: Clock, colorClass: "bg-amber-500/10 text-amber-300 border-amber-500/20", label: "Acompte" },
  Impayé: { icon: ShieldAlert, colorClass: "bg-red-500/10 text-red-300 border-red-500/20", label: "Impayé" },
};

export default function StatutBadge({ statut }) {
  const info = statutInfo[statut];
  if (!info) return null;

  const Icon = info.icon;

  return (
    <span className={`mx-auto flex w-max items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${info.colorClass}`}>
      <Icon size={12} />
      <span>{info.label}</span>
    </span>
  );
}
