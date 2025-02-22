import React from "react";

const Footer = () => {
  return (
    <footer className="bg-marvelDark text-white py-6 mt-12">
      <div className="container mx-auto text-center">
        {/* Redes Sociais */}
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-red-500 transition">
            <i className="fab fa-facebook text-2xl"></i>
          </a>
          <a href="#" className="hover:text-red-500 transition">
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a href="#" className="hover:text-red-500 transition">
            <i className="fab fa-instagram text-2xl"></i>
          </a>
          <a href="#" className="hover:text-red-500 transition">
            <i className="fab fa-youtube text-2xl"></i>
          </a>
        </div>

        {/* Direitos Autorais */}
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} MarvelFlix. Todos os direitos reservados.
        </p>

        {/* Botão Voltar ao Topo */}
        <button
          className="mt-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Voltar ao Topo ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;
