import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config"; 


const CollectionView = () => {
    const { collectionId } = useParams();
    const [collection, setCollection] = useState(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {

      axios.get(`${API_URL}/api/collections/${collectionId}`)
          .then(response => {
              setCollection(response.data);
          })
          .catch(error => {
              console.error("Erro ao buscar coleção:", error);
          });

        // Buscar filmes da coleção
        axios.get(`${API_URL}/api/movies?collection_id=${collectionId}`)
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar filmes:", error);
            });

    }, [collectionId]);

    return (
      <div className="p-10 text-white text-center bg-marvelDark min-h-screen">
              <div className="fixed top-4 left-4 mb-10">
                  <button 
                      onClick={() => window.location.href = "/"} 
                      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition">
                      ⬅ Voltar para Home
                  </button>
              </div>


                <h1 className="text-3xl font-bold text-red-600">
                    {collection?.name || "Carregando..."}
                </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
              {movies.map(movie => (
                  <div key={movie.id} className="flex flex-col items-center">
                      {/* Card do Filme */}
                      <div className="relative group w-[220px] h-[330px] rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                          <img 
                              src={movie.cover_url} 
                              alt={movie.title} 
                              className="w-full h-full object-cover"
                          />
  
                          {/* Overlay no hover */}
                          <div
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              onClick={() => window.location.href = `/movie/${movie.id}`}
                          >
                              <button className="bg-red-600 text-red-600 p-4 rounded-full text-2xl font-bold transition-transform duration-300 hover:scale-110">
                                  ▶
                              </button>
                          </div>
                      </div>
  
                      {/* Título do Filme */}
                      <p className="mt-2 text-lg font-bold text-white text-center">
                          {movie.title}
                      </p>
                  </div>
              ))}
          </div>
      </div>
  );
  
  
};

export default CollectionView;
