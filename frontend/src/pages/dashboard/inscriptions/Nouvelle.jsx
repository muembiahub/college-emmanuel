"use client";

import { useEffect, useState } from "react";
import {
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import Stepper from "../../../components/Stepper";
import StepNavigation from "../../../components/StepNavigation";
import StudentStep from "../../../components/StudentStep";
import ParentStep from "../../../components/ParentStep";
import SchoolStep from "../../../components/SchoolStep";
import ReviewStep from "../../../components/ReviewStep";

export default function Nouvelle() {
  const totalSteps = 4;

  const [currentStep, setCurrentStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* ==========================
      Structure scolaire
  ========================== */

  const [sections, setSections] = useState([]);
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [paralleles, setParalleles] = useState([]);
  const [annees, setAnnees] = useState([]);

  /* ==========================
      Formulaire
  ========================== */

  const initialForm = {
    nom: "",
    post_nom: "",
    prenom: "",
    sexe: "",
    date_naissance: "",
    lieu_naissance: "",
    nationalite: "Congolaise",
    telephone: "",
    email: "",
    adresse: "",

    nom_pere: "",
    numero_telephone_du_pere: "",
    fonction_du_pere: "",

    nom_mere: "",
    numero_telephone_de_la_mere: "",
    fonction_de_la_mere: "",

    numero_whatsapp: "",

    section_id: "",
    option_id: "",
    classe_id: "",
    parallele_id: "",

    annee_id: "",
  };

  const [formData, setFormData] = useState(initialForm);

  /* ==========================
      Charger les sections
  ========================== */

  useEffect(() => {
    loadSections();
    loadAnnees();
  }, []);

  async function loadSections() {
    try {
      const res = await fetch("/dashboard/sections");

      if (!res.ok) {
        throw new Error("Impossible de charger les sections.");
      }

      const data = await res.json();

      setSections(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }
/* ==========================================================
   CHARGEMENT DES OPTIONS
========================================================== */

async function loadOptions(sectionId) {
  if (!sectionId) {
    setOptions([]);
    return;
  }

  try {
    const res = await fetch(
      `/dashboard/options?section_id=${sectionId}`
    );

    if (!res.ok) {
      throw new Error("Impossible de charger les options.");
    }

    const data = await res.json();

    setOptions(data);
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
}



/* ==========================================================
   CHARGEMENT DES CLASSES
========================================================== */

async function loadClasses(optionId) {
  if (!optionId) {
    setClasses([]);
    return;
  }

  try {
    const res = await fetch(
      `/dashboard/classes?option_id=${optionId}`
    );

    if (!res.ok) {
      throw new Error("Impossible de charger les classes.");
    }

    const data = await res.json();

    setClasses(data);
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
}

/* ==========================================================
   CHARGEMENT DES PARALLELES
========================================================== */

async function loadParalleles(classeId) {
  if (!classeId) {
    setParalleles([]);
    return;
  }

  try {
    const res = await fetch(
      `/dashboard/paralleles?classe_id=${classeId}`
    );

    if (!res.ok) {
      throw new Error("Impossible de charger les parallèles.");
    }

    const data = await res.json();

    setParalleles(data);
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
}

/* ==========================================================
   GESTION DES CHANGEMENTS ANNEE SCOLAIRE
========================================================== */



async function loadAnnees() {
  try {
    setError(null);

    const res = await fetch("/finance/annees");

    const result = await res.json();
    if (!res.ok) {
      throw new Error(
        result.message || "Impossible de charger les années."
      );
    }

    if (!result.success) {
      throw new Error(
        result.message || "Erreur lors du chargement des années."
      );
    }

    setAnnees(result.data || []);

  } catch (err) {
    console.error("❌ Erreur loadAnnees :", err);
    setAnnees([]);
    setError(err.message);
  }
}



/* ==========================================================
   GESTION DES CHANGEMENTS
========================================================== */

async function handleChange(e) {
  const { name, value } = e.target;

  console.log("CHANGE :", name, value);

  setError(null);

  if (name === "section_id") {
    setFormData((prev) => ({
      ...prev,
      section_id: value,
      option_id: "",
      classe_id: "",
      parallele_id: "",
    }));

    setOptions([]);
    setClasses([]);
    setParalleles([]);

    await loadOptions(value);
    return;
  }

  if (name === "option_id") {
    setFormData((prev) => ({
      ...prev,
      option_id: value,
      classe_id: "",
      parallele_id: "",
    }));

    setClasses([]);
    setParalleles([]);

    await loadClasses(value);
    return;
  }

  if (name === "classe_id") {
    setFormData((prev) => ({
      ...prev,
      classe_id: value,
      parallele_id: "",
    }));

    setParalleles([]);

    await loadParalleles(value);
    return;
  }

  if (name === "parallele_id") {

    setFormData((prev) => ({
      ...prev,
      parallele_id: value,
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
}
const nextStep = () =>
  setCurrentStep((prev) => Math.min(prev + 1, totalSteps));

const prevStep = () =>
  setCurrentStep((prev) => Math.max(prev - 1, 1));



/* ==========================================================
   ENREGISTRER L'INSCRIPTION
========================================================== */

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    /* ==========================================
       Validation des champs obligatoires
    ========================================== */
    const requiredFields = [
      "nom", "post_nom", "prenom", "sexe", "date_naissance",
      "section_id", "classe_id", "parallele_id", "annee_id"
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        throw new Error(`Le champ "${field}" est obligatoire.`);
      }
    }

    /* ==========================================
       Élève
    ========================================== */
    const eleveData = {
      nom: formData.nom,
      post_nom: formData.post_nom,
      prenom: formData.prenom,
      sexe: formData.sexe,
      date_naissance: formData.date_naissance,
      lieu_naissance: formData.lieu_naissance,
      nationalite: formData.nationalite,
      telephone: formData.telephone,
      email: formData.email,
      adresse: formData.adresse,
    };

    /* ==========================================
       Parent
    ========================================== */
    const parentData = {
      nom_pere: formData.nom_pere,
      numero_telephone_du_pere: formData.numero_telephone_du_pere,
      fonction_du_pere: formData.fonction_du_pere,
      nom_mere: formData.nom_mere,
      numero_telephone_de_la_mere: formData.numero_telephone_de_la_mere,
      fonction_de_la_mere: formData.fonction_de_la_mere,
      numero_whatsapp: formData.numero_whatsapp,
      email: formData.email_parent || "",
      adresse: formData.adresse_parent || "",
      profession: formData.profession || "",
    };

    /* ==========================================
       Inscription
    ========================================== */
   const inscriptionData = {
  section_id: formData.section_id,
  option_id: formData.option_id ?? null,
  classe_id: formData.classe_id ?? null,
  parallele_id: formData.parallele_id ?? null,
  annee_id: formData.annee_id ?? null,
  numero_inscription: formData.numero_inscription || `INS-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  date_inscription: (formData.date_inscription && typeof formData.date_inscription === 'string' && formData.date_inscription.includes('T')) ?
  formData.date_inscription.split("T")[0] : new Date().toISOString().split("T")[0],
  statut: "Active",
  type_inscription: "Nouvelle"
};

    /* ==========================================
       Préparation du Payload pour le Backend
       (On fusionne tout à plat pour correspondre à req.body)
    ========================================== */
    const payloadComplet = {
      ...eleveData,
      ...parentData,
      ...inscriptionData
    };

    console.log("===== DONNÉES ENVOYÉES AU SERVER =====", payloadComplet);

    console.log(formData);
    const response = await fetch("/dashboard/inscription", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payloadComplet)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.message || "Erreur lors de l'inscription.");
    }

    
toast.success(result.message || "🎉 Élève inscrit avec succès !");

setTimeout(() => {
  navigate("/dashboard/students", {
    state: {
      refresh: true,
      message: "Élève inscrit avec succès."
    }
  });
}, 1200);

  } catch (err) {
    console.error("Erreur attrapée :", err);
    toast.error(err.message || "Une erreur est survenue.", {
      position: "top-right",
      autoClose: 5000,
      theme: "colored",
    });
  } finally {
    setLoading(false);
  }
}

/* ==========================================================
   ETAPES
========================================================== */

const renderStep = () => {
  switch (currentStep) {
    case 1:
      return <StudentStep formData={formData} handleChange={handleChange} />;
    case 2:
      return <ParentStep formData={formData} handleChange={handleChange} />;
    case 3:
      return (
        <SchoolStep
          formData={formData}
          handleChange={handleChange}
          sections={sections}
          options={options}
          classes={classes}
          paralleles={paralleles}
          annees={annees}
        />
      );
    case 4:
      return (
        <ReviewStep
          formData={formData}
          sections={sections}
          options={options}
          classes={classes}
          paralleles={paralleles}
          annees={annees}
        />
      );
    default:
      return null;
  }
};


/* ==========================================================
   RENDER
========================================================== */

return (
  <div className="min-h-screen  p-6 md:p-8">

    {/* Background */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-blob" />

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>

    <div className="relative max-w-6xl mx-auto">

      {/* Success */}

      {success && (
        <div className="mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">

            <CheckCircle className="w-6 h-6 text-green-400" />

            <p className="text-green-100">
              Élève inscrit avec succès.
            </p>

          </div>
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="mb-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">

            <AlertCircle className="w-6 h-6 text-red-400" />

            <p className="text-red-100">
              {error}
            </p>

          </div>
        </div>
      )}

      {/* Card */}

      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-10 py-8">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">

              <User className="w-6 h-6 text-white" />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-white">

                Nouvelle inscription

              </h1>

              <p className="text-indigo-100 mt-2">

                Étape {currentStep} sur {totalSteps}

              </p>

            </div>

          </div>

        </div>

        {/* Stepper */}

        <Stepper currentStep={currentStep} />

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-8 md:p-12"
        >

          {renderStep()}

          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrev={prevStep}
            onNext={nextStep}
            loading={loading}
            isLastStep={currentStep === totalSteps}
          />

        </form>

      </div>

    </div>

    <style jsx>{`
      @keyframes blob {
        0%,
        100% {
          transform: translate(0, 0) scale(1);
        }

        33% {
          transform: translate(30px, -50px) scale(1.1);
        }

        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
      }

      .animate-blob {
        animation: blob 7s infinite;
      }

      .animation-delay-2000 {
        animation-delay: 2s;
      }

      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `}</style>

  </div>
);
};