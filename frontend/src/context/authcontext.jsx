import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedEmail = localStorage.getItem("userEmail");

  const [authToken, setAuthToken] = useState(storedToken || null);
  const [userEmail, setUserEmail] = useState(storedEmail || null);

  // Atualizar o localStorage sempre que o usuário logar/deslogar
  useEffect(() => {
    if (authToken && userEmail) {
      localStorage.setItem("token", authToken);
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
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
  };

  return (
    <AuthContext.Provider value={{ authToken, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
