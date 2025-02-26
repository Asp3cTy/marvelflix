// src/components/ProtectedAdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, authToken } = useContext(AuthContext);

  // Se não estiver logado, redireciona para a landing page
  if (!authToken) {
    return <Navigate to="/" />;
  }

  // Se estiver logado, mas o email não for o do admin, redireciona para /home
  if (!user || user.email.toLowerCase() !== "zulinn@marvelflix.com") {
    return <Navigate to="/home" />;
  }

  // Caso passe, renderiza o componente protegido
  return children;
};

export default ProtectedAdminRoute;
