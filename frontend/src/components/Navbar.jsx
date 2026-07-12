import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
import { useAuth } from "../hooks/UseAuth";

const navigation = [
  {
    label: "Accueil",
    path: "/",
    icon: MdHome,
  },
  {
    label: "Section",
    path: "/programmes",
    icon: MdSchool,
  },
];

export default function Navbar() {
  const { user, logout, role, isPrivileged, loading } = useAuth();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="h-14 w-14 rounded-full bg-slate-200 animate-pulse" />

              <div>
                <div className="h-5 w-44 rounded bg-slate-200 animate-pulse mb-2" />
                <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
              </div>

            </div>

            <div className="hidden lg:flex gap-6">

              <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />

            </div>

            <div className="h-10 w-32 rounded-full bg-slate-200 animate-pulse" />

          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Barre supérieure */}

      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-sm text-white border-b border-yellow-500/30">
  <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6 flex items-center justify-between">
    {/* Gauche */}
    <div className="flex items-center gap-4 lg:gap-8">
      <div className="flex items-center gap-2">
        <MdSchool className="w-5 h-5 text-yellow-400" />
        <span className="font-semibold">Collège Emmanuel</span>
      </div>
      
      <div className="hidden lg:flex items-center gap-2 text-blue-100">
        <MdStar className="w-5 h-5 text-yellow-400" />
        <span>L'excellence est mon destin</span>
      </div>
    </div>

    {/* Droite */}
<div className="hidden md:flex items-center gap-6 text-blue-100">

  {/* Téléphone */}
  <a
    href="tel:+243999999999"
    className="flex items-center gap-2 hover:text-yellow-400 transition"
  >
    <MdPhone className="w-5 h-5 text-yellow-400" />

    <span>
      +243 999 999 999
    </span>
  </a>


  {/* Email */}
  <a
    href="mailto:contact@college-emmanuel.com"
    className="flex items-center gap-2 hover:text-yellow-400 transition"
  >
    <MdEmail className="w-5 h-5 text-yellow-400" />

    <span>
      contact@college-emmanuel.com
    </span>
  </a>

</div>
  </div>
</div>


      {/* Navbar */}

      <header className="sticky top-0 z-50 bg-white border-b-4 border-yellow-500 shadow-lg">

        <div className="mx-auto max-w-7xl px-6 py-4">

          <div className="flex items-center justify-between">

            {/* Logo */}

            <Link
              to="/"
              className="flex items-center gap-4 hover:opacity-90 transition"
            >

              <img
                src="https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2xvZ28ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MzM2MzIxOCwiZXhwIjoxODE0ODk5MjE4fQ.rYU63za1XAJyqnJdN85iQLuJ_4VgGurxKI11VEIBhMU"
                alt="College Emmanuel"
                className="h-16 w-16 rounded-full border-2 border-yellow-500 shadow-lg object-cover"
              />

              <div>

                <h1 className="text-2xl font-extrabold text-blue-900">
                  Collège Emmanuel
                </h1>

                <p className="text-xs uppercase tracking-widest text-slate-500">
                  L'excellence est mon destin.
                </p>

              </div>

            </Link>

            {/* Navigation Desktop */}

            <nav className="hidden lg:flex items-center gap-8">

              {navigation.map((item) => {
  const Icon = item.icon;

  return (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-2 font-semibold transition ${
          isActive
            ? "text-blue-900 border-b-2 border-yellow-500"
            : "text-slate-600 hover:text-blue-900"
        }`
      }
    >
      <Icon size={20} />
      {item.label}
    </NavLink>
  );
})}

            </nav>

            {/* Recherche */}

            <div className="hidden xl:block w-72">

              <input
                type="text"
                placeholder="Rechercher une filière..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border-2 border-blue-100 px-5 py-2 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none"
              />

            </div>
                        {/* Boutons */}

            <div className="hidden lg:flex items-center gap-3">

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-full bg-blue-900 px-6 py-2.5 font-semibold text-white shadow hover:bg-blue-800 transition"
                  >
                    Connexion
                  </Link>

                  <Link
                    to="/contact"
                    className="rounded-full border-2 border-yellow-500 px-6 py-2.5 font-semibold text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                  >
                    Inscription
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-full bg-yellow-500 px-6 py-2.5 font-bold text-blue-900 shadow hover:bg-yellow-400 transition"
                  >
                    {isPrivileged ? "Administration" : "Mon espace"}
                  </Link>

                  <Link
                    to="/profile"
                    className="rounded-full border border-blue-900 px-5 py-2.5 text-blue-900 font-semibold hover:bg-blue-50 transition capitalize"
                  >
                    {isPrivileged ? role : "Mon profil"}
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="rounded-full bg-red-500 px-5 py-2.5 font-semibold text-white hover:bg-red-600 transition"
                  >
                    Déconnexion
                  </button>
                </>
              )}

            </div>

            {/* Bouton Mobile */}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden rounded-xl border border-slate-200 p-2 text-2xl hover:bg-slate-100 transition"
            >
              {isOpen ? "✕" : "☰"}
            </button>

          </div>

        </div>

        {/* MENU MOBILE */}

        {isOpen && (

          <div className="lg:hidden border-t bg-white shadow-xl">

            <div className="px-6 py-5">

              <div className="mb-5">

                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-700 outline-none"
                />

              </div>

              <nav className="flex flex-col gap-2">

                {navigation.map((item) => {
  const Icon = item.icon;

  return (
    <NavLink
      key={item.path}
      to={item.path}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
          isActive
            ? "bg-blue-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      <Icon size={22} />
      {item.label}
    </NavLink>
  );
})}

              </nav>
                            <div className="mt-6 border-t pt-5 flex flex-col gap-3">

                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl bg-blue-900 py-3 text-center font-semibold text-white hover:bg-blue-800 transition"
                    >
                      Connexion
                    </Link>

                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl border-2 border-yellow-500 py-3 text-center font-semibold text-yellow-600 hover:bg-yellow-500 hover:text-white transition"
                    >
                      Inscription
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl bg-yellow-500 py-3 text-center font-bold text-blue-900 hover:bg-yellow-400 transition"
                    >
                      {isPrivileged
                        ? "Administration"
                        : "Mon espace"}
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl border border-blue-900 py-3 text-center font-semibold text-blue-900 hover:bg-blue-50 transition"
                    >
                      {isPrivileged
                        ? `Rôle : ${role}`
                        : "Mon profil"}
                    </Link>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                        navigate("/login");
                      }}
                      className="rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 transition"
                    >
                      Déconnexion
                    </button>
                  </>
                )}

              </div>

            </div>

          </div>

        )}

      </header>

    </>
  );
}



