// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authcontext";

// Supondo que você tenha suas páginas:
import LandingPage from "./pages/landingpage";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Collections from "./pages/collections";
import CollectionView from "./pages/collectionview";
import MovieView from "./pages/movieview";
import AdminPanel from "./pages/adminpanel"; // Se quiser manter, mas agora não tem nada de admin
import Login from "./pages/login";

const ProtectedRoute = ({ children }) => {
  const { authToken } = useAuth();

  // Se não estiver logado, redireciona para "/"
  if (!authToken) {
    return <Navigate to="/" />;
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
  const { authToken } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* exibe Header só se tiver token (usuário logado) */}
      {authToken && <Header />}

      <div className="flex-grow">
        <Routes>
          {/* Se não logado, mostra Landing; se logado, redireciona p/ /home */}
          <Route path="/" element={!authToken ? <LandingPage /> : <Navigate to="/home" />} />
          
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
          <Route path="/movie/:movieId" element={<ProtectedRoute><MovieView /></ProtectedRoute>} />

          {/* Se quiser manter "AdminPanel" como rota, mas não há distinção de admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {authToken && <Footer />}
    </div>
  );
};

export default App;
