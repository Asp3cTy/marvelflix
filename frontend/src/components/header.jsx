import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-marvelDark text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Botão Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.3 5.71L12 12l-6.3-6.29L4.29 7.29 12 15l7.71-7.71z"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Logo Central */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="text-2xl font-bold text-marvelRed">
            MarvelFlix
          </Link>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-marvelRed">Home</Link>
          <Link to="/collections" className="hover:text-marvelRed">Coleções</Link>
          <Link to="/about" className="hover:text-marvelRed">Sobre</Link>
        </nav>

        {/* Botão de Login */}
        <div className="hidden md:flex">
          <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Entrar
          </Link>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-marvelDark text-white text-center py-4 space-y-4">
          <Link to="/" className="block hover:text-marvelRed">Home</Link>
          <Link to="/collections" className="block hover:text-marvelRed">Coleções</Link>
          <Link to="/about" className="block hover:text-marvelRed">Sobre</Link>
          <Link to="/login" className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-32 mx-auto">
            Entrar
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
