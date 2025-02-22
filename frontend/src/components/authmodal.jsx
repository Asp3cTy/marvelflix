import { useState, useEffect } from "react";

const AuthModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Para animação ao abrir
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Aguarda animação antes de fechar
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-marvelDark p-6 rounded-lg shadow-lg w-96 relative transform transition-transform duration-300 scale-95">
        
        {/* Botão de Fechar */}
        <button 
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={handleClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Entrar</h2>

        {/* Campos de Login */}
        <input 
          type="email"
          placeholder="Seu e-mail"
          className="w-full p-2 rounded bg-gray-700 text-white mb-3"
        />
        <input 
          type="password"
          placeholder="Senha"
          className="w-full p-2 rounded bg-gray-700 text-white mb-3"
        />

        <button className="w-full bg-red-600 py-2 rounded-lg font-bold hover:bg-red-700 transition">
          Entrar
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
