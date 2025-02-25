import React, { createContext, useState, useEffect } from "react";
import DOMPurify from "dompurify"; // 🔹 Importa DOMPurify para evitar XSS

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔹 Obtém o token e o email do sessionStorage
  const storedToken = sessionStorage.getItem("token");
  const storedEmail = sessionStorage.getItem("userEmail");

  const [authToken, setAuthToken] = useState(storedToken || null);
  const [userEmail, setUserEmail] = useState(storedEmail || null);

  // ✅ Atualiza o sessionStorage sempre que o usuário logar/deslogar
  useEffect(() => {
    if (authToken && userEmail) {
      sessionStorage.setItem("token", DOMPurify.sanitize(authToken)); // 🔹 Sanitiza o token
      sessionStorage.setItem("userEmail", DOMPurify.sanitize(userEmail)); // 🔹 Sanitiza o email
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
    }
  }, [authToken, userEmail]);

  // ✅ Atualiza o estado ao logar
  const login = (token, email) => {
    setAuthToken(DOMPurify.sanitize(token)); // 🔹 Sanitiza antes de salvar
    setUserEmail(DOMPurify.sanitize(email)); // 🔹 Sanitiza antes de salvar
  };

  // ✅ Remove os dados ao deslogar
  const logout = () => {
    setAuthToken(null);
    setUserEmail(null);
    sessionStorage.clear(); // 🔹 Remove tudo ao deslogar
  };

  return (
    <AuthContext.Provider value={{ authToken, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
