import { useState } from "react";
import AuthModal from "../components/authmodal";

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* 🔹 Fundo com Imagens */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://i.imgur.com/9gVHaZV.jpg')" }}></div>

      {/* 🔹 Conteúdo Central */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">Filmes, séries e muito mais.</h1>
        <p className="mt-4 text-lg md:text-xl">Assista onde quiser. Cancele quando quiser.</p>

        {/* Botão para abrir modal de login */}
        <button 
          className="mt-6 px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Assistir Agora
        </button>
      </div>

      {/* 🔹 Modal de Login */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default LandingPage;
