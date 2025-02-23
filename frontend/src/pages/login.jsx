import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      // Agora POST em /api/panel/login
      const response = await axios.post(`${API_URL}/api/panel/login`, credentials);
      
      // Rota retorna { token } se der certo
      const { token } = response.data;
      if (!token) {
        setErrorMessage("Falha ao autenticar.");
        return;
      }

      // Salve o token no localStorage, se quiser
      localStorage.setItem("panelToken", token);

      // Redireciona para /admin
      navigate("/admin");
    } catch (err) {
      setErrorMessage("Usuário ou senha incorretos.");
      console.error("Erro ao fazer login:", err);
    }
  };

  return (
    <div>
      <h1>Página de Login (usuário/senha)</h1>
      {errorMessage && <p>{errorMessage}</p>}

      <input
        type="text"
        placeholder="Usuário"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Senha"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
