// src/components/authmodal.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext"; 
import API_URL from "../config";

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Em vez de useAuth, usamos useContext
  const { login } = useContext(AuthContext);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Email inválido.");
      return;
    }
    if (password.length < 4) {
      setError("Senha muito curta.");
      return;
    }

    const endpoint = isRegistering
      ? `${API_URL}/api/auth/register`
      : `${API_URL}/api/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Erro ao processar solicitação.");
        return;
      }

      if (isRegistering) {
        alert(data.message || "Usuário registrado com sucesso!");
      } else {
        if (data.token) {
          // Chamamos login do contexto
          login(data.token);
          navigate("/home");
        }
      }
      handleClose();
    } catch (err) {
      console.error("Erro ao comunicar com API:", err);
      setError("Erro de conexão. Tente novamente.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full relative">
        <button onClick={handleClose} className="absolute top-2 right-2 text-white">✖</button>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {isRegistering ? "Registrar" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="email"
            placeholder="E-mail"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-red-600 text-white p-2 rounded">
            {isRegistering ? "Registrar" : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-2 text-sm text-gray-300">
          {isRegistering ? (
            <>
              <p>Já tem conta?</p>
              <button className="text-red-400 underline" onClick={() => setIsRegistering(false)}>
                Fazer Login
              </button>
            </>
          ) : (
            <>
              <p>Novo por aqui?</p>
              <button className="text-red-400 underline" onClick={() => setIsRegistering(true)}>
                Criar conta
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
