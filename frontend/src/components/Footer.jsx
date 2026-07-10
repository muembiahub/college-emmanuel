import { MdStar } from "react-icons/md";
export default function Footer() {
   {/* get current year */}
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-blue-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-10 md:grid-cols-4">


          {/* Identité école */}
          <div>

            <h3 className="text-2xl font-extrabold">
              Collège Emmanuel
            </h3>

            <p className="mt-4 text-sm leading-6 text-blue-100">
              Une école d'excellence qui forme des élèves responsables,
              disciplinés et prêts à construire leur avenir.
            </p>

          </div>



          {/* Navigation */}
          <div>

            <h4 className="text-lg font-bold">
              Navigation
            </h4>

            <ul className="mt-4 space-y-3 text-sm text-blue-100">

              <li>
                <a href="/" className="flex items-center gap-2 hover:text-yellow-400 transition">
                  <span className="material-symbols-outlined text-lg">
                    home
                  </span>
                  Accueil
                </a>
              </li>


              <li>
                <a href="/programmes" className="flex items-center gap-2 hover:text-yellow-400 transition">
                  <span className="material-symbols-outlined text-lg">
                    menu_book
                  </span>
                  Filières
                </a>
              </li>


              <li>
                <a href="/enseignants" className="flex items-center gap-2 hover:text-yellow-400 transition">
                  <span className="material-symbols-outlined text-lg">
                    school
                  </span>
                  Enseignants
                </a>
              </li>


              <li>
                <a href="/contact" className="flex items-center gap-2 hover:text-yellow-400 transition">
                  <span className="material-symbols-outlined text-lg">
                    contact_page
                  </span>
                  Contact
                </a>
              </li>

            </ul>

          </div>




          {/* Niveaux scolaires */}
          <div>

            <h4 className="text-lg font-bold">
              Nos niveaux
            </h4>


            <ul className="mt-4 space-y-3 text-sm text-blue-100">

              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  child_care
                </span>
                Maternelle
              </li>


              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  backpack
                </span>
                Primaire
              </li>


              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  school
                </span>
                Secondaire
              </li>


              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  workspace_premium
                </span>
                Excellence académique
              </li>

            </ul>

          </div>




          {/* Contact */}
          <div>

            <h4 className="text-lg font-bold">
              Contact
            </h4>


            <ul className="mt-4 space-y-4 text-sm text-blue-100">


              <li className="flex items-center gap-3">
  <span className="material-symbols-outlined text-yellow-400">
    location_on
  </span>
  <div className="flex flex-col">
    <span className="font-semibold">COLLEGE EMMANUEL</span>
    <span>29, Av. Ndjibu</span>
    <span>Quartier Kamisepe, C/Annexe-Lubumbashi</span>
  </div>
</li>




              <li className="flex items-center gap-3">

                <span className="material-symbols-outlined text-yellow-400">
                  phone
                </span>

                +243 xxx xxx xxx

              </li>



              <li className="flex items-center gap-3">

                <span className="material-symbols-outlined text-yellow-400">
                  mail
                </span>

                contact@college-emmanuel.com

              </li>


            </ul>

          </div>


        </div>




        {/* Copyright */}
       
<div className="mt-10 border-t border-white/20 pt-6">
  <div className="flex flex-col items-center gap-3 text-sm text-blue-100">
    <p className="text-center">
      © {currentYear} <span className="font-semibold">Collège Emmanuel</span>. Tous droits réservés.
    </p>

    <div className="flex flex-wrap justify-center gap-4">
      <a
        href="/regles"
        className="transition-colors hover:text-yellow-400"
      >
        Règles de confidentialité
      </a>

      <span className="hidden sm:inline text-white/40">|</span>

      <a
        href="/mentions"
        className="transition-colors hover:text-yellow-400"
      >
        Mentions légales
      </a>
    </div>
  </div>
</div>



      </div>

    </footer>
  );
}