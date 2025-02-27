// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/authcontext";
import LandingPage from "./pages/landingpage";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Collections from "./pages/collections";
import CollectionView from "./pages/collectionview";
import MovieView from "./pages/movieview";
import AdminPanel from "./pages/adminpanel";
import ProtectedAdminRoute from "./components/protectedadminroute";

// Rota protegida genérica: se não tiver token, redireciona para "/"
const ProtectedRoute = ({ children }) => {
  const { authToken } = React.useContext(AuthContext);
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
  const { authToken } = React.useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      {authToken && <Header />}
      {/* 
          Para desktop: pt-16 adiciona espaço para o header fixo no topo.
          Para mobile: pt-0 (porque o header fica no rodapé) e pb-16 para garantir que o footer seja totalmente visível.
      */}
      <div className="flex-grow pt-0 md:pt-16 pb-[96px] md:pb-0">
        <Routes>
          <Route path="/" element={!authToken ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
          <Route path="/movie/:movieId" element={<ProtectedRoute><MovieView /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {authToken && <Footer />}
    </div>
  );
};

export default App;
