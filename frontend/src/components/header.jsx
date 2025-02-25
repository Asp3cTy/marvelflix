// src/components/Header.jsx
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authToken, logout } = useContext(AuthContext);

  // Você pode, se quiser, no login do backend retornar também o email do usuário.
  // Porém, no exemplo atual, só temos "token".
  // Se quiser exibir "Olá, userEmail", precisamos ter "userEmail" no contexto.
  // Vou presumir que seu back agora retorna: { token, email }, e no "login(token, email)" salvamos no context.

  // Exemplo: vamos supor que no AuthContext exista "userEmail"
  // const { authToken, userEmail, logout } = useContext(AuthContext);

  const userEmail = localStorage.getItem("userEmail"); 
  // <-- gambiarra: caso você queira salvar userEmail no localStorage
  // Ideal seria um state no context. Ajuste conforme sua lógica real.

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-marvelDark text-white p-4 shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button
            className="text-2xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/home"
              className="hover:text-red-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/collections"
              className="hover:text-red-500 transition-colors"
            >
              Coleções
            </Link>
            <Link
              to="/about"
              className="hover:text-red-500 transition-colors"
            >
              Sobre
            </Link>
          </nav>

          <Link to="/home" className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://i.imgur.com/GpB2cuj.png"
              alt="MarvelFlix"
              className="h-12 md:h-14 lg:h-16 w-auto mx-auto"
            />
          </Link>

          {authToken ? (
            <div className="flex items-center space-x-4">
              {userEmail && (
                <span className="text-gray-200">Olá, {userEmail}</span>
              )}
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {isMenuOpen && (
        <div className="bg-marvelDark text-white py-4 shadow-md mt-16">
          <nav className="flex flex-col items-center space-y-4">
            <Link to="/home" className="hover:text-red-500">Home</Link>
            <Link to="/collections" className="hover:text-red-500">Coleções</Link>
            <Link to="/about" className="hover:text-red-500">Sobre</Link>
          </nav>
        </div>
      )}

      <div className="pt-14 bg-marvelDark"></div>
    </>
  );
};

export default Header;
