import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export default function StudentStep({ formData, handleChange }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-100">

      {/* ============================
          Informations personnelles
      ============================= */}
      <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
          Informations de l'élève
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <FormInput
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Nom de l'élève"
          />

          <FormInput
            label="Post-nom"
            name="post_nom"
            value={formData.post_nom}
            onChange={handleChange}
            required
            placeholder="Post-nom"
          />

          <FormInput
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            placeholder="Prénom"
          />

          <FormSelect
            label="Sexe"
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            required
            options={[
              { id: "Masculin", label: "Masculin" },
              { id: "Féminin", label: "Féminin" },
            ]}
          />

          <FormInput
            label="Date de naissance"
            name="date_naissance"
            type="date"
            value={formData.date_naissance}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Lieu de naissance"
            name="lieu_naissance"
            value={formData.lieu_naissance}
            onChange={handleChange}
            required
            placeholder="Ville ou territoire"
          />

          <FormInput
            label="Nationalité"
            name="nationalite"
            value={formData.nationalite}
            onChange={handleChange}
            required
            placeholder="Ex : Congolaise"
          />

        </div>
      </div>

      {/* ============================
          Coordonnées
      ============================= */}
      <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
          Coordonnées de l'élève
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormInput
            label="Téléphone"
            name="telephone"
            type="tel"
            value={formData.telephone}
            onChange={handleChange}
            required
            placeholder="+243 XXX XXX XXX"
          />

          <FormInput
            label="Adresse e-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
          />

          <div className="md:col-span-2">
            <FormInput
              label="Adresse de résidence"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              placeholder="Adresse complète de l'élève"
            />
          </div>

        </div>
      </div>

    </div>
  );
}