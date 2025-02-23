// src/pages/login.jsx
import { useState, useContext } from "react";
import { PanelContext } from "../context/panelcontext"; // se criou esse context
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const Login = () => {
  const navigate = useNavigate();
  const { loginPanel } = useContext(PanelContext);

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/panel/login`, credentials);
      // A rota retorna { token }
      const { token } = response.data;

      // Se não vier token, algo deu errado
      if (!token) {
        setErrorMessage("Falha ao autenticar.");
        return;
      }

      // Salva no contexto
      loginPanel(token);

      // Redireciona para /admin
      navigate("/admin");
    } catch (err) {
      console.error("Erro ao logar no painel:", err);
      setErrorMessage("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-marvelDark text-white">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg border border-red-600">
        <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
          Acesso ao Painel
        </h1>
        
        {errorMessage && <p className="text-red-500 text-center mb-3">{errorMessage}</p>}

        <input
          type="text"
          className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500 w-full"
          placeholder="Usuário"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          className="p-3 mt-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500 w-full"
          placeholder="Senha"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />

        <button
          className="mt-4 p-3 bg-red-600 hover:bg-red-500 rounded text-white w-full transition duration-200"
          onClick={handleLogin}
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default Login;
