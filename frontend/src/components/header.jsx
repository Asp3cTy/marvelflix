import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./authmodal";
import { useAuth } from "../context/authcontext";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-marvelDark text-white p-4">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/collections">Coleções</Link>

        {/* Se for admin, mostra o botão. */}
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

      {modalOpen && <AuthModal onClose={() => setModalOpen(false)} />}
    </header>
  );
};

export default Header;
