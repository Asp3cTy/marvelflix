import React, { createContext, useState, useContext } from "react";
import API_URL from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);

  // Quando faz login, salva token
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("token", token);
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};
