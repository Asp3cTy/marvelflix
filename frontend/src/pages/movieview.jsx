// src/pages/movieview.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const MovieView = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    // Primeiro, buscar informações do filme
    axios
      .get(`${API_URL}/api/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data);

        // Depois, buscar a URL segura (se quiser)
        return axios.get(`${API_URL}/api/movies/secure-video/${movieId}`);
      })
      .then((response) => {
        setVideoUrl(response.data.secureUrl);
      })
      .catch((error) => {
        console.error("Erro ao buscar informações do filme:", error);
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
        {movie ? `Assistindo: ${movie.title}` : "Carregando..."}
      </h1>

      {videoUrl ? (
        <div className="flex justify-center mt-6">
          <iframe
            src={videoUrl}
            className="w-full sm:w-[640px] sm:h-[360px] md:w-[800px] md:h-[450px] lg:w-[1280px] lg:h-[720px] border-none rounded-lg shadow-lg"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-gray-400 mt-6 text-center">Carregando vídeo...</p>
      )}

      {movie && (
        <p className="mt-4 text-gray-300 text-lg">Duração: {movie.duration}</p>
      )}
    </div>
  );
};

export default MovieView;
