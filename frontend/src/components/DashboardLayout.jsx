import { Outlet } from "react-router-dom";
import DashboardMenu from "./DashboardMenu";
import dashboardBg from "../assets/dashboard-bg.jpg";

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${dashboardBg})`,
      }}
    >
      {/* Léger voile pour que le texte reste lisible */}
      <div className="min-h-screen bg-black/20">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <DashboardMenu />

          {/* Contenu */}
          <main className="flex-1 lg:ml-72 p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}