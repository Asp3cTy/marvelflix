// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


const Home = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/collections`)
      .then((response) => setCollections(response.data))
      .catch((error) => console.error("Erro ao buscar coleções:", error));
  }, []);

  return (
    <div className="bg-marvelDark min-h-screen text-white p-6">
      <h1 className="text-marvelRed text-4xl font-bold text-center">MarvelFlix</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
        {collections.map((collection) => (
          <Link to={`/collection/${collection.id}`} key={collection.id}>
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img
                src={collection.cover_url}
                alt={collection.name}
                className="w-full h-72 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-xl font-bold text-white text-center p-4">{collection.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
