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
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

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
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={!authToken ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
          <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
          <Route path="/movie/:movieId" element={<ProtectedRoute><MovieView /></ProtectedRoute>} />
          {/* Protege a rota /admin usando o componente específico para admin */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {authToken && <Footer />}
    </div>
  );
};

export default App;
