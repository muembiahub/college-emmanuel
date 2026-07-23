import React from "react";
import { User, Users, BookOpen, CheckCircle } from "lucide-react";

export default function Stepper({ currentStep }) {
  const steps = [
    { id: 1, label: "Élève", icon: User },
    { id: 2, label: "Parents", icon: Users },
    { id: 3, label: "Scolarité", icon: BookOpen },
    { id: 4, label: "Révision", icon: CheckCircle },
  ];

  return (
    <div className="px-6 md:px-12 py-6 border-b border-slate-800/80 bg-slate-950/20">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        
        {/* Barre de progression - fond */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2"></div>
        
        {/* Barre de progression - active */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 -translate-y-1/2 transition-all duration-500 ease-in-out shadow-lg shadow-indigo-500/50"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Étapes */}
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 shadow-xl
                  ${isActive
                    ? "bg-indigo-600 text-white shadow-indigo-500/40 scale-110 border border-indigo-400/30"
                    : isCompleted
                      ? "bg-emerald-600 text-white shadow-emerald-500/20 border border-emerald-400/30"
                      : "bg-slate-900/90 text-slate-300 border border-slate-700"}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`
                  absolute -bottom-8 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                  ${isActive ? "text-indigo-400" : isCompleted ? "text-emerald-400" : "text-slate-300"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}