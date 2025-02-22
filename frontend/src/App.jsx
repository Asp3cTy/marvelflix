import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/authcontext";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import CollectionView from "./pages/collectionview";
import MovieView from "./pages/movieview";
import AdminPanel from "./pages/adminpanel";
import Login from "./pages/login";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  return authToken ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* 🔹 Header fixo no topo */}
          <Header />

          {/* 🔹 Conteúdo principal cresce para ocupar o espaço disponível */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection/:collectionId" element={<CollectionView />} />
              <Route path="/movie/:movieId" element={<MovieView />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* 🔹 Footer fixo na parte inferior */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
