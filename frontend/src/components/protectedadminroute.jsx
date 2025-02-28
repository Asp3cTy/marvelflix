// src/components/ProtectedAdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, authToken } = useContext(AuthContext);

  // Se não houver token, redireciona para a landing page
  if (!authToken) {
    return <Navigate to="/" />;
  }

  // Enquanto o token existe mas o user ainda não foi carregado, podemos exibir um loading
  if (authToken && !user) {
    return <div>Carregando...</div>;
  }

  // Se estiver logado mas o email não for o admin, redireciona para /home
  if (user && user.email.toLowerCase() !== "zulinn@marvelflix.com") {
    return <Navigate to="/home" />;
  }

  // Se tudo estiver OK, renderiza o componente protegido
  return children;
};

export default ProtectedAdminRoute;
