import { Outlet } from "react-router-dom";
import DashboardMenu from "./DashboardMenu.jsx";

export default function DashboardLayout() {
  if (typeof window !== "undefined") console.log("DashboardLayout rendered", window.location.pathname);
  
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Menu Sidebar (Fixé à gauche, largeur de 72 unités) */}
      <DashboardMenu />

      {/* Contenu principal décalé de la largeur de la sidebar sur grand écran */}
      <main className="flex-1 lg:ml-72 bg-slate-100 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
