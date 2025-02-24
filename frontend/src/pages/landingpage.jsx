import React, { useState } from "react";
import { useAuth } from "../context/authcontext";
import AuthModal from "../components/authmodal";

const LandingPage = () => {
  const { authToken } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Se, por algum motivo, a rota ainda estiver em "/", mas o usuário tem token, não mostramos nada
  if (authToken) {
    return null;
  }

  const handleOpenModal = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://i.imgur.com/cVmpyDI.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative z-10 text-center max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-lg md:text-xl mb-6">Sign up now and start your journey!</p>

        <button
          onClick={handleOpenModal}
          className="bg-red-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
        >
          Assistir Agora
        </button>
      </div>

      {/* Modal de Autenticação */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default LandingPage;
