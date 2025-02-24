import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import API_URL from "../config";

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 4) {
      setError("Credenciais inválidas.");
      return;
    }

    // Decide rota
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
        setError(data.message || "Erro ao processar a solicitação.");
        return;
      }

      if (isRegistering) {
        alert(data.message || "Usuário registrado com sucesso!");
      } else {
        if (data.token) {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full relative">
        <button className="absolute top-2 right-2 text-white" onClick={handleClose}>✖</button>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {isRegistering ? "Crie sua conta" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="email"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
          >
            {isRegistering ? "Registrar" : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-4">
          {isRegistering ? (
            <p className="text-gray-300 text-sm">
              Já tem conta?{" "}
              <button onClick={() => setIsRegistering(false)} className="text-red-400 underline">
                Fazer Login
              </button>
            </p>
          ) : (
            <p className="text-gray-300 text-sm">
              Novo por aqui?{" "}
              <button onClick={() => setIsRegistering(true)} className="text-red-400 underline">
                Criar Conta
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
