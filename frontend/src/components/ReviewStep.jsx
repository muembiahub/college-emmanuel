import React from "react";
import { User, Users, BookOpen } from "lucide-react";

export default function ReviewStep({
  formData,
  sections = [],
  options = [],
  classes = [],
  paralleles = [],
}) {
  const getLabel = (list, id, idKey, labelKey) => {
    if (!Array.isArray(list) || !id) return "Non spécifié";

    const item = list.find(
      (element) => String(element[idKey]) === String(id)
    );

    return item ? item[labelKey] : "Non spécifié";
  };

  const SummarySection = ({ title, icon: Icon, children }) => (
    <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <h4 className="text-xl font-bold tracking-tight text-white">
          {title}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  const DataItem = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">
        {label}
      </p>

      <p className="text-white font-semibold text-base">
        {value || "—"}
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-slate-100">

      {/* ============================
          Informations Élève
      ============================ */}

      <SummarySection
        title="Informations de l'élève"
        icon={User}
      >
        <DataItem
          label="Nom complet"
          value={`${formData.nom || ""} ${formData.post_nom || ""} ${formData.prenom || ""}`}
        />

        <DataItem
          label="Sexe"
          value={formData.sexe}
        />

        <DataItem
          label="Date de naissance"
          value={formData.date_naissance}
        />

        <DataItem
          label="Lieu de naissance"
          value={formData.lieu_naissance}
        />

        <DataItem
          label="Nationalité"
          value={formData.nationalite}
        />

        <DataItem
          label="Téléphone"
          value={formData.telephone}
        />

        <DataItem
          label="Email"
          value={formData.email}
        />

        <DataItem
          label="Adresse de l'élève"
          value={formData.eleve_adresse}
        />
      </SummarySection>

      {/* ============================
          Parents
      ============================ */}

      <SummarySection
        title="Informations Parentales"
        icon={Users}
      >
        <DataItem
          label="Nom du père"
          value={formData.nom_pere}
        />

        <DataItem
          label="Téléphone du père"
          value={formData.numero_telephone_du_pere}
        />

        <DataItem
          label="Profession du père"
          value={formData.fonction_du_pere}
        />

        <DataItem
          label="Nom de la mère"
          value={formData.nom_mere}
        />

        <DataItem
          label="Téléphone de la mère"
          value={formData.numero_telephone_de_la_mere}
        />

        <DataItem
          label="Profession de la mère"
          value={formData.fonction_de_la_mere}
        />

        <DataItem
          label="WhatsApp"
          value={formData.numero_whatsapp}
        />
      </SummarySection>

      {/* ============================
          Scolarité
      ============================ */}

      <SummarySection
        title="Informations scolaires"
        icon={BookOpen}
      >
        <DataItem
          label="Section"
          value={getLabel(
            sections,
            formData.section_id,
            "section_id",
            "nom_section"
          )}
        />

        <DataItem
          label="Option"
          value={getLabel(
            options,
            formData.option_id,
            "option_id",
            "nom_option"
          )}
        />

        <DataItem
          label="Classe"
          value={getLabel(
            classes,
            formData.classe_id,
            "classe_id",
            "nom_classe"
          )}
        />

        <DataItem
          label="Parallèle"
          value={getLabel(
            paralleles,
            formData.parallele_id,
            "parallele_id",
            "nom_parallele"
          )}
        />

        <DataItem
          label="Année scolaire"
          value={formData.annee_scolaire}
        />
      </SummarySection>

    </div>
  );
}