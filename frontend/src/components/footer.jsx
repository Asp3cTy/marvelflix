// footer.jsx
import React from "react";
import { FaTelegram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-marvelDark text-white py-8">
      <div className="container mx-auto flex flex-col items-center text-center space-y-6">

        {/* Botão Voltar ao Topo */}
        <button 
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Voltar ao Topo
        </button>

        {/* Texto de direitos autorais */}
        <p className="text-sm font-light">© 2025 MarvelFlix. Todos os direitos reservados.</p>

        {/* Ícones de Redes Sociais (Telegram e WhatsApp lado a lado) */}
        <div className="flex items-center gap-4">
          <a href="https://t.me/seuTelegram" target="_blank" rel="noopener noreferrer">
            <FaTelegram className="text-white-400 text-3xl hover:text-white-500 transition-transform transform hover:scale-110" />
          </a>
          <a href="https://wa.me/seuNumero" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-white-400 text-3xl hover:text-white-500 transition-transform transform hover:scale-110" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;