import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ChatWorkspace from './pages/ChatWorkspace';
import ContentManagement from './pages/ContentManagement';

// Route Guard: Only allows authenticated users, otherwise redirects to /login
const ProtectedLayout = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-semibold">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = localStorage.getItem('role');
  if (role && role !== 'student') {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full h-screen flex bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

// Route Guard: Redirects authenticated users away from auth pages (e.g. login)
const AuthRouteGuard = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null; // Let the bootloader handle it
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest / Auth Routes */}
          <Route element={<AuthRouteGuard />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Application Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatWorkspace />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/content" element={<ContentManagement />} />
            {/* Fallback route within authenticated layout */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Fallback for unrecognized paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
