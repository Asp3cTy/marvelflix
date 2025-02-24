import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./authmodal";
import { useAuth } from "../context/authcontext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { authToken, isAdmin, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-marvelDark text-white p-4 shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Botão hamburguer (mobile) */}
          <button 
            className="text-2xl md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-marvelRed transition">Home</Link>
            <Link to="/collections" className="hover:text-marvelRed transition">Coleções</Link>
            <Link to="/about" className="hover:text-marvelRed transition">Sobre</Link>
            
            {isAdmin && (
              <Link to="/admin" className="hover:text-marvelRed transition">Painel</Link>
            )}
          </nav>

          {/* Logo centralizada */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="https://i.imgur.com/GpB2cuj.png" 
              alt="MarvelFlix" 
              className="h-12 md:h-14 lg:h-16 w-auto mx-auto"
            />
          </Link>

          {/* Botões de Login/Logout */}
          {authToken ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Entrar
            </button>
          )}
        </div>
      </header>

      {/* Menu mobile quando aberto */}
      {isMenuOpen && (
        <div className="bg-marvelDark text-white py-4 shadow-md mt-16">
          <nav className="flex flex-col items-center space-y-4">
            <Link to="/" className="hover:text-marvelRed transition">Home</Link>
            <Link to="/collections" className="hover:text-marvelRed transition">Coleções</Link>
            <Link to="/about" className="hover:text-marvelRed transition">Sobre</Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-marvelRed transition">Painel</Link>
            )}
          </nav>
        </div>
      )}

      {/* Modal de Login/Registro */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}

      {/* Ajuste de padding pra não ocultar conteúdo atrás do header fixo */}
      <div className="pt-16 bg-marvelDark"></div>
    </>
  );
};

export default Header;
