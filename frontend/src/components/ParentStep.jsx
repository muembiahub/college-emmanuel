import React from "react";
import FormInput from "./FormInput";

export default function ParentStep({ formData, handleChange }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-100">

      {/* Père */}
      <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold tracking-tight text-indigo-400 mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
          Informations du père
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nom complet du père"
            name="nom_pere"
            value={formData.nom_pere}
            onChange={handleChange}
            required
            placeholder="Nom complet du père"
          />

          <FormInput
            label="Téléphone du père"
            name="numero_telephone_du_pere"
            type="tel"
            value={formData.numero_telephone_du_pere}
            onChange={handleChange}
            required
            placeholder="+243 XXX XXX XXX"
          />

          <FormInput
            label="Profession du père"
            name="fonction_du_pere"
            value={formData.fonction_du_pere}
            onChange={handleChange}
            placeholder="Profession"
          />
        </div>
      </div>

      {/* Mère */}
      <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold tracking-tight text-pink-400 mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50"></span>
          Informations de la mère
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nom complet de la mère"
            name="nom_mere"
            value={formData.nom_mere}
            onChange={handleChange}
            required
            placeholder="Nom complet de la mère"
          />

          <FormInput
            label="Téléphone de la mère"
            name="numero_telephone_de_la_mere"
            type="tel"
            value={formData.numero_telephone_de_la_mere}
            onChange={handleChange}
            required
            placeholder="+243 XXX XXX XXX"
          />

          <FormInput
            label="Profession de la mère"
            name="fonction_de_la_mere"
            value={formData.fonction_de_la_mere}
            onChange={handleChange}
            placeholder="Profession"
          />
        </div>
      </div>

      {/* Coordonnées du parent */}
      <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-lg shadow-slate-400/50"></span>
          Coordonnées du parent / tuteur
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormInput
            label="Adresse e-mail"
            name="email_parent"
            type="email"
            value={formData.email_parent}
            onChange={handleChange}
            placeholder="contact@famille.com"
          />

          <FormInput
            label="Numéro WhatsApp"
            name="numero_whatsapp"
            type="tel"
            value={formData.numero_whatsapp}
            onChange={handleChange}
            required
            placeholder="+243 XXX XXX XXX"
          />

          <FormInput
            label="Profession du parent / tuteur"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Profession"
          />

          <div className="md:col-span-2">
            <FormInput
              label="Adresse complète"
              name="adresse_parent"
              value={formData.adresse_parent}
              onChange={handleChange}
              placeholder="Adresse complète du parent ou tuteur"
            />
          </div>

        </div>
      </div>

    </div>
  );
}