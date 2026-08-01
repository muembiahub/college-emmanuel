import { HashRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
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

const Home = lazy(() => import("./pages/Home.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Auth = lazy(() => import("./pages/Auth.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/* ===========================
   Dashboard
=========================== */

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const Profile = lazy(() => import("./pages/dashboard/Profile.jsx"));
const Notifications = lazy(() => import("./pages/dashboard/Notifications.jsx"));
const Notes = lazy(() => import("./pages/dashboard/Notes.jsx"));
const Settings = lazy(() => import("./pages/dashboard/Settings.jsx"));

/* ===========================
   Inscriptions
=========================== */

const Reinscription = lazy(() => import("./pages/dashboard/inscriptions/Reinscription.jsx"));
const Nouvelle = lazy(() => import("./pages/dashboard/inscriptions/Nouvelle.jsx"));
const Students = lazy(() => import("./pages/dashboard/eleves/Students.jsx"));

/* ===========================
   Classes
=========================== */
const ClassesOverview = lazy(() => import("./pages/dashboard/classes/ClassesOverview.jsx"));
const Maternelle = lazy(() => import("./pages/dashboard/classes/Maternelle.jsx"));
const Primaire = lazy(() => import("./pages/dashboard/classes/Primaire.jsx"));
const Secondaire = lazy(() => import("./pages/dashboard/classes/Secondaire.jsx"));

/* ===========================
   Finances
=========================== */

const RapportsFinance = lazy(() => import("./pages/dashboard/finances/RapportsFinance.jsx"));
const Depenses = lazy(() => import("./pages/dashboard/finances/Depenses.jsx"));
const Homepage = lazy(() => import("./pages/dashboard/finances/FinancesHomepage.jsx"));
const PaiementsEleves = lazy(() => import("./pages/dashboard/finances/PaiementsEleves.jsx"));
const FacturePaiement = lazy(() => import("./pages/dashboard/finances/FacturePaiement.jsx"));
const PaiementFicheEleves = lazy(() => import("./pages/dashboard/finances/PaiementFicheEleves.jsx"));
const ConfigurationFrais = lazy(() => import("./pages/dashboard/finances/ConfigurationFrais.jsx"));

/* ===========================
   Personnel
=========================== */

const Personnel = lazy(() => import("./pages/dashboard/Personnel.jsx"));
const Enseignants = lazy(() => import("./pages/dashboard/personnel/Enseignants.jsx"));
const Agents = lazy(() => import("./pages/dashboard/personnel/Agents.jsx"));
const Gardes = lazy(() => import("./pages/dashboard/personnel/Gardes.jsx"));
const Menagers = lazy(() => import("./pages/dashboard/personnel/Menagers.jsx"));

/* ===========================
   Inventaire
=========================== */

const InventairePage = lazy(() => import("./pages/dashboard/Inventaire.jsx"));
const Patrimoine = lazy(() => import("./pages/dashboard/inventaire/Patrimoine.jsx"));
const Bureaux = lazy(() => import("./pages/dashboard/inventaire/Bureaux.jsx"));
const SallesClasse = lazy(() => import("./pages/dashboard/inventaire/SallesClasse.jsx"));

/* ===========================
   Rapports
=========================== */

const Reports = lazy(() => import("./pages/dashboard/reports/Reports.jsx"));
const ReportsAcademic = lazy(() => import("./pages/dashboard/reports/ReportsAcademic.jsx"));
const ReportsStatistics = lazy(() => import("./pages/dashboard/reports/ReportsStatistics.jsx"));
const ReportsAttendance = lazy(() => import("./pages/dashboard/reports/ReportsAttendance.jsx"));

/* ===========================
   Calendrier
=========================== */

const CalendarPage = lazy(() => import("./pages/dashboard/calendar/Calendar.jsx"));
const Events = lazy(() => import("./pages/dashboard/calendar/Events.jsx"));
const Holidays = lazy(() => import("./pages/dashboard/calendar/Holidays.jsx"));
const Exams = lazy(() => import("./pages/dashboard/calendar/Exams.jsx"));

/* ==========================================================
   Route protégée
========================================================== */

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const devBypass =
    import.meta.env.MODE !== "production" &&
    localStorage.getItem("DEV_SKIP_AUTH") === "1";
  const isLoginRoute = location.pathname === "/login";

  useEffect(() => {
    if (!loading && !user && !devBypass && !isLoginRoute) {
      toast.error(
        "Veuillez vous connecter pour accéder à cette page."
      );
    }
  }, [user, loading, devBypass, isLoginRoute]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isLoginRoute) {
    return user || devBypass ? <Navigate to="/dashboard" replace /> : <Outlet />;
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

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
    </div>
  );
}

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
        <Suspense fallback={<LoadingFallback />}>
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
              Dashboard protégé
          ======================= */}

          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              <Route index element={<Dashboard />} />
              <Route path="profiles" element={<Profile />} />
              <Route
                path="notifications"
                element={<Notifications />}/>
              <Route path="notes" element={<Notes />} />
              <Route path="settings" element={<Settings />} />

              {/* Inscriptions */}

              <Route path="inscriptions/reinscription" element={<Reinscription />} />
              <Route path="inscriptions/nouvelle" element={<Nouvelle />} />
              <Route path="students" element={<Students />} />

              {/* Classes */}
              <Route path="classes" element={<ClassesOverview />} />
              <Route path="classes/maternelle" element={<Maternelle />} />
              <Route path="classes/primaire" element={<Primaire />} />
              <Route path="classes/secondaire" element={<Secondaire />} />

              {/* Finances */}

              <Route path="finances" element={<RapportsFinance />} />
              <Route path="finances/depenses" element={<Depenses />} />
              <Route path="finances/homepage" element={<Homepage />} />
              <Route path="finances/paiements-eleves" element={<PaiementsEleves />} />
              <Route path="finances/factureseleves" element= {<FacturePaiement/>} />
              <Route path="finances/paiementficheeleves" element={<PaiementFicheEleves />} />
              <Route path="finances/rapports" element={<RapportsFinance />} />
              <Route path="finances/configurationfrais" element={<ConfigurationFrais />} />

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

              

            </Route>
          </Route>

        </Routes>
        </Suspense>

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