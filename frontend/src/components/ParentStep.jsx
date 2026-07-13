import React from "react";
import FormInput from "./FormInput";

export default function ParentStep({ formData, handleChange }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Informations des parents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Père */}
        <div className="space-y-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-lg font-bold text-indigo-400">Informations du Père</h4>
          <FormInput
            label="Nom du père"
            name="nom_pere"
            value={formData.nom_pere}
            onChange={handleChange}
            required
            placeholder="Nom complet"
          />
          <FormInput
            label="Téléphone du père"
            name="numero_telephone_du_pere"
            type="tel"
            value={formData.numero_telephone_du_pere}
            onChange={handleChange}
            required
            placeholder="+243..."
          />
          <FormInput
            label="Fonction du père"
            name="fonction_du_pere"
            value={formData.fonction_du_pere}
            onChange={handleChange}
            placeholder="Profession"
          />
        </div>

        {/* Mère */}
        <div className="space-y-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-lg font-bold text-purple-400">Informations de la Mère</h4>
          <FormInput
            label="Nom de la mère"
            name="nom_mere"
            value={formData.nom_mere}
            onChange={handleChange}
            required
            placeholder="Nom complet"
          />
          <FormInput
            label="Téléphone de la mère"
            name="numero_telephone_de_la_mere"
            type="tel"
            value={formData.numero_telephone_de_la_mere}
            onChange={handleChange}
            required
            placeholder="+243..."
          />
          <FormInput
            label="Fonction de la mère"
            name="fonction_de_la_mere"
            value={formData.fonction_de_la_mere}
            onChange={handleChange}
            placeholder="Profession"
          />
        </div>
      </div>

      {/* Contact d'urgence */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <FormInput
          label="Numéro WhatsApp (Urgence)"
          name="numero_whatsapp"
          type="tel"
          value={formData.numero_whatsapp}
          onChange={handleChange}
          required
          placeholder="+243..."
        />
      </div>
    </div>
  );
}
