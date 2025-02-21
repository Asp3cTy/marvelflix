import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config"; 


const Login = () => {
    const { setAuthToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = () => {
        axios.post(`${API_URL}/api/auth/login`, credentials)
        .then(response => {
            setAuthToken(response.data.token);
            navigate("/admin");
        })
        .catch(error => {
            setErrorMessage("Usuário ou senha incorretos.");
        });
    
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-marvelDark text-white">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">Acesso Restrito</h1>

                {errorMessage && <p className="text-red-500 text-center mb-3">{errorMessage}</p>}

                <input
                    type="text"
                    className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
                    placeholder="Usuário"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
                <input
                    type="password"
                    className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
                    placeholder="Senha"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />

                <button
                    className="mt-4 p-2 bg-blue-600 hover:bg-blue-500 rounded text-white w-full"
                    onClick={handleLogin}
                >
                    Entrar
                </button>
            </div>
        </div>
    );
};

export default Login;
