import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/authcontext";
import LandingPage from "./pages/landingpage";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import CollectionView from "./pages/collectionview";
import MovieView from "./pages/movieview";
import AdminPanel from "./pages/adminpanel";
import Login from "./pages/login";

const ProtectedRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  return authToken ? children : <Navigate to="/" />;
};

const App = () => {
  const { authToken } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* 🔹 Se o usuário estiver autenticado, exibe o Header normalmente */}
          {authToken && <Header />}

          {/* 🔹 Conteúdo principal cresce para ocupar o espaço disponível */}
          <div className="flex-grow">
            <Routes>
              {/* Se não estiver autenticado, redireciona para a LandingPage */}
              <Route path="/" element={authToken ? <Home /> : <LandingPage />} />
              <Route path="/collection/:collectionId" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
              <Route path="/movie/:movieId" element={<ProtectedRoute><MovieView /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* 🔹 O Footer só aparece se o usuário estiver autenticado */}
          {authToken && <Footer />}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
