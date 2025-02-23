import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const baseURL = import.meta.env.VITE_API_URL || "";
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const validatePassword = (pwd) => {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!pwd) return "";
    if (strongRegex.test(pwd)) return "Senha forte ✅";
    return "A senha deve conter pelo menos 8 caracteres, 1 maiúscula, 1 número e 1 símbolo ⚠️";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Insira um e-mail válido.");
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

    const endpoint = isRegistering
      ? `${baseURL}/api/auth/register`
      : `${baseURL}/api/auth/login`;

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
        // Registro bem-sucedido
        alert(data.message || "Usuário registrado com sucesso!");
      } else {
        // Login bem-sucedido
        if (data.token) {
          login(data.token);
        }
        // **Fechamos o modal** antes de navegar
        handleClose();
        // Agora redireciona
        navigate("/home");
      }
    } catch (err) {
      console.error("Erro ao comunicar com API:", err);
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-gradient-to-br from-marvelDark to-gray-900 p-8 rounded-xl shadow-2xl w-96 relative transform transition-transform duration-300 scale-95">
        <button
          className="absolute top-3 right-3 text-white text-2xl hover:text-gray-400 transition"
          onClick={handleClose}
        >
          ✖
        </button>

        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          <img
            src="https://i.imgur.com/GpB2cuj.png"
            alt="MarvelFlix"
            className="h-12 md:h-14 lg:h-16 w-auto mx-auto"
          />
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-gray-300 text-sm">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:ring focus:ring-red-400 transition"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-300 text-sm">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordStrength(validatePassword(e.target.value));
              }}
              placeholder="Digite sua senha"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:ring focus:ring-red-400 transition"
            />
            {password && (
              <p
                className={`text-xs mt-1 ${
                  passwordStrength.includes("forte")
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {passwordStrength}
              </p>
            )}
          </div>

          {isRegistering && (
            <div className="mb-6">
              <label className="text-gray-300 text-sm">Confirmar Senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:ring focus:ring-red-400 transition"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 py-3 rounded-lg font-bold text-white text-lg hover:bg-red-700 transition"
          >
            {isRegistering ? "Registrar-se" : "Entrar"}
          </button>
        </form>

        {/* Alternar entre Login e Registro */}
        <div className="text-center mt-4">
          {!isRegistering ? (
            <>
              <p className="text-gray-400 text-sm">
                Esqueceu a senha?{" "}
                <a href="#" className="text-red-500 hover:underline">
                  Recuperar
                </a>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Novo por aqui?{" "}
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => setIsRegistering(true)}
                >
                  Criar Conta
                </button>
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{" "}
              <button
                className="text-red-500 hover:underline"
                onClick={() => setIsRegistering(false)}
              >
                Fazer Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
