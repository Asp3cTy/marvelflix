// src/pages/adminpanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  // Para carregar a lista de coleções já existentes, e a lista de thumbnails (se quiser)
  const [collections, setCollections] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  // Campos para criar nova coleção
  const [newCollection, setNewCollection] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Campos para inserir novo filme
  const [movie, setMovie] = useState({
    title: "",
    collection_id: "",
    url: "",
    cover_url: "",
    duration: ""
  });

  // Mensagens de feedback
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1) Carrega coleções e thumbnails existentes ao montar
  useEffect(() => {
    // Como não tem token, chamamos sem headers
    Promise.all([
      axios.get(`${API_URL}/api/collections`),
      axios.get(`${API_URL}/api/thumbnails`)
    ])
    .then(([collectionsRes, thumbnailsRes]) => {
      setCollections(collectionsRes.data);
      setThumbnails(thumbnailsRes.data);
    })
    .catch(err => {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar coleções/thumbnails.");
    });
  }, []);

  // 2) Quando selecionar arquivo de imagem para nova coleção
  const handleCollectionImage = (e) => {
    const file = e.target.files[0];
    setCollectionImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // 3) Função para criar uma nova coleção
  const addCollection = () => {
    setMessage("");
    setError("");

    if (!newCollection.trim() || !collectionImage) {
      setError("Preencha todos os campos para criar uma coleção!");
      return;
    }

    // Monta formData com nome + arquivo
    const formData = new FormData();
    formData.append("name", newCollection);
    formData.append("image", collectionImage);

    axios.post(`${API_URL}/api/collections/add`, formData)
      .then(response => {
        // Atualiza lista de coleções
        const { id, imageUrl } = response.data;
        setCollections([...collections, {
          id,
          name: newCollection,
          image: imageUrl
        }]);

        // Limpa campos
        setNewCollection("");
        setCollectionImage(null);
        setPreviewImage(null);
        setMessage("Coleção adicionada com sucesso!");
      })
      .catch(err => {
        console.error("Erro ao adicionar coleção:", err);
        setError("Erro ao criar coleção!");
      });
  };

  // 4) Função para adicionar filme
  const addMovie = () => {
    setMessage("");
    setError("");

    if (!movie.title || !movie.collection_id || !movie.url || !movie.cover_url || !movie.duration) {
      setError("Preencha todos os campos para adicionar um filme!");
      return;
    }

    // Se quiser que o cover_url seja algo do tipo /thumbnails/XYZ, podemos tratar
    const movieData = {
      ...movie,
      cover_url: `${API_URL}/thumbnails/${movie.cover_url}`
    };

    axios.post(`${API_URL}/api/movies/add`, movieData)
      .then(() => {
        setMessage("Filme adicionado com sucesso!");
        // Limpar campos
        setMovie({
          title: "",
          collection_id: "",
          url: "",
          cover_url: "",
          duration: ""
        });
      })
      .catch(err => {
        console.error("Erro ao adicionar filme:", err);
        setError("Erro ao adicionar filme!");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-marvelDark text-white">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">Painel Administrativo</h1>

        {message && <p className="text-green-500 text-center mb-3">{message}</p>}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* Seção de criar nova coleção */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Adicionar Nova Coleção</h2>
          <input
            type="text"
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            placeholder="Nome da nova coleção"
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="Pré-visualização"
              className="w-32 h-32 mt-2 rounded-lg mx-auto"
            />
          )}

          <input
            type="file"
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            accept="image/*"
            onChange={handleCollectionImage}
          />

          <button
            className="mt-2 p-2 bg-green-600 hover:bg-green-500 rounded text-white w-full"
            onClick={addCollection}
          >
            Criar Coleção
          </button>
        </div>

        {/* Seção de adicionar novo filme */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Adicionar Novo Filme</h2>
          <input
            type="text"
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            placeholder="Nome do Filme"
            value={movie.title}
            onChange={(e) => setMovie({ ...movie, title: e.target.value })}
          />

          <select
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            value={movie.collection_id}
            onChange={(e) => setMovie({ ...movie, collection_id: e.target.value })}
          >
            <option value="">Selecione uma Coleção</option>
            {Array.isArray(collections) && collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            placeholder="ID do Vídeo (ex: bunnyStream, etc.)"
            value={movie.url}
            onChange={(e) => setMovie({ ...movie, url: e.target.value })}
          />

          <select
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            value={movie.cover_url}
            onChange={(e) => setMovie({ ...movie, cover_url: e.target.value })}
          >
            <option value="">Selecione uma Thumbnail</option>
            {Array.isArray(thumbnails) && thumbnails.map((thumb) => (
              <option key={thumb} value={thumb}>{thumb}</option>
            ))}
          </select>

          <input
            type="text"
            className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
            placeholder="Duração do Filme (ex: 2:04:11)"
            value={movie.duration}
            onChange={(e) => setMovie({ ...movie, duration: e.target.value })}
          />

          <button
            className="mt-4 p-2 bg-blue-600 hover:bg-blue-500 rounded text-white w-full"
            onClick={addMovie}
          >
            Adicionar Filme
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
