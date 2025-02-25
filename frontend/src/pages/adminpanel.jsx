// src/pages/adminpanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const BUNNY_CDN_URL = "https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/"; // URL base do CDN
const BUNNY_ACCESS_KEY = "b2f191fc-22f3-4f2b-8836e5bd8b4d-f718-4270"; // Chave de acesso à API

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("collections");
  const [collections, setCollections] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [movies, setMovies] = useState([]);

  const [newMovie, setNewMovie] = useState({ title: "", collection_id: "", url: "", cover_url: "", duration: "" });

  useEffect(() => {
    if (activeTab === "collections") {
      fetchCollections();
      fetchThumbnailsFromCDN();
    } else if (activeTab === "movies") {
      fetchMovies();
      fetchCollections();
      fetchThumbnailsFromCDN();
    }
  }, [activeTab]);

  // ================ FETCH DATA ================
  const fetchCollections = () => {
    axios
      .get(`${API_URL}/api/collections`)
      .then(res => setCollections(res.data))
      .catch(() => setCollections([]));
  };

  const fetchMovies = () => {
    axios
      .get(`${API_URL}/api/movies`)
      .then(res => setMovies(res.data))
      .catch(() => setMovies([]));
  };

  // 🔹 Busca a lista de imagens diretamente do BunnyCDN
  const fetchThumbnailsFromCDN = async () => {
    try {
      const response = await axios.get(
        `https://br.storage.bunnycdn.com/marvelflix-assets/thumbnails/?accessKey=${BUNNY_ACCESS_KEY}`
      );

      if (Array.isArray(response.data)) {
        // Filtra apenas os nomes dos arquivos de imagem
        const images = response.data.map(item => item.ObjectName);
        setThumbnails(images);
      }
    } catch (error) {
      console.error("Erro ao buscar thumbnails do CDN:", error);
    }
  };

  // ================ FILMES ================
  const handleMovieSubmit = () => {
    if (!newMovie.title || !newMovie.collection_id || !newMovie.url || !newMovie.cover_url || !newMovie.duration) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const request = newMovie.id
      ? axios.put(`${API_URL}/api/movies/${newMovie.id}`, newMovie)
      : axios.post(`${API_URL}/api/movies/add`, newMovie);

    request
      .then(() => {
        fetchMovies();
        setNewMovie({ title: "", collection_id: "", url: "", cover_url: "", duration: "" });
        alert("Filme salvo com sucesso!");
      })
      .catch(err => {
        console.error("Erro ao salvar filme:", err);
        alert("Erro ao salvar filme");
      });
  };

  return (
    <div className="p-4 bg-marvelDark text-white min-h-screen">
      <h1 className="text-3xl mb-6 font-bold text-center text-red-500">Painel Administrativo</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => setActiveTab("collections")}
          className={`px-4 py-2 rounded ${activeTab === "collections" ? "bg-red-600" : "bg-gray-700"}`}
        >
          Coleções
        </button>
        <button
          onClick={() => setActiveTab("movies")}
          className={`px-4 py-2 rounded ${activeTab === "movies" ? "bg-red-600" : "bg-gray-700"}`}
        >
          Filmes
        </button>
      </div>

      {/* ================== FILMES ================== */}
      {activeTab === "movies" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Adicionar Filme</h2>
          <input
            type="text"
            placeholder="Título do Filme"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newMovie.title}
            onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
          />
          <select
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newMovie.collection_id}
            onChange={e => setNewMovie({ ...newMovie, collection_id: e.target.value })}
          >
            <option value="">Selecione uma Coleção</option>
            {collections.map(col => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="URL do Filme"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newMovie.url}
            onChange={e => setNewMovie({ ...newMovie, url: e.target.value })}
          />

          {/* 🔹 Selecionar imagem diretamente do BunnyCDN */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-300">Imagem de Capa:</label>
            <select
              className="w-full p-2 bg-gray-700 text-white rounded"
              value={newMovie.cover_url}
              onChange={e => setNewMovie({ ...newMovie, cover_url: e.target.value })}
            >
              <option value="">Selecione uma imagem</option>
              {thumbnails.map(thumb => (
                <option key={thumb} value={`${BUNNY_CDN_URL}${thumb}`}>
                  {thumb}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Mostrar prévia da imagem selecionada */}
          {newMovie.cover_url && (
            <div className="mb-4 flex justify-center">
              <img
                src={newMovie.cover_url}
                alt="Prévia da Capa"
                className="w-40 h-auto rounded-lg shadow-lg border border-gray-600"
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Duração"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newMovie.duration}
            onChange={e => setNewMovie({ ...newMovie, duration: e.target.value })}
          />
          <button
            id="movie-submit-button"
            onClick={handleMovieSubmit}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Adicionar Filme
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
