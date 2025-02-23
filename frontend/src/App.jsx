import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authcontext";
import LandingPage from "./pages/landingpage";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Collections from "./pages/collections";
import CollectionView from "./pages/collectionview";
import MovieView from "./pages/movieview";
import AdminPanel from "./pages/adminpanel";
import Login from "./pages/login";

const ProtectedRoute = ({ children, adminOnly }) => {
  const { authToken, isAdmin } = useAuth();

  if (!authToken) {
    return <Navigate to="/" />;
  }

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
    const { authToken } = useAuth();

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
                    <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            {authToken && <Footer />}
        </div>
    );
};

export default App;