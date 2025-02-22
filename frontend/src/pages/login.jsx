import { useState, useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import axios from "axios";
import AuthModal from "../components/authmodal";

const Login = () => {
    const { setAuthToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
            const { token, user } = response.data;

            if (user.username !== "admin") {
                setErrorMessage("Acesso negado. Usuário sem permissão.");
                return;
            }

            setAuthToken(token);
            navigate("/admin");
        } catch (error) {
            setErrorMessage("Usuário ou senha incorretos.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-marvelDark text-white">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg border border-red-600">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">🔒 Acesso Restrito</h1>
                <p className="text-gray-400 text-center mb-4">Somente administradores podem entrar.</p>

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
                    className="p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500 w-full mt-3"
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

                <div className="mt-4 text-center">
                    <button
                        className="text-sm text-gray-400 hover:text-red-500 transition"
                        onClick={() => setShowAuthModal(true)}
                    >
                        Esqueceu sua senha?
                    </button>
                </div>
            </div>

            {/* Modal de Autenticação (caso precise recuperar senha) */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
};

export default Login;
