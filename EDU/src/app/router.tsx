import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { HeaderLayout } from "../shared/components/GovernmentHeader";
import { containsTamil } from "../shared/lib/utils";

const PublicHomePage = lazy(() => import("../features/public/pages/PublicHomePage").then((m) => ({ default: m.PublicHomePage })));
const AppProviders = lazy(() => import("./providers").then((m) => ({ default: m.AppProviders })));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const TeacherTransferDashboard = lazy(() => import("../features/transfer/pages/TeacherTransferDashboard").then((m) => ({ default: m.TeacherTransferDashboard })));
const TeacherModulePage = lazy(() => import("../features/teacher/pages/TeacherModulePage").then((m) => ({ default: m.TeacherModulePage })));
const TransferModulePage = lazy(() => import("../features/transfer/pages/TransferModulePage").then((m) => ({ default: m.TransferModulePage })));
const HelpdeskModulePage = lazy(() => import("../features/helpdesk/pages/HelpdeskModulePage").then((m) => ({ default: m.HelpdeskModulePage })));
const MISModulePage = lazy(() => import("../features/mis/pages/MISModulePage").then((m) => ({ default: m.MISModulePage })));
const EmployeeReportsPage = lazy(() => import("../features/mis/pages/EmployeeReportsPage").then((m) => ({ default: m.EmployeeReportsPage })));
const AdminModulePage = lazy(() => import("../features/admin/pages/AdminModulePage").then((m) => ({ default: m.AdminModulePage })));

function LoadingScreen() {
  return (
    <div className="grid min-h-[45vh] place-items-center rounded-card border border-slate-200 bg-white shadow-soft">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="font-semibold text-slate-700">Loading TIS demo...</p>
      </div>
    </div>
  );
}

function PublicLayout() {
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div
      className={`${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"} ${highContrast ? "contrast-mode" : ""} min-h-screen`}
      style={{ fontSize: `${fontScale}%` }}
    >
      <HeaderLayout
        darkMode={darkMode}
        highContrast={highContrast}
        language={language}
        onDecreaseFont={() => setFontScale((value) => Math.max(90, value - 5))}
        onIncreaseFont={() => setFontScale((value) => Math.min(115, value + 5))}
        onToggleContrast={() => setHighContrast((value) => !value)}
        onToggleDarkMode={() => setDarkMode((value) => !value)}
        onToggleLanguage={() => setLanguage((value) => (value === "English" ? "தமிழ்" : "English"))}
      />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

function HomepageOnlyRedirect() {
  const { pathname } = useLocation();
  if (pathname === "/grievance") return <Navigate to="/#grievance" replace />;
  return <Navigate to="/" replace />;
}

function FeatureProviderLayout() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

function LanguageSync() {
  const location = useLocation();

  useEffect(() => {
    window.setTimeout(() => {
      document.documentElement.lang = containsTamil(document.body.innerText) ? "ta" : "en";
    }, 0);
  }, [location.pathname, location.hash]);

  return null;
}

function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    let retryTimer: number | undefined;
    let attempts = 0;

    const scrollToTarget = () => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        if (attempts < 30) {
          attempts += 1;
          retryTimer = window.setTimeout(scrollToTarget, 100);
        }
        return;
      }

      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    retryTimer = window.setTimeout(scrollToTarget, 0);

    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [location.hash, location.pathname]);

  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <LanguageSync />
      <HashScroll />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHomePage />} />
          <Route element={<FeatureProviderLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/my/transfer" element={<TeacherTransferDashboard />} />
            <Route path="/teacher" element={<TeacherModulePage />} />
            <Route path="/transfer" element={<TransferModulePage />} />
            <Route path="/helpdesk" element={<HelpdeskModulePage />} />
            <Route path="/mis" element={<MISModulePage />} />
            <Route path="/reports" element={<EmployeeReportsPage />} />
            <Route path="/admin" element={<AdminModulePage />} />
          </Route>
          <Route path="*" element={<HomepageOnlyRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
