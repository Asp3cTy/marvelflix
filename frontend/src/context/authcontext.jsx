// authcontext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Cria o contexto de autenticação
export const AuthContext = createContext();

// Hook personalizado para usar a autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  // Função de login que armazena o token e o salva no localStorage
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  // Função de logout que remove o token
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
  };

  // Verifica se há um token salvo no localStorage ao carregar o app
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};