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

  const navigate = useNavigate();
  const { login } = useAuth(); // pegamos a função login do context

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

      // Se não for OK ou se não vier success
      if (!response.ok || data.success === false) {
        setError(data.message || "Erro ao processar");
        return;
      }

      if (isRegistering) {
        alert(data.message || "Registrado com sucesso!");
        setIsRegistering(false);
      } else {
        // LOGIN
        if (data.user) {
          // data.user vem do backend (sem token)
          login(data.user);

          // Redireciona para Home
          navigate("/home");

          // Fecha o modal
          onClose();
        }
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
          <h2>{isRegistering ? "Registrar" : "Login"}</h2>
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">{isRegistering ? "Registrar" : "Entrar"}</button>
        </form>

        {isRegistering ? (
          <p>
            Já tem conta?
            <button onClick={() => setIsRegistering(false)}>Login</button>
          </p>
        ) : (
          <p>
            Novo?
            <button onClick={() => setIsRegistering(true)}>Registrar</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
