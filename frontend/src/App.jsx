import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumb from './components/Breadcrumb';
import ReportModal from './components/ReportModal';
import ToastNotification from './components/ToastNotification';

// Existing Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Results from './pages/Results';
import Materials from './pages/Materials';
import Comparison from './pages/Comparison';
import Recommendation from './pages/Recommendation';
import Sensitivity from './pages/Sensitivity';
import History from './pages/History';
import About from './pages/About';

// Authentication & Admin Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';

function MainAppContent() {
  const { user, toast, setToast } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState('dashboard');

  // Shared state across engineering pages
  const [calculationResult, setCalculationResult] = useState(null);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [reportModalData, setReportModalData] = useState(null);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Protected Routes Check
  const protectedPages = [
    'dashboard',
    'calculator',
    'results',
    'comparison',
    'recommendation',
    'sensitivity',
    'history',
    'profile',
    'admin'
  ];

  const handlePageChange = (page) => {
    if (protectedPages.includes(page) && !user) {
      setRedirectAfterLogin(page);
      setToast({ type: 'warning', text: 'Please sign in to access that protected engineering page.' });
      setActivePage('login');
      return;
    }
    setActivePage(page);
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDark ? 'dark bg-[#0b1329] text-slate-100' : 'light bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <Navbar
          isDark={isDark}
          toggleTheme={toggleTheme}
          activePage={activePage}
          setActivePage={handlePageChange}
        />

        {/* Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumb activePage={activePage} setActivePage={handlePageChange} />

          {/* Authentication Pages */}
          {activePage === 'login' && (
            <Login
              setActivePage={handlePageChange}
              redirectAfterLogin={redirectAfterLogin}
            />
          )}

          {activePage === 'register' && <Register setActivePage={handlePageChange} />}

          {activePage === 'forgot-password' && <ForgotPassword setActivePage={handlePageChange} />}

          {activePage === 'reset-password' && <ResetPassword setActivePage={handlePageChange} />}

          {activePage === 'profile' && <Profile setActivePage={handlePageChange} />}

          {activePage === 'admin' && <AdminUsers setActivePage={handlePageChange} />}

          {/* Core Engineering Application Pages */}
          {activePage === 'home' && <Home setActivePage={handlePageChange} />}

          {activePage === 'dashboard' && (
            <Dashboard
              setActivePage={handlePageChange}
              setReportData={(data) => setReportModalData(data)}
            />
          )}

          {activePage === 'calculator' && (
            <Calculator
              setActivePage={handlePageChange}
              setCalculationResult={setCalculationResult}
              setCurrentRequest={setCurrentRequest}
            />
          )}

          {activePage === 'results' && (
            <Results
              calculationResult={calculationResult}
              currentRequest={currentRequest}
              setActivePage={handlePageChange}
              setReportData={(data) => setReportModalData(data)}
            />
          )}

          {activePage === 'materials' && <Materials />}

          {activePage === 'comparison' && <Comparison setActivePage={handlePageChange} />}

          {activePage === 'recommendation' && <Recommendation setActivePage={handlePageChange} />}

          {activePage === 'sensitivity' && <Sensitivity />}

          {activePage === 'history' && (
            <History
              setActivePage={handlePageChange}
              setCalculationResult={setCalculationResult}
              setCurrentRequest={setCurrentRequest}
            />
          )}

          {activePage === 'about' && <About />}
        </main>
      </div>

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Printable Engineering Report Modal */}
      {reportModalData && (
        <ReportModal
          isOpen={!!reportModalData}
          onClose={() => setReportModalData(null)}
          currentResult={reportModalData.result}
          currentRequest={reportModalData.request}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
