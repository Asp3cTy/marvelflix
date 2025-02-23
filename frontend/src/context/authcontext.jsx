import React, { createContext, useState } from "react";

// Aqui não precisamos de axios, pois o login será feito no AuthModal
// Mas você pode manter se quiser chamá-lo daqui

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Armazenamos o "user" inteiro
  // user: { id, email, role, ... }
  const [user, setUser] = useState(
    // Tenta ler do localStorage para manter login entre reloads
    JSON.parse(localStorage.getItem("user")) || null
  );

  // isAdmin simples
  const isAdmin = user?.role === "admin";

  // Função login: recebe "user" do back e salva no state
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Função logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
