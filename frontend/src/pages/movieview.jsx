// src/pages/movieview.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const MovieView = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Buscar informações do filme
    axios
      .get(`${API_URL}/api/movies/${movieId}`)
      .then(response => {
        setMovie(response.data);
        setLoadingMovie(false);
      })
      .catch(error => {
        console.error("Erro ao buscar informações do filme:", error);
        setError("Erro ao carregar os detalhes do filme.");
        setLoadingMovie(false);
      });

    // Buscar URL segura do vídeo
    axios
      .get(`${API_URL}/api/movies/secure-video/${movieId}`)
      .then(response => {
        setVideoUrl(response.data.secureUrl);
        setLoadingVideo(false);
      })
      .catch(error => {
        console.error("Erro ao buscar URL segura do vídeo:", error);
        setError("Erro ao carregar o vídeo.");
        setLoadingVideo(false);
      });
  }, [movieId]);

  return (
    <div className="p-10 bg-marvelDark min-h-screen text-white text-center">
      <div className="fixed top-4 left-4">
        <button
          onClick={() => window.history.back()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
        >
          ⬅ Voltar
        </button>
      </div>

      <h1 className="text-3xl font-bold text-red-600 mt-16">
        {loadingMovie ? "Carregando..." : movie ? `Assistindo: ${movie.title}` : "Filme não encontrado"}
      </h1>

      {/* Exibir erros caso existam */}
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {/* Player de vídeo */}
      {!error && videoUrl && !loadingVideo ? (
        <div className="flex justify-center mt-6">
          <iframe
            src={videoUrl}
            className="w-full sm:w-[640px] sm:h-[360px] md:w-[800px] md:h-[450px] lg:w-[1280px] lg:h-[720px] border-none rounded-lg shadow-lg"
            allowFullScreen
          />
        </div>
      ) : (
        !error && <p className="text-gray-400 mt-6 text-center">Carregando vídeo...</p>
      )}

      {/* Exibir duração do filme */}
      {movie && !loadingMovie && (
        <p className="mt-4 text-gray-300 text-lg">Duração: {movie.duration}</p>
      )}
    </div>
  );
};

export default MovieView;
