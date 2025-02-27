import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

// Formata o nome antes do @, ex: "zulinn@..." => "Zulinn"
function formatDisplayName(email) {
  const username = email.split("@")[0].toLowerCase();
  return username.charAt(0).toUpperCase() + username.slice(1);
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authToken, logout } = useContext(AuthContext);

  const userEmail = localStorage.getItem("userEmail");

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-marvelDark text-white p-4 shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between relative">
          {/* Botão hamburguer visível só no mobile */}
          <button
            className="text-2xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          {/* Nav principal (só em telas md+) */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="hover:text-red-500 transition-colors">
              Home
            </Link>
            <Link to="/collections" className="hover:text-red-500 transition-colors">
              Coleções
            </Link>
            <Link to="/about" className="hover:text-red-500 transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Logo centralizada */}
          <Link to="/home" className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://i.imgur.com/GpB2cuj.png"
              alt="MarvelFlix"
              className="h-12 md:h-14 lg:h-16 w-auto mx-auto"
            />
          </Link>

          {/* Sempre visível: "Olá, Zulinn" (se logado), mas Logout só em telas md+ */}
          <div className="flex items-center space-x-4">
            {/* Se logado e userEmail existe, mostra a saudação */}
            {authToken && userEmail && (
              <span className="text-gray-200">
                Olá, {formatDisplayName(userEmail)}
              </span>
            )}
            {/* Logout visível apenas em telas md+ (desktop) */}
            {authToken && (
              <button
                onClick={logout}
                className="hidden md:inline bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Dropdown do mobile (só aparece se isMenuOpen for true) */}
      {isMenuOpen && (
        <div
          className="bg-marvelDark text-white py-4 shadow-md md:hidden absolute top-[64px] w-full"
        >
          <nav className="flex flex-col items-center space-y-4">
            <Link to="/home" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">
              Home
            </Link>
            <Link to="/collections" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">
              Coleções
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500">
              Sobre
            </Link>

            {/* Logout no dropdown, apenas em mobile */}
            {authToken && (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Empurra o conteúdo principal para baixo do header fixo */}
      <div className="pt-16 bg-marvelDark"></div>
    </>
  );
};

export default Header;
