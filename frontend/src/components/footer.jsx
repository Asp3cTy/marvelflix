import React from "react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-marvelDark text-white py-6 mt-10 border-t border-gray-700">
      <div className="container mx-auto flex flex-col items-center text-center space-y-4">

        {/* Texto de direitos autorais */}
        <p className="text-sm">© 2025 MarvelFlix. Todos os direitos reservados.</p>

        {/* Botão Voltar ao Topo */}
        <button 
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-lg transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Voltar ao Topo ↑
        </button>

        {/* Ícones de Redes Sociais (Alinhados corretamente) */}
        <div className="flex flex-col items-center mt-4 space-y-3">
          <a href="https://t.me/seuTelegram" target="_blank" rel="noopener noreferrer">
            <FaTelegramPlane className="text-white-400 text-4xl hover:text-white-500 transition" />
          </a>
          <a href="https://wa.me/seuNumero" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-white-400 text-4xl hover:text-white-500 transition" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
