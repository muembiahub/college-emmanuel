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
    <div className="px-8 md:px-12 py-6 border-b border-white/10">
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        
        {/* Barre de progression - fond */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2"></div>
        
        {/* Barre de progression - active */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 -translate-y-1/2 transition-all duration-500 ease-in-out"
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
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 z-10
                  ${isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-slate-800 text-gray-400 border border-white/10"}
                `}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`
                  absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-colors duration-300
                  ${isActive ? "text-indigo-400" : isCompleted ? "text-green-400" : "text-gray-500"}
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
