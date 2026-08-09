import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { useAuth } from "./hooks/UseAuth.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

/* ===========================
   Pages publiques
=========================== */
const Home = lazy(() => import("./pages/Home.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Auth = lazy(() => import("./pages/Auth.jsx"));
const CompleteInvitation = lazy(() => import("./pages/CompleteInvitation.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

/* ===========================
   Dashboard
=========================== */
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const Profile = lazy(() => import("./pages/dashboard/Profile.jsx"));
const Notifications = lazy(() => import("./pages/dashboard/Notifications.jsx"));
const Notes = lazy(() => import("./pages/dashboard/Notes.jsx"));
const Settings = lazy(() => import("./pages/dashboard/Settings.jsx"));

/* ==========================================================
   Route protégée
========================================================== */
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingFallback />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

/* ==========================================================
   Layout public + redirection auto
========================================================== */
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      navigate("/complete/invitation" + window.location.hash, { replace: true });
    }
  }, [navigate]);

  return null;
}

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
      <RootRedirect /> {/* intercepteur pour invitation */}
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
            {/* Routes publiques */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/complete/invitation" element={<CompleteInvitation />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Dashboard protégé */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profiles" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="notes" element={<Notes />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "12px", background: "#1e293b", color: "#fff" },
            success: { duration: 3500 },
            error: { duration: 5000 },
          }}
        />
      </Router>
    </NotificationProvider>
  );
}
