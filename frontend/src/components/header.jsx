import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import AuthModal from "./authmodal";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  return (
    <>
      <header className="bg-marvelDark text-white p-4">
        <nav className="flex space-x-4">
          <Link to="/home">Home</Link>
          {/* Exemplo: se isAdmin, mostra link Admin */}
          {isAdmin && <Link to="/admin">Painel</Link>}
        </nav>

        {user ? (
          <div>
            <span>Logado como: {user.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setModalOpen(true)}>Login</button>
        )}
      </header>

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Header;
