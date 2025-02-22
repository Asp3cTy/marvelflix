import { createContext, useContext, useState, useEffect } from "react";

// Criando o contexto de autenticação
export const AuthContext = createContext();

// Hook personalizado para usar a autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  // Simulação de login (pode ser ajustado para usar API real)
  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  // Simulação de logout
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
  };

  // Verificando o token salvo no localStorage
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
