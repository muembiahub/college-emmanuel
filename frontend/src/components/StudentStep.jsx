import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export default function StudentStep({ formData, handleChange }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Identité */}
        <FormInput
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          placeholder="Entrez le nom"
        />
        <FormInput
          label="Post-nom"
          name="post_nom"
          value={formData.post_nom}
          onChange={handleChange}
          required
          placeholder="Entrez le post-nom"
        />
        <FormInput
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          required
          placeholder="Entrez le prénom"
        />

        {/* Sexe */}
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

        {/* Naissance */}
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
          placeholder="Ville/Région"
        />
        <FormInput
          label="Nationalité"
          name="nationalite"
          value={formData.nationalite}
          onChange={handleChange}
          required
          placeholder="Ex: Congolaise"
        />

        {/* Contact */}
        <FormInput
          label="Téléphone"
          name="telephone"
          type="tel"
          value={formData.telephone}
          onChange={handleChange}
          required
          placeholder="+243..."
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemple@email.com"
        />
      </div>

      {/* Adresse */}
      <div className="grid grid-cols-1 gap-6">
        <FormInput
          label="Adresse"
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          required
          placeholder="Adresse complète"
        />
      </div>
    </div>
  );
}
