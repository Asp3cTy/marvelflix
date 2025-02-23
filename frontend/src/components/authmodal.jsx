// src/components/authmodal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import API_URL from "../config";

const AuthModal = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering
      ? `${API_URL}/api/auth/register`
      : `${API_URL}/api/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao processar a solicitação.");
        return;
      }

      if (isRegistering) {
        alert(data.message || "Usuário registrado com sucesso!");
      } else {
        // Espera do backend: { token }
        if (data.token) {
          login(data.token);
          navigate("/home");
        }
      }
      onClose();
    } catch (err) {
      console.error("Erro ao comunicar com API:", err);
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white p-6 w-96 rounded">
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <h2 className="mb-2">{isRegistering ? "Registrar" : "Login"}</h2>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button type="submit" className="bg-blue-600 text-white py-2 px-4">
            {isRegistering ? "Criar Conta" : "Entrar"}
          </button>
        </form>

        {isRegistering ? (
          <p className="mt-2">
            Já tem uma conta?{" "}
            <button onClick={() => setIsRegistering(false)} className="text-blue-600 underline">
              Faça Login
            </button>
          </p>
        ) : (
          <p className="mt-2">
            Novo aqui?{" "}
            <button onClick={() => setIsRegistering(true)} className="text-blue-600 underline">
              Registre-se
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
