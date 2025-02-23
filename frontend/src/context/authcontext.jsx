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
  const [userEmail, setUserEmail] = useState(null);

  // Função de login que armazena o token e o salva no localStorage
  const login = (token, email) => {
    setAuthToken(token);
    setUserEmail(email);
    localStorage.setItem("authToken", token);
    localStorage.setItem("userEmail", email);
  };

  // Função de logout que remove o token
  const logout = () => {
    setAuthToken(null);
    setUserEmail(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
  };

  // Verifica se há um token salvo no localStorage ao carregar o app
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedToken) {
      setAuthToken(savedToken);
      setUserEmail(savedEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};