import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authToken, logout } = useAuth();

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
            <Link to="/home">Home</Link>
            <Link to="/collections">Coleções</Link>
            <Link to="/about">Sobre</Link>
          </nav>

          <Link to="/home" className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="https://i.imgur.com/GpB2cuj.png"
              alt="MarvelFlix"
              className="h-12 md:h-14 lg:h-16 w-auto mx-auto"
            />
          </Link>

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

      {isMenuOpen && (
        <div className="bg-marvelDark text-white py-4 shadow-md mt-16">
          <nav className="flex flex-col items-center space-y-4">
            <Link to="/home">Home</Link>
            <Link to="/collections">Coleções</Link>
            <Link to="/about">Sobre</Link>
          </nav>
        </div>
      )}

      <div className="pt-16 bg-marvelDark"></div>
    </>
  );
};

export default Header;
