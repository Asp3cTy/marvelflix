import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Tenta obter o token e o email do sessionStorage (mais seguro que localStorage)
  const storedToken = sessionStorage.getItem("token");
  const storedEmail = sessionStorage.getItem("userEmail");

  const [authToken, setAuthToken] = useState(storedToken || null);
  const [userEmail, setUserEmail] = useState(storedEmail || null);

  // ✅ Atualiza o sessionStorage sempre que o usuário logar/deslogar
  useEffect(() => {
    if (authToken && userEmail) {
      sessionStorage.setItem("token", authToken);
      sessionStorage.setItem("userEmail", userEmail);
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
    }
  }, [authToken, userEmail]);

  // ✅ Atualiza o estado ao logar
  const login = (token, email) => {
    setAuthToken(token);
    setUserEmail(email);
  };

  // ✅ Remove os dados ao deslogar
  const logout = () => {
    setAuthToken(null);
    setUserEmail(null);
    sessionStorage.clear(); // Remove tudo ao deslogar
  };

  return (
    <AuthContext.Provider value={{ authToken, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
