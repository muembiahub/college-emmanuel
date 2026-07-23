import React from "react";
import FormSelect from "./FormSelect";
import { BookOpen } from "lucide-react";

export default function SchoolStep({
  formData,
  handleChange,
  sections = [],
  options = [],
  classes = [],
  paralleles = [],
  annees = [],
}) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-100">
      
      <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          Informations scolaires
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section */}
          <FormSelect
            label="Section"
            name="section_id"
            value={formData.section_id}
            onChange={handleChange}
            required
            placeholder="Choisir une section"
            options={sections.map((section) => ({
              id: section.section_id,
              label: section.nom_section,
            }))}
          />

          {/* Option */}
          <FormSelect
            label="Option"
            name="option_id"
            value={formData.option_id}
            onChange={handleChange}
            required
            disabled={!formData.section_id}
            placeholder={
              formData.section_id
                ? "Choisir une option"
                : "Sélectionnez d'abord une section"
            }
            options={options.map((option) => ({
              id: option.option_id,
              label: option.nom_option,
            }))}
          />

          {/* Classe */}
          <FormSelect
            label="Classe"
            name="classe_id"
            value={formData.classe_id}
            onChange={handleChange}
            required
            disabled={!formData.option_id}
            placeholder={
              formData.option_id
                ? "Choisir une classe"
                : "Sélectionnez d'abord une option"
            }
            options={classes.map((classe) => ({
              id: classe.classe_id,
              label: classe.nom_classe,
            }))}
          />

          {/* Parallèle */}
          <FormSelect
            label="Parallèle"
            name="parallele_id"
            value={formData.parallele_id}
            onChange={handleChange}
            required
            disabled={!formData.classe_id}
            placeholder={
              formData.classe_id
                ? "Choisir un parallèle"
                : "Sélectionnez d'abord une classe"
            }
            options={paralleles.map((parallele) => ({
              id: parallele.parallele_id,
              label: parallele.nom_parallele,
            }))}
          />

          {/* Année scolaire */}
          <div className="md:col-span-2">
            <FormSelect
              label="Année scolaire"
              name="annee_id"
              value={formData.annee_id}
              onChange={handleChange}
              required
              placeholder="Choisir une année scolaire"
              options={annees.map((annee) => ({
                id: annee.annee_id,
                label: annee.libelle,
              }))}
            />
          </div>

        </div>
      </div>

    </div>
  );
}