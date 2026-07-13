import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import { useAuth } from "./hooks/UseAuth.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

/* ===========================
   Layout
=========================== */

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

/* ===========================
   Pages publiques
=========================== */

import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";

/* ===========================
   Dashboard
=========================== */

import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import Notes from "./pages/dashboard/Notes.jsx";
import Settings from "./pages/dashboard/Settings.jsx";

/* ===========================
   Inscriptions
=========================== */

import Inscription from "./pages/dashboard/inscriptions/Inscription.jsx";
import Nouvelle from "./pages/dashboard/inscriptions/Nouvelle.jsx";
import Reinscription from "./pages/dashboard/inscriptions/Reinscription.jsx";
import ListeInscriptions from "./pages/dashboard/inscriptions/Liste.jsx";
import Students from "./pages/dashboard/eleves/Students.jsx";
import ClassesInscription from "./pages/dashboard/inscriptions/ClassesInscription.jsx";
import Options from "./pages/dashboard/inscriptions/Options.jsx";

/* ===========================
   Classes
=========================== */

import Maternelle from "./pages/dashboard/classes/Maternelle.jsx";
import Primaire from "./pages/dashboard/classes/Primaire.jsx";
import Secondaire from "./pages/dashboard/classes/Secondaire.jsx";

/* ===========================
   Finances
=========================== */

import RapportsFinance from "./pages/dashboard/finances/RapportsFinance.jsx";
import Depenses from "./pages/dashboard/finances/Depenses.jsx";
import Payement from "./pages/dashboard/finances/Payement.jsx";
import Paiements from "./pages/dashboard/finances/Paiements.jsx";
import PaiementsAgents from "./pages/dashboard/finances/PaiementsAgents.jsx";
import HistoriqueFinance from "./pages/dashboard/finances/Historique.jsx";

/* ===========================
   Personnel
=========================== */

import Personnel from "./pages/dashboard/Personnel.jsx";
import Enseignants from "./pages/dashboard/personnel/Enseignants.jsx";
import Agents from "./pages/dashboard/personnel/Agents.jsx";
import Gardes from "./pages/dashboard/personnel/Gardes.jsx";
import Menagers from "./pages/dashboard/personnel/Menagers.jsx";

/* ===========================
   Inventaire
=========================== */

import InventairePage from "./pages/dashboard/Inventaire.jsx";
import Patrimoine from "./pages/dashboard/inventaire/Patrimoine.jsx";
import Bureaux from "./pages/dashboard/inventaire/Bureaux.jsx";
import SallesClasse from "./pages/dashboard/inventaire/SallesClasse.jsx";

/* ===========================
   Rapports
=========================== */

import Reports from "./pages/dashboard/reports/Reports.jsx";
import ReportsAcademic from "./pages/dashboard/reports/ReportsAcademic.jsx";
import ReportsStatistics from "./pages/dashboard/reports/ReportsStatistics.jsx";
import ReportsAttendance from "./pages/dashboard/reports/ReportsAttendance.jsx";

/* ===========================
   Calendrier
=========================== */

import CalendarPage from "./pages/dashboard/calendar/Calendar.jsx";
import Events from "./pages/dashboard/calendar/Events.jsx";
import Holidays from "./pages/dashboard/calendar/Holidays.jsx";
import Exams from "./pages/dashboard/calendar/Exams.jsx";

/* ==========================================================
   Route protégée
========================================================== */

function ProtectedRoute() {
  const { user, loading } = useAuth();

  const devBypass =
    localStorage.getItem("DEV_SKIP_AUTH") === "1";

  useEffect(() => {
    if (!loading && !user && !devBypass) {
      toast.error(
        "Veuillez vous connecter pour accéder au tableau de bord."
      );
    }
  }, [user, loading, devBypass]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return user || devBypass ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

/* ==========================================================
   Layout public
========================================================== */

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

/* ==========================================================
   APP
========================================================== */

export default function App() {
  return (
    <NotificationProvider>
      <Router>

        <Routes>

          {/* =======================
              Routes publiques
          ======================= */}

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* =======================
              Dashboard
          ======================= */}

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>

              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />

              {/* Inscriptions */}

              <Route path="inscriptions" element={<Inscription />} />
              <Route path="inscriptions/nouvelle" element={<Nouvelle />} />
              <Route path="inscriptions/reinscription" element={<Reinscription />} />
              <Route path="inscriptions/liste" element={<ListeInscriptions />} />
              <Route path="inscriptions/classes" element={<ClassesInscription />} />
              <Route path="inscriptions/options" element={<Options />} />

              <Route path="students" element={<Students />} />

              {/* Classes */}

              <Route path="classes/maternelle" element={<Maternelle />} />
              <Route path="classes/primaire" element={<Primaire />} />
              <Route path="classes/secondaire" element={<Secondaire />} />

              {/* Finances */}

              <Route path="finances" element={<RapportsFinance />} />
              <Route path="finances/depenses" element={<Depenses />} />
              <Route path="finances/payement" element={<Payement />} />
              <Route path="finances/paiements" element={<Paiements />} />
              <Route path="finances/paiements-agents" element={<PaiementsAgents />} />
              <Route path="finances/historique" element={<HistoriqueFinance />} />

              {/* Personnel */}

              <Route path="personnel" element={<Personnel />} />
              <Route path="personnel/enseignants" element={<Enseignants />} />
              <Route path="personnel/agents" element={<Agents />} />
              <Route path="personnel/gardes" element={<Gardes />} />
              <Route path="personnel/menagers" element={<Menagers />} />

              {/* Inventaire */}

              <Route path="inventaire" element={<InventairePage />} />
              <Route path="inventaire/patrimoine" element={<Patrimoine />} />
              <Route path="inventaire/bureaux" element={<Bureaux />} />
              <Route path="inventaire/salles" element={<SallesClasse />} />

              {/* Rapports */}

              <Route path="reports" element={<Reports />} />
              <Route path="reports/academic" element={<ReportsAcademic />} />
              <Route path="reports/statistics" element={<ReportsStatistics />} />
              <Route path="reports/attendance" element={<ReportsAttendance />} />

              {/* Calendrier */}

              <Route path="calendar" element={<CalendarPage />} />
              <Route path="calendar/events" element={<Events />} />
              <Route path="calendar/holidays" element={<Holidays />} />
              <Route path="calendar/exams" element={<Exams />} />

              <Route path="notes" element={<Notes />} />
              <Route path="settings" element={<Settings />} />

            </Route>
          </Route>

        </Routes>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#1e293b",
              color: "#fff",
            },
            success: {
              duration: 3500,
            },
            error: {
              duration: 5000,
            },
          }}
        />

      </Router>
    </NotificationProvider>
  );
};