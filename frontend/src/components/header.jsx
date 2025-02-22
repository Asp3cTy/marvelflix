import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-marvelDark text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600">
          MarvelFlix
        </Link>

        {/* Menu para telas grandes */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-red-400 transition">Home</Link>
          <Link to="/collections" className="hover:text-red-400 transition">Coleções</Link>
          <Link to="/about" className="hover:text-red-400 transition">Sobre</Link>
        </nav>

        {/* Botão Login */}
        <Link to="/login" className="hidden md:block bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition">
          Entrar
        </Link>

        {/* Menu Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="text-3xl">✖</span> // Ícone de fechar
          ) : (
            <span className="text-3xl">☰</span> // Ícone de menu
          )}
        </button>
      </div>

      {/* Dropdown para Mobile */}
      {isOpen && (
        <div className="md:hidden bg-marvelDark text-white absolute top-16 left-0 w-full shadow-lg">
          <nav className="flex flex-col items-center py-4 space-y-4 text-lg">
            <Link to="/" className="hover:text-red-400 transition" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/collections" className="hover:text-red-400 transition" onClick={() => setIsOpen(false)}>Coleções</Link>
            <Link to="/about" className="hover:text-red-400 transition" onClick={() => setIsOpen(false)}>Sobre</Link>
            <Link to="/login" className="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition" onClick={() => setIsOpen(false)}>
              Entrar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
