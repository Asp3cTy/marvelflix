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

// ✅ Rota protegida: Apenas usuários logados podem acessar
const ProtectedRoute = ({ children }) => {
  const { authToken } = React.useContext(AuthContext);
  
  if (!authToken) {
    console.log("🔒 Acesso negado! Redirecionando para LandingPage...");
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// ✅ Rota protegida SOMENTE para "zulinn@marvelflix.com"
const AdminProtectedRoute = ({ children }) => {
  const { authToken, userEmail } = React.useContext(AuthContext);

  if (!authToken) {
    console.log("🔒 Acesso negado! Redirecionando para LandingPage...");
    return <Navigate to="/" replace />;
  }

  if (userEmail !== "zulinn@marvelflix.com") {
    console.log("🚫 Acesso negado ao Admin Panel!");
    return <Navigate to="/home" replace />;
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
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={authToken ? <Navigate to="/home" replace /> : <LandingPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
          <Route path="/movie/:movieId" element={<ProtectedRoute><MovieView /></ProtectedRoute>} />

          {/* ✅ Somente Zulinn pode acessar o painel administrativo */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminPanel /></AdminProtectedRoute>} />

          {/* 🔄 Redireciona qualquer outra rota inválida para LandingPage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {authToken && <Footer />}
    </div>
  );
};

export default App;
