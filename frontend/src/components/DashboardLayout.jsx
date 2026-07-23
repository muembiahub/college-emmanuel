import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardMenu from "./DashboardMenu";
import dashboardBg from "../assets/dashboard-bg.jpg";

export default function DashboardLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-slate-100 relative"
      style={{
        backgroundImage: `url(${dashboardBg})`,
      }}
    >
      {/* Voile sombre fixe pour l'arrière-plan */}
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none z-0" />

      {/* Sidebar fixe à gauche - On lui passe l'état partagé */}
      <DashboardMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* ZONE DE CONTENU PRINCIPAL 
        On utilise une marge à gauche (ml) fluide qui s'adapte en temps réel 
        à l'ouverture ou la fermeture du menu. Le contenu défile naturellement 
        sans bloquer le menu en haut.
      */}
      <main 
        className={`
          relative
          z-10
          min-h-screen 
          p-6 md:p-10 
          transition-all 
          duration-300 
          ease-in-out
          ${isMenuOpen ? "lg:ml-72" : "lg:ml-20"}
          ml-0
        `}
      >
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}