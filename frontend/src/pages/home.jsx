// src/pages/home.jsx
import React from "react";

const Home = () => {
  return (
    <div className="bg-marvelDark min-h-screen text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Bem-vindo ao MarvelFlix!</h1>
      <p className="text-lg md:text-2xl max-w-2xl text-center mb-8">
        Descubra e assista a uma vasta coleção de filmes e séries do universo Marvel. Explore nossas coleções e encontre seus favoritos!
      </p>
      <img
        src="https://i.imgur.com/GpB2cuj.png"
        alt="MarvelFlix"
        className="h-24 md:h-32 lg:h-40 w-auto mx-auto mb-8"
      />
      <button className="bg-red-600 px-6 py-3 rounded-lg text-lg md:text-xl font-semibold hover:bg-red-700 transition">
        Explorar Coleções
      </button>
    </div>
  );
};

export default Home;