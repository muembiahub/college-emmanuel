import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export default function SchoolStep({
  formData,
  handleChange,
  sections,
  options,
  classes,
  paralleles,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
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
            id: parallele.parallele_id, // ⚠️ UUID obligatoire
            label: parallele.nom_parallele,
          }))}
        />

        {/* Année scolaire */}
        <FormInput
          label="Année scolaire"
          name="annee_scolaire"
          value={formData.annee_scolaire}
          onChange={handleChange}
          required
          placeholder="Ex: 2026-2027"
        />
      </div>
    </div>
  );
}
