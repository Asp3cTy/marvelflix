// src/context/authcontext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Toda vez que o token mudar, verificar se o usuário é admin
  useEffect(() => {
    if (authToken) {
      axios
        .get(`${API_URL}/api/auth/check-admin`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setIsAdmin(response.data.isAdmin);
        })
        .catch((error) => {
          console.error("Erro ao verificar administrador:", error);
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [authToken]);

  // Salva o token no state + localStorage
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("token", token);
  };

  // Limpa o token do state + localStorage
  const logout = () => {
    setAuthToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ authToken, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
