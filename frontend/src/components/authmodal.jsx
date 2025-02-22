import { useState } from "react";

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
      {/* Container do Modal */}
      <div className="bg-marvelDark text-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          ✖
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center mb-4">Entrar</h2>

        {/* Formulário */}
        <form>
          <div className="mb-4">
            <label className="block text-sm text-gray-300">Email:</label>
            <input
              type="email"
              className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-marvelRed focus:outline-none"
              placeholder="Digite seu email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-300">Senha:</label>
            <input
              type="password"
              className="w-full p-2 mt-1 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-marvelRed focus:outline-none"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-md font-bold transition"
          >
            Login
          </button>
        </form>

        {/* Link para cadastro */}
        <p className="text-center text-sm mt-4">
          Ainda não tem conta? <a href="#" className="text-marvelRed">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
