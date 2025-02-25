import React, { createContext, useState, useEffect } from "react";
import DOMPurify from "dompurify"; // Proteção contra XSS

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔹 Obtém os valores do sessionStorage
  const storedToken = sessionStorage.getItem("token");
  const storedEmail = sessionStorage.getItem("userEmail");

  const [authToken, setAuthToken] = useState(storedToken || null);
  const [userEmail, setUserEmail] = useState(storedEmail || null);

  console.log("🔄 Estado inicial do AuthContext:");
  console.log("Token:", authToken);
  console.log("Email:", userEmail);

  // ✅ Atualiza o sessionStorage sempre que o usuário logar/deslogar
  useEffect(() => {
    if (authToken && userEmail) {
      sessionStorage.setItem("token", DOMPurify.sanitize(authToken));
      sessionStorage.setItem("userEmail", DOMPurify.sanitize(userEmail));
      console.log("✅ Token salvo:", authToken);
      console.log("✅ Email salvo:", userEmail);
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userEmail");
      console.log("❌ Token removido do sessionStorage");
    }
  }, [authToken, userEmail]);

  // ✅ Atualiza o estado ao logar
  const login = (token, email) => {
    console.log("🔹 Dados recebidos no login:", { token, email });

    if (!token) {
      console.error("❌ ERRO: Token inválido recebido!");
      return;
    }

    if (!email) {
      console.warn("⚠️ Aviso: Email não foi passado, usando 'desconhecido@marvelflix.com'");
      email = "desconhecido@marvelflix.com"; // Define um valor padrão
    }

    setAuthToken(DOMPurify.sanitize(token));
    setUserEmail(DOMPurify.sanitize(email));
    console.log("🔓 Usuário logado com sucesso:", email);
  };

  // ✅ Remove os dados ao deslogar
  const logout = () => {
    setAuthToken(null);
    setUserEmail(null);
    sessionStorage.clear(); // 🔹 Remove tudo ao deslogar
    console.log("🚪 Usuário deslogado!");
  };

  return (
    <AuthContext.Provider value={{ authToken, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
