// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/collections");
  };

  return (
    <div className="bg-marvelDark min-h-screen text-white relative flex flex-col items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: 'url("https://i.postimg.cc/gj9y4WYc/bg-home-upscayl-3x-high-fidelity-4x.png")' }}
      ></div>
      <div className="absolute inset-0 bg-marvelDark opacity-70"></div>
      <div className="relative z-10 p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bem-vindo ao MarvelFlix!</h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8">
          Descubra e assista a uma vasta coleção de filmes e séries do universo Marvel. Explore nossas coleções e encontre seus favoritos!
        </p>
        <button
          onClick={handleExplore}
          className="bg-red-600 px-6 py-3 rounded-lg text-lg md:text-xl font-semibold hover:bg-red-700 transition mx-auto"
        >
          Explorar Coleções
        </button>
      </div>
    </div>
  );
};

export default Home;
