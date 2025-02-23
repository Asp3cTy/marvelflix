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
  const { login } = useAuth();

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

      if (!response.ok || data.success === false) {
        setError(data.message || "Erro ao processar");
        return;
      }

      if (isRegistering) {
        alert(data.message || "Registrado com sucesso!");
        setIsRegistering(false);
      } else {
        // Supondo que o back retorne algo como:
        // { success: true, user: { id, email, role, ... }, message: "Login ok" }
        if (data.user) {
          // Seta no contexto
          login(data.user);

          // Redireciona para /home
          navigate("/home");

          // Fecha o modal
          onClose();
        } else {
          setError("Dados de usuário não retornados do backend.");
        }
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50">
      <div className="bg-white p-4 m-8">
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <h2>{isRegistering ? "Registrar" : "Login"}</h2>
          <input
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {isRegistering ? "Criar Conta" : "Entrar"}
          </button>
        </form>

        {isRegistering ? (
          <p>Já tem conta? <button onClick={() => setIsRegistering(false)}>Login</button></p>
        ) : (
          <p>Novo? <button onClick={() => setIsRegistering(true)}>Registrar</button></p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
