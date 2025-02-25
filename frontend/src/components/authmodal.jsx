// src/components/AuthModal.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import API_URL from "../config";
import DOMPurify from "dompurify"; // Proteção contra XSS

// Função para checar força da senha (mín. 8 caracteres, 1 maiúscula, 1 número e 1 símbolo)
function validatePasswordStrength(password) {
  const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return strongRegex.test(password);
}

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ✅ Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // ✅ Fecha o modal suavemente
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // ✅ Dispara o formulário com Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // ✅ Lógica de autenticação (Login ou Registro)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.includes("@")) {
      setError("Insira um email válido.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (isRegistering && !validatePasswordStrength(password)) {
      setError("A senha deve ter pelo menos 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.");
      return;
    }

    // Define o endpoint correto (Login ou Registro)
    const endpoint = isRegistering
      ? `${API_URL}/api/auth/register`
      : `${API_URL}/api/auth/login`;

    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("✅ Resposta do servidor:", data);

      // Simula um tempo de carregamento para melhor experiência do usuário (opcional)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsLoading(false);

      if (!response.ok) {
        setError(data.message || "Erro ao processar a solicitação.");
        return;
      }

      if (isRegistering) {
        // ✅ Registro bem-sucedido
        setSuccessMsg("Registro realizado com sucesso! Bem-vindo ao MarvelFlix.");
        setTimeout(() => {
          navigate("/home");
          handleClose();
        }, 2000);
      } else {
        // ✅ Login bem-sucedido
        if (data.token && data.email) {
          login(DOMPurify.sanitize(data.token), DOMPurify.sanitize(data.email)); // 🔹 Agora garantindo que o email seja armazenado corretamente
          setSuccessMsg("Login bem-sucedido!");
          setTimeout(() => {
            navigate("/home");
            handleClose();
          }, 2000);
        } else {
          setError("Erro: Token ou email não retornados pelo servidor.");
        }
      }
    } catch (err) {
      console.error("❌ Erro ao comunicar com a API:", err);
      setIsLoading(false);
      setError("Falha na conexão. Tente novamente.");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      onKeyDown={handleKeyDown} // Permite submit ao pressionar Enter
      tabIndex={0} // Para ativar keydown
    >
      <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full relative shadow-lg">
        <button className="absolute top-2 right-2 text-white" onClick={handleClose}>
          ✖
        </button>

        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {isRegistering ? "Registrar-se" : "Login"}
        </h2>

        {/* Exibe erro em caso de falha */}
        {error && <div className="bg-red-600 text-white p-2 rounded mb-3 text-sm text-center">{error}</div>}

        {/* Exibe mensagem de sucesso */}
        {successMsg && <div className="bg-green-600 text-white p-2 rounded mb-3 text-sm text-center">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Sua senha"
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegistering && (
            <input
              type="password"
              placeholder="Confirmar senha"
              className="p-2 rounded bg-gray-800 text-white border border-gray-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button type="submit" className="bg-red-600 text-white py-2 rounded mt-2 disabled:opacity-50" disabled={isLoading}>
            {isLoading ? "Carregando..." : isRegistering ? "Registrar" : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-300">
          {isRegistering ? (
            <p>
              Já tem conta? <button className="text-red-400 underline" onClick={() => setIsRegistering(false)}>Fazer Login</button>
            </p>
          ) : (
            <p>
              Novo por aqui? <button className="text-red-400 underline" onClick={() => setIsRegistering(true)}>Criar Conta</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
