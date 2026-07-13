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
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <Icon className="w-5 h-5 text-indigo-400" />
        <h4 className="text-lg font-bold text-white">
          {title}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const DataItem = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="text-white font-medium">
        {value || "—"}
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

      {/* ============================
          Informations Élève
      ============================ */}

      <SummarySection
        title="Informations de l'élève"
        icon={User}
      >
        <DataItem
          label="Nom complet"
          value={`${formData.nom} ${formData.post_nom} ${formData.prenom}`}
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
          label="Adresse"
          value={formData.adresse}
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