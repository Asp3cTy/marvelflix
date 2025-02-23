// src/context/authcontext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Em vez de guardar só o token, vamos armazenar também o role e o email
  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  // Checamos se é admin
  const isAdmin = (role === "admin");

  // Quando o usuário faz login, salvamos token, role e email
  const login = (token, userRole, userEmail) => {
    setAuthToken(token);
    setRole(userRole);
    setEmail(userEmail);

    // Salva no localStorage se desejar
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("email", userEmail);
  };

  // Quando faz logout, limpamos tudo
  const logout = () => {
    setAuthToken(null);
    setRole("user");
    setEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ authToken, role, email, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
