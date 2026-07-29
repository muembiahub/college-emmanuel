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
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOptions = async () => {
      try {
        const response = await fetch("/options", {
          signal: controller.signal,
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("L'API n'a pas renvoyé du JSON valide.");
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setOptions(data);
          console.log("Options chargées avec succès :", data);
        } else if (data.success && Array.isArray(data.options)) {
          setOptions(data.options);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erreur lors du chargement des options :", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
    return () => controller.abort();
  }, []);

  return (
    <div className="relative min-h-screen bg-blue-50/50 text-slate-900 overflow-hidden space-y-20 pb-20">
      
      {/* Filigrane de l'image de fond */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-30 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url('https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/rdc-arms.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL3JkYy1hcm1zLndlYnAiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1MzI1NDE5LCJleHAiOjE4MTY4NjE0MTl9.tMtqDGfNAsmCz1d2QmtHBE5Vc0rztBf8kL6B9HUenjg')` }}
      />

      {/* HERO SECTION */}
      <section className="relative h-[650px] overflow-hidden rounded-[40px] max-w-7xl mx-auto mt-8 shadow-xl border border-white/50">
        <img
          src="https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/image_lubumbashi.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2ltYWdlX2x1YnVtYmFzaGkuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NTMyNTMyMCwiZXhwIjoxODE2ODYxMzIwfQ.P-ixpQaCoY3YK6UA6tsLUNqDqoLBH36oqwLwKRFq5_Y"
          className="absolute inset-0 h-full w-full object-cover filter brightness-90"
          alt="Collège Emmanuel Lubumbashi"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/70 to-transparent" />

        <div className="relative z-10 flex h-full items-center">
          <div className="max-w-3xl px-12">
            <span className="inline-block rounded-full bg-yellow-400 px-5 py-2 font-bold text-blue-950 shadow-md">
              🎓 Bienvenue au Collège Emmanuel
            </span>

            <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white drop-shadow-md">
              Une éducation de qualité
              <br />
              <span className="text-yellow-300">pour préparer votre avenir.</span>
            </h1>

            <p className="mt-6 text-xl text-blue-100 font-medium drop-shadow-sm">
              Depuis plusieurs années, le Collège Emmanuel accompagne
              les élèves vers l'excellence académique, morale et professionnelle.
            </p>

            <div className="mt-10 flex gap-5">
              <Link
                to="/programmes"
                className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-blue-950 hover:bg-yellow-300 shadow-lg transition"
              >
                Découvrir nos filières
              </Link>
              <Link
                to="/contact"
                className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white hover:text-blue-900 transition"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI CHOISIR LE COLLÈGE EMMANUEL */}
      <section className="relative py-20 max-w-7xl mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-5 py-2 shadow-sm ring-1 ring-yellow-200">
              <MdStar className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-semibold uppercase tracking-wide text-yellow-800">
                Pourquoi choisir le Collège Emmanuel ?
              </span>
            </div>
          </div>

          <h2 className="mt-8 text-4xl font-extrabold leading-tight text-blue-950 md:text-5xl">
            Une école d'excellence
            <span className="block text-yellow-600">
              au service de votre avenir
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Le <strong>Collège Emmanuel</strong> forme des élèves responsables,
            compétents et ambitieux grâce à un enseignement de qualité, un
            encadrement rigoureux et un environnement propice à la réussite.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: "school", title: "Enseignement de qualité", desc: "Des enseignants qualifiés accompagnent chaque élève vers l'excellence académique." },
            { icon: "workspace_premium", title: "Discipline & Valeurs", desc: "Nous développons le respect, la responsabilité et le sens du travail bien fait." },
            { icon: "menu_book", title: "Bibliothèque moderne", desc: "Des ressources pédagogiques variées pour favoriser l'apprentissage et la recherche." },
            { icon: "sports_soccer", title: "Vie scolaire", desc: "Sports, culture, clubs et activités favorisent l'épanouissement des élèves." },
          ].map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:border-yellow-300 hover:shadow-lg">
              <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-900 to-yellow-500 scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-900 shadow-sm transition group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-blue-950">
                <span className="material-symbols-outlined flex items-center justify-center text-4xl leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48" }}>
                  {item.icon}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{item.desc}</p>
              <button className="mt-8 flex items-center gap-2 font-semibold text-blue-900 transition group-hover:text-yellow-600">
                En savoir plus
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* NOS CHIFFRES */}
      <section className="rounded-[40px] bg-blue-950 py-16 text-white mx-6 shadow-2xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto px-6">
          {[
            { value: "500+", title: "Élèves" },
            { value: "40+", title: "Enseignants" },
            { value: "10+", title: "Options" },
            { value: "95%", title: "Réussite" },
          ].map((item, index) => (
            <div key={index} className="text-center">
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

      {/* OPTIONS DYNAMIQUES AVEC IMAGE DE FOND */}
      <section id="Filieres" className="rounded-[2.5rem] bg-white p-8 lg:p-12 shadow-xl max-w-7xl mx-auto border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Nos Options</h2>
            <p className="text-slate-500">Explorez les programmes académiques</p>
          </div>
          <span className="text-sm font-semibold text-blue-900 bg-blue-50 border border-blue-100 px-6 py-3 rounded-full">
            {loading ? "Chargement..." : `${options.length} options`}
          </span>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <Skeleton height={250} count={3} />
          ) : options.length === 0 ? (
            <p className="text-slate-500">Aucune option trouvée.</p>
          ) : (
            options.map((opt) => (
              <div key={opt.option_id} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg hover:shadow-2xl transition duration-300">
                {/* Image de fond de l'école sur chaque carte */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent" />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-blue-950 font-bold text-xs px-3 py-1 rounded-full shadow">
                    Code : {opt.code}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{opt.nom_option}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-500 text-sm">Formation reconnue et encadrée par le Collège Emmanuel.</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
        <div className="hidden sm:block opacity-0 scale-95 translate-x-2 bg-white text-slate-900 text-xs font-medium px-4 py-2 rounded-2xl shadow-xl transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 whitespace-nowrap border border-slate-100">
          Besoin d’aide ? Contactez le Collège Emmanuel !
        </div>
        <a
          href="https://wa.me/243971211539"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl transition hover:scale-110 active:scale-95 animate-bounce"
          title="Discuter sur WhatsApp"
        >
          <FaWhatsapp className="h-9 w-9" />
        </a>
      </div>

    </div>
  );
}