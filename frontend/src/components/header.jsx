// src/components/Header.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

// Função para formatar o nome
function formatDisplayName(email) {
  const username = email.split("@")[0].toLowerCase();
  return username.charAt(0).toUpperCase() + username.slice(1);
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authToken, logout } = useContext(AuthContext);
  const userEmail = sessionStorage.getItem("userEmail");

  return (
    <>
      {/* Header Desktop: fixado no topo */}
      <header className="fixed top-0 left-0 w-full bg-marvelDark text-white p-4 shadow-md z-50 hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/home" className="hover:text-red-500 transition-colors">Home</Link>
          <Link to="/collections" className="hover:text-red-500 transition-colors">Coleções</Link>
          <Link to="/about" className="hover:text-red-500 transition-colors">Sobre</Link>
        </div>
        <div className="flex items-center space-x-4">
          {authToken && userEmail && (
            <span className="text-gray-200">Olá, {formatDisplayName(userEmail)}</span>
          )}
          {authToken && (
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Header Mobile: fixado no rodapé */}
      <header className="fixed bottom-0 left-0 w-full bg-marvelDark text-white p-4 shadow-md z-50 md:hidden flex items-center justify-between">
        <button
          className="text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
        {authToken && userEmail && (
          <span className="text-gray-200">
            Olá, {formatDisplayName(userEmail)}
          </span>
        )}
        {/* Se quiser pode manter um botão Logout também aqui, mas como a ideia é tê-lo só no dropdown, omitimos */}
      </header>

      {/* Dropdown Mobile (abre para cima) */}
      {isMenuOpen && (
        <>
          {/* Backdrop para fechar o menu ao clicar fora */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Dropdown fixo: Posicionado acima do header mobile */}
          <div
            className="fixed bottom-[64px] left-0 w-full z-40 bg-marvelRed text-white shadow-md max-h-[calc(100vh-64px)] overflow-y-auto py-4"
          >
            <nav className="flex flex-col items-center space-y-4">
              <Link
                to="/home"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white-500"
              >
                Home
              </Link>
              <Link
                to="/collections"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white-500"
              >
                Coleções
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-white-500"
              >
                Sobre
              </Link>
              {authToken && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-zinc-50 px-4 py-2 rounded-lg hover:bg-zinc-300 text-marvelRed transition"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
          
        </>
      )}
      <div className="pb-16 md:pb-0"></div>
    </>
  );
};

export default Header;
