import { useState, useEffect } from "react";

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-gradient-to-br from-marvelDark to-gray-900 p-8 rounded-xl shadow-2xl w-96 relative transform transition-transform duration-300 scale-95">
        
        {/* Botão de Fechar */}
        <button 
          className="absolute top-3 right-3 text-white text-2xl hover:text-gray-400 transition"
          onClick={handleClose}
        >
          ✖
        </button>

        {/* Título */}
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
          Bem-vindo de volta! 🚀
        </h2>

        {/* Campos de Login */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm">E-mail</label>
          <input 
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:ring focus:ring-red-400 transition"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-300 text-sm">Senha</label>
          <input 
            type="password"
            placeholder="Digite sua senha"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-red-500 focus:ring focus:ring-red-400 transition"
          />
        </div>

        {/* Botão de Login */}
        <button className="w-full bg-red-600 py-3 rounded-lg font-bold text-white text-lg hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95">
          Entrar
        </button>

        {/* Opções adicionais */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Esqueceu a senha? <a href="#" className="text-red-500 hover:underline">Recuperar</a>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Novo por aqui? <a href="#" className="text-red-500 hover:underline">Criar conta</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
