// src/pages/collections.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/collections`)
      .then((response) => setCollections(response.data))
      .catch((error) => console.error("Erro ao buscar coleções:", error));
  }, []);

  return (
    <div className="bg-marvelDark min-h-screen text-white p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 p-6">
        {collections.map((collection) => {
          // Se 'collection.image' não for link absoluto, prefixa com API_URL
          const collectionImageUrl = collection?.image?.startsWith("http")
            ? collection.image
            : `${API_URL}${collection.image}`;

          return (
            <Link to={`/collection/${collection.id}`} key={collection.id}>
              <div className="relative group overflow-hidden rounded-lg shadow-lg">
                <img
                  src={collectionImageUrl}
                  alt={collection.name}
                  className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Collections;
