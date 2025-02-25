import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config"; // Defina sua API_URL corretamente

const Thumbnails = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/thumbnails`)
      .then(response => setImages(response.data))
      .catch(error => console.error("Erro ao carregar imagens:", error));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {images.map((image, index) => (
        <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={image.url}
            alt={`Thumbnail ${index}`}
            className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};

export default Thumbnails;
