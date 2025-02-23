import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authcontext";

import LandingPage from "./pages/landingpage";
import Home from "./pages/home";
import AdminPanel from "./pages/adminpanel";
import Header from "./components/header";
import Footer from "./components/footer";

// Protegendo rotas com user e role
const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, isAdmin } = useAuth();

  // Se não estiver logado, vai para "/"
  if (!user) {
    return <Navigate to="/" />;
  }

  // Se a rota exigir admin, e não for admin => /home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* exibe header se logado, por exemplo */}
      {user && <Header />}

      <div className="flex-grow">
        <Routes>
          {/* "/" => Se não logado, Landing; se logado, vai para /home */}
          <Route
            path="/"
            element={!user ? <LandingPage /> : <Navigate to="/home" />}
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Rota admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Se quiser outras rotas... */}
          {/* <Route path="/collections" .../> */}

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {user && <Footer />}
    </div>
  );
};

export default App;
