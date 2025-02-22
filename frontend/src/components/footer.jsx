import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-marvelDark text-white py-6 text-center">
      {/* Linha divisória fina e discreta */}
      <hr className="border-gray-700 w-full mb-4" />

      <div className="flex justify-between items-center px-6">
        <p className="text-sm">© 2025 MarvelFlix. Todos os direitos reservados.</p>

        {/* Ícones de redes sociais */}
        <div className="flex space-x-4">
          <a href="https://t.me/seu-telegram" target="_blank" rel="noopener noreferrer">
            <FaTelegramPlane className="text-blue-400 text-2xl hover:text-blue-500 transition" />
          </a>
          <a href="https://wa.me/seu-whatsapp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-green-400 text-2xl hover:text-green-500 transition" />
          </a>
        </div>
      </div>

      {/* Botão de voltar ao topo */}
      <button
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Voltar ao Topo ↑
      </button>
    </footer>
  );
};

export default Footer;
