// src/components/AuthModal.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import API_URL from "../config";

// Função simples para validar a força da senha
function validatePasswordStrength(password) {
  const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return strongRegex.test(password);
}

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  // Campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Estados para feedback
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // Controle do loading/spinner
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Fecha o modal
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Submete o formulário com Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.includes("@")) {
      setError("Insira um email válido");
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
      setError("A senha deve ter ao menos 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.");
      return;
    }

    // Obter o token Turnstile gerado pelo widget
    const turnstileToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) {
      setError("Por favor, complete o desafio Turnstile.");
      return;
    }

    // Define o endpoint de acordo com a ação (login ou register)
    const endpoint = isRegistering
      ? `${API_URL}/api/auth/register`
      : `${API_URL}/api/auth/login`;

    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Envia email, password e o token Turnstile
        body: JSON.stringify({ email, password, "cf-turnstile-response": turnstileToken }),
      });

      const data = await response.json();

      // Simula 3 segundos de carregamento (opcional)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoading(false);

      if (!response.ok) {
        setError(data.message || "Ocorreu um erro no servidor.");
        return;
      }

      if (isRegistering) {
        // Registro bem-sucedido
        setSuccessMsg("Registro realizado com sucesso! Bem-vindo ao MarvelFlix");
        setTimeout(() => {
          navigate("/home");
          handleClose();
        }, 3000);
      } else {
        // Login bem-sucedido
        if (data.token && data.email) {
          login(data.token);
          sessionStorage.setItem("userEmail", data.email);
          setSuccessMsg("Login bem-sucedido");
          setTimeout(() => {
            navigate("/home");
            handleClose();
          }, 3000);
        } else {
          setError("Token não retornado. Falha ao efetuar login.");
        }
      }
    } catch (err) {
      console.error("Erro ao comunicar com API:", err);
      setIsLoading(false);
      setError("Falha na conexão. Tente novamente.");
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-gray-900 p-6 rounded-lg max-w-sm w-full relative shadow-lg">
        <button
          className="absolute top-2 right-2 text-white"
          onClick={handleClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {isRegistering ? "Registrar-se" : "Login"}
        </h2>

        {error && (
          <div className="bg-red-600 text-white p-2 rounded mb-3 text-sm text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-600 text-white p-2 rounded mb-3 text-sm text-center">
            {successMsg}
          </div>
        )}

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

          {/* Turnstile widget */}
          <div
            className="cf-turnstile"
            data-sitekey="0x4AAAAAAA-xFXi12VnMOhnp"
            data-theme="dark"
            data-size="compact"
          ></div>

          <button
            type="submit"
            className="bg-red-600 text-white py-2 rounded mt-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <span>Carregando...</span>
              </div>
            ) : isRegistering ? (
              "Registrar"
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-300">
          {isRegistering ? (
            <p>
              Já tem conta?{" "}
              <button
                className="text-red-400 underline"
                onClick={() => setIsRegistering(false)}
              >
                Fazer Login
              </button>
            </p>
          ) : (
            <p>
              Novo por aqui?{" "}
              <button
                className="text-red-400 underline"
                onClick={() => setIsRegistering(true)}
              >
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
