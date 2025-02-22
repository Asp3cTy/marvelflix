import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header Principal */}
      <header className="bg-marvelDark text-white p-4 shadow-md relative z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Botão Mobile */}
          <button 
            className="text-2xl md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          {/* Opções de Navegação no Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-marvelRed transition">Home</Link>
            <Link to="/collections" className="hover:text-marvelRed transition">Coleções</Link>
            <Link to="/about" className="hover:text-marvelRed transition">Sobre</Link>
          </nav>

          {/* Logo Centralizada no Desktop */}
              <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
                <img 
                  src="https://i.imgur.com/QHZg4Wu.png" 
                  alt="MarvelFlix" 
                 className="h-12 md:h-14 lg:h-16 w-auto mx-auto"
                />
              </Link>


          {/* Botão de Login */}
          <Link to="/login" className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Entrar
          </Link>
        </div>
      </header>

      {/* Menu Mobile (Dropdown) */}
      {isMenuOpen && (
        <div className="bg-marvelDark text-white py-4 shadow-md">
          <nav className="flex flex-col items-center space-y-4">
            <Link to="/" className="hover:text-marvelRed transition">Home</Link>
            <Link to="/collections" className="hover:text-marvelRed transition">Coleções</Link>
            <Link to="/about" className="hover:text-marvelRed transition">Sobre</Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
