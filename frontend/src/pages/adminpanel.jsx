import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("collections");
  const [collections, setCollections] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ title: "", collection_id: "", url: "", cover_url: "", duration: "" });

  useEffect(() => {
    if (activeTab === "collections") {
      fetchCollections();
    } else if (activeTab === "movies") {
      fetchMovies();
      fetchCollections();
      fetchThumbnails();
    }
  }, [activeTab]);

  // Buscar Coleções
  const fetchCollections = () => {
    axios.get(`${API_URL}/api/collections`)
      .then(res => setCollections(res.data))
      .catch(() => setCollections([]));
  };

  // Buscar Filmes
  const fetchMovies = () => {
    axios.get(`${API_URL}/api/movies`)
      .then(res => setMovies(res.data))
      .catch(() => setMovies([]));
  };

  // Buscar Thumbnails (Imagens)
  const fetchThumbnails = () => {
    axios.get(`${API_URL}/api/thumbnails`)
      .then(res => setThumbnails(res.data))
      .catch(err => console.error("Erro ao buscar thumbnails:", err));
  };

  // Adicionar Filme
  const handleMovieSubmit = () => {
    if (!newMovie.title || !newMovie.collection_id || !newMovie.url || !newMovie.cover_url || !newMovie.duration) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    axios.post(`${API_URL}/api/movies/add`, newMovie)
      .then(() => {
        fetchMovies();
        setNewMovie({ title: "", collection_id: "", url: "", cover_url: "", duration: "" });
        alert("Filme adicionado com sucesso!");
      })
      .catch(err => console.error("Erro ao adicionar filme:", err));
  };

  return (
    <div className="p-4 bg-marvelDark text-white min-h-screen">
      <h1 className="text-3xl mb-6 font-bold text-center text-red-500">Painel Administrativo</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button onClick={() => setActiveTab("collections")} className={`px-4 py-2 rounded ${activeTab === "collections" ? "bg-red-600" : "bg-gray-700"}`}>Coleções</button>
        <button onClick={() => setActiveTab("movies")} className={`px-4 py-2 rounded ${activeTab === "movies" ? "bg-red-600" : "bg-gray-700"}`}>Filmes</button>
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-red-600" : "bg-gray-700"}`}>Usuários</button>
      </div>

      {/* ========== Aba de Filmes ========== */}
      {activeTab === "movies" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Filmes</h2>
          {movies.length === 0 ? (
            <p className="text-gray-400">Nenhum filme cadastrado.</p>
          ) : (
            movies.map(movie => (
              <div key={movie.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{movie.title} ({movie.duration})</span>
                <img src={`${API_URL}/thumbnails/${movie.cover_url}`} alt={movie.title} className="h-12 w-12 object-cover rounded" />
              </div>
            ))
          )}

          <div className="bg-gray-800 p-4 rounded mt-4">
            <h3 className="font-bold mb-2">Adicionar Filme</h3>
            <input
              type="text"
              placeholder="Título do Filme"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newMovie.title}
              onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            />

            <select
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newMovie.collection_id}
              onChange={(e) => setNewMovie({ ...newMovie, collection_id: e.target.value })}
            >
              <option value="">Selecione uma Coleção</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="URL do Filme"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newMovie.url}
              onChange={(e) => setNewMovie({ ...newMovie, url: e.target.value })}
            />

            <select
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newMovie.cover_url}
              onChange={(e) => setNewMovie({ ...newMovie, cover_url: e.target.value })}
            >
              <option value="">Selecione uma Capa</option>
              {thumbnails.map((thumb) => (
                <option key={thumb} value={thumb}>{thumb}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Duração (ex: 2h 15min)"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newMovie.duration}
              onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
            />

            <button onClick={handleMovieSubmit} className="bg-green-600 px-4 py-2 rounded">Adicionar Filme</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
