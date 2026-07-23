import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Loader } from "lucide-react";

export default function StepNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  loading,
  isLastStep,
}) {
  return (
    <div className="flex justify-between items-center pt-8 border-t border-slate-800/80 mt-10">
      
      {/* Bouton précédent */}
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1 || loading}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
          ${currentStep === 1
            ? "opacity-0 pointer-events-none"
            : "text-slate-200 hover:bg-slate-900/80 hover:text-white border border-slate-700/80 bg-slate-950/40"}
        `}
      >
        <ChevronLeft className="w-5 h-5" />
        Précédent
      </button>

      {/* Indicateur d'étape */}
      <div className="text-sm font-semibold text-slate-300">
        Étape <span className="text-white">{currentStep}</span> / {totalSteps}
      </div>

      {/* Bouton suivant ou confirmer */}
      <button
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : onNext}
        disabled={loading}
        className="group relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden shadow-xl"
      >
        {/* Fond animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 group-hover:shadow-lg group-hover:shadow-purple-500/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

        {/* Contenu du bouton */}
        <div className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Chargement...</span>
            </>
          ) : isLastStep ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Confirmer l'inscription</span>
            </>
          ) : (
            <>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                Suivant
              </span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </div>
      </button>
    </div>
  );
}