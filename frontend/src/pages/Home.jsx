import { useEffect, useState } from "react";
import {
  MdHome,
  MdSchool,
  MdGroups,
  MdInfo,
  MdCall,
  MdMenuBook,
  MdPerson,
  MdDashboard,
  MdLogin,
  MdLogout,
  MdSearch,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdEvent,
  MdPhotoLibrary,
  MdArticle,
  MdStar
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Home() {
    const [loading, setLoading] = useState(true);

  const [niveaux, setNiveaux] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchFilieres = async () => {
      try {
        const response = await fetch("/dashboard/niveaux", {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) {
          setNiveaux(data.niveaux);
        }
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilieres();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-12 relative min-h-screen">

      {/* HERO */}
      <section className="relative h-[650px] overflow-hidden rounded-[40px]">

  <img
    src="/images/ecole.jpg"
    className="absolute inset-0 h-full w-full object-cover"
    alt=""
  />

  <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-transparent" />

  <div className="relative z-10 flex h-full items-center">

    <div className="max-w-3xl px-12">

      <span className="rounded-full bg-yellow-500 px-5 py-2 font-semibold text-blue-950">
        🎓 Bienvenue au Collège Emmanuel
      </span>

      <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white">
        Une éducation de qualité
        <br />
        pour préparer votre avenir.
      </h1>

      <p className="mt-6 text-xl text-blue-100">
        Depuis plusieurs années, le Collège Emmanuel accompagne
        les élèves vers l'excellence académique, morale et professionnelle.
      </p>

      <div className="mt-10 flex gap-5">

        <Link
          to="/programmes"
          className="rounded-full bg-yellow-500 px-8 py-4 font-bold text-blue-950 hover:bg-yellow-400"
        >
          Découvrir nos filières
        </Link>

        <Link
          to="/contact"
          className="rounded-full border border-white px-8 py-4 font-semibold text-white hover:bg-white hover:text-blue-900"
        >
          Nous contacter
        </Link>

      </div>

    </div>

  </div>

</section>

      {/* POURQUOI CHOISIR LE COLLÈGE EMMANUEL */}

{/* POURQUOI CHOISIR LE COLLÈGE EMMANUEL */}

<section className="relative py-20">

  {/* Fond décoratif */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white" />

  <div className="mx-auto max-w-7xl px-6">

    {/* Titre */}

  <div className="mx-auto max-w-3xl text-center">

  {/* Badge */}
  <div className="flex justify-center">
    <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-5 py-2 shadow-sm ring-1 ring-yellow-200">

      <MdStar className="h-5 w-5 text-yellow-500" />

      <span className="text-sm font-semibold uppercase tracking-wide text-yellow-700">
        Pourquoi choisir le Collège Emmanuel ?
      </span>

    </div>
  </div>

  {/* Titre */}
  <h2 className="mt-8 text-4xl font-extrabold leading-tight text-blue-550 md:text-5xl">
    Une école d'excellence
    <span className="block text-yellow-200">
      au service de votre avenir
    </span>
  </h2>

  {/* Description */}
  <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
    Le <strong>Collège Emmanuel</strong> forme des élèves responsables,
    compétents et ambitieux grâce à un enseignement de qualité, un
    encadrement rigoureux et un environnement propice à la réussite
    académique, humaine et spirituelle.
  </p>

</div>

    {/* Cartes */}

    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      {[
        {
          icon: "school",
          title: "Enseignement de qualité",
          desc: "Des enseignants qualifiés accompagnent chaque élève vers l'excellence académique.",
        },
        {
          icon: "workspace_premium",
          title: "Discipline & Valeurs",
          desc: "Nous développons le respect, la responsabilité et le sens du travail bien fait.",
        },
        {
          icon: "menu_book",
          title: "Bibliothèque moderne",
          desc: "Des ressources pédagogiques variées pour favoriser l'apprentissage et la recherche.",
        },
        {
          icon: "sports_soccer",
          title: "Vie scolaire",
          desc: "Sports, culture, clubs et activités favorisent l'épanouissement des élèves.",
        },
      ].map((item, index) => (

        <div
          key={index}
          className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-2xl"
        >

          {/* Bande décorative */}
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-900 to-yellow-500 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

          {/* Icône */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-900 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-white">
  <span
    className="material-symbols-outlined flex items-center justify-center text-4xl leading-none"
    style={{
      fontVariationSettings:
        "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48",
    }}
  >
    {item.icon}
  </span>
</div>

          {/* Contenu */}

          <h3 className="mt-8 text-2xl font-bold text-slate-900">
            {item.title}
          </h3>

          <p className="mt-4 leading-7 text-slate-600">
            {item.desc}
          </p>

          {/* Lien */}

          <button className="mt-8 flex items-center gap-2 font-semibold text-blue-900 transition group-hover:text-yellow-600">
            En savoir plus
          </button>

        </div>

      ))}

    </div>

  </div>

</section>

{/* NOS CHIFFRES */}

<section className="rounded-[40px] bg-blue-950 py-16 text-white">

  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

    {[
      {
        value: "500+",
        title: "Élèves",
      },
      {
        value: "40+",
        title: "Enseignants",
      },
      {
        value: "15+",
        title: "Filières",
      },
      {
        value: "95%",
        title: "Réussite",
      },
    ].map((item, index) => (

      <div
        key={index}
        className="text-center"
      >

        <h3 className="text-5xl font-extrabold text-yellow-400">
          {item.value}
        </h3>

        <p className="mt-3 text-lg text-blue-100">
          {item.title}
        </p>

      </div>

    ))}

  </div>

</section>

      {/* FILIÈRES */}
      <section id="Filieres" className="rounded-[2.5rem] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Nos Filières</h2>
            <p className="text-sm text-slate-500">Explorez les programmes académiques</p>
          </div>
          <span className="text-sm text-slate-500">
            {loading ? "Chargement..." : `${niveaux.length} filières`}
          </span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <Skeleton height={200} count={3} />
          ) : niveaux.length === 0 ? (
            <p className="text-slate-500">Aucune filière trouvée.</p>
          ) : (
            niveaux.map((filiere) => (
              <div key={filiere.filiere_id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition">
                <div className="h-44 overflow-hidden ">
                  <img src={filiere.logo} alt={filiere.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{filiere.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{filiere.description}</p>
                  <Link to={`/categories/${filiere.filiere_id}/services`} className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition">
                    Voir plus
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* BOUTON FLOTTANT WHATSAPP */}
<div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">

  <div className="hidden sm:block opacity-0 scale-95 translate-x-2 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-2xl shadow-xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 whitespace-nowrap border border-slate-800">
    Besoin d’aide ? Contactez le Collège Emmanuel !
  </div>


  <a
    href="https://wa.me/243971211539"
    target="_blank"
    rel="noopener noreferrer"
    className="
      flex h-16 w-16 items-center justify-center
      rounded-full bg-green-500
      text-white shadow-2xl
      transition-all duration-300
      hover:scale-110 hover:bg-green-600
      active:scale-95
      animate-bounce
    "
    title="Discuter sur WhatsApp"
  >
    <FaWhatsapp className="h-9 w-9" />
  </a>

</div>

    </div>
  );
}

