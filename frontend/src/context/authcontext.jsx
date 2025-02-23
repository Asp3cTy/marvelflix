// src/context/authcontext.jsx
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Em vez de authToken, guardamos todo o objeto user
  const [user, setUser] = useState(
    // tenta persistir no localStorage se quiser
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Se quiser uma flag de admin
  const isAdmin = (user?.role === "admin");

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

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
