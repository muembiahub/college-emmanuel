import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./hooks/UseAuth.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";

// Pages Dashboard
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

import Inscription from "./pages/dashboard/inscriptions/Inscription.jsx";
import Students from "./pages/dashboard/eleves/Students.jsx";
import ClassesInscription from "./pages/dashboard/inscriptions/ClassesInscription.jsx";
import Options from "./pages/dashboard/inscriptions/Options.jsx";
import Maternelle from "./pages/dashboard/classes/Maternelle.jsx";
import Primaire from "./pages/dashboard/classes/Primaire.jsx";
import Secondaire from "./pages/dashboard/classes/Secondaire.jsx";
import RapportsFinance from "./pages/dashboard/finances/RapportsFinance.jsx";
import Paiements from "./pages/dashboard/finances/Paiements.jsx";
import PaiementsAgents from "./pages/dashboard/finances/PaiementsAgents.jsx";
import Enseignants from "./pages/dashboard/personnel/Enseignants.jsx";
import Agents from "./pages/dashboard/personnel/Agents.jsx";
import Gardes from "./pages/dashboard/personnel/Gardes.jsx";
import Menagers from "./pages/dashboard/personnel/Menagers.jsx";
import Patrimoine from "./pages/dashboard/inventaire/Patrimoine.jsx";
import Bureaux from "./pages/dashboard/inventaire/Bureaux.jsx";
import SallesClasse from "./pages/dashboard/inventaire/SallesClasse.jsx";
import Notes from "./pages/dashboard/Notes.jsx";
import Settings from "./pages/dashboard/Settings.jsx";

// Inscriptions (sous-pages)
import Nouvelle from "./pages/dashboard/inscriptions/Nouvelle.jsx";
import Reinscription from "./pages/dashboard/inscriptions/Reinscription.jsx";
import ListeInscriptions from "./pages/dashboard/inscriptions/Liste.jsx";

// Finances (sous-pages)
import Depenses from "./pages/dashboard/finances/Depenses.jsx";
import Payement from "./pages/dashboard/finances/Payement.jsx";
import HistoriqueFinance from "./pages/dashboard/finances/Historique.jsx";

// Personnel / Inventaire main pages
import Personnel from "./pages/dashboard/Personnel.jsx";
import InventairePage from "./pages/dashboard/Inventaire.jsx";

// Rapports
import Reports from "./pages/dashboard/reports/Reports.jsx";
import ReportsAcademic from "./pages/dashboard/reports/ReportsAcademic.jsx";
import ReportsStatistics from "./pages/dashboard/reports/ReportsStatistics.jsx";
import ReportsAttendance from "./pages/dashboard/reports/ReportsAttendance.jsx";

// Calendrier
import CalendarPage from "./pages/dashboard/calendar/Calendar.jsx";
import Events from "./pages/dashboard/calendar/Events.jsx";
import Holidays from "./pages/dashboard/calendar/Holidays.jsx";
import Exams from "./pages/dashboard/calendar/Exams.jsx";
// 
/**
 * Sécurisation des routes privées du Dashboard
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();
  // Dev bypass: set localStorage.setItem('DEV_SKIP_AUTH','1') to force access in dev
  const devBypass = typeof window !== 'undefined' && localStorage.getItem('DEV_SKIP_AUTH') === '1';

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Veuillez vous connecter pour accéder au tableau de bord 🔒");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return user || devBypass ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * Layout public (Navbar + Footer)
 */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
    <Router>
      <Routes>
        {/* 🌐 Routes publiques */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 🔒 Routes Dashboard protégées */}
       
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            <Route path="inscriptions" element={<Inscription />} />
            <Route path="students" element={<Students />} />
            <Route path="inscriptions/nouvelle" element={<Nouvelle />} />
            <Route path="inscriptions/reinscription" element={<Reinscription />} />
            <Route path="inscriptions/liste" element={<ListeInscriptions />} />
            <Route path="inscriptions/classes" element={<ClassesInscription />} />
            <Route path="inscriptions/options" element={<Options />} />

            <Route path="classes" element={<Maternelle />} />
            <Route path="classes/maternelle" element={<Maternelle />} />
            <Route path="classes/primaire" element={<Primaire />} />
            <Route path="classes/secondaire" element={<Secondaire />} />

            <Route path="finances" element={<RapportsFinance />} />
            <Route path="finances/depenses" element={<Depenses />} />
            <Route path="finances/payement" element={<Payement />} />
            <Route path="finances/rapports" element={<RapportsFinance />} />
            <Route path="finances/paiements" element={<Paiements />} />
            <Route path="finances/paiements-agents" element={<PaiementsAgents />} />
            <Route path="finances/historique" element={<HistoriqueFinance />} />

            <Route path="personnel" element={<Personnel />} />
            <Route path="personnel/enseignants" element={<Enseignants />} />
            <Route path="personnel/agents" element={<Agents />} />
            <Route path="personnel/gardes" element={<Gardes />} />
            <Route path="personnel/menagers" element={<Menagers />} />

            <Route path="inventaire" element={<InventairePage />} />
            <Route path="inventaire/patrimoine" element={<Patrimoine />} />
            <Route path="inventaire/bureaux" element={<Bureaux />} />
            <Route path="inventaire/salles" element={<SallesClasse />} />

            <Route path="reports" element={<Reports />} />
            <Route path="reports/academic" element={<ReportsAcademic />} />
            <Route path="reports/statistics" element={<ReportsStatistics />} />
            <Route path="reports/attendance" element={<ReportsAttendance />} />

            <Route path="calendar" element={<CalendarPage />} />
            <Route path="calendar/events" element={<Events />} />
            <Route path="calendar/holidays" element={<Holidays />} />
            <Route path="calendar/exams" element={<Exams />} />

            <Route path="notes" element={<Notes />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>

      {/* Notifications globales */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </Router>
     </NotificationProvider>

  );
}

export default App;
