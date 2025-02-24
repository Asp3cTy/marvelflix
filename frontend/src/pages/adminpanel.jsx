import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("collections");
  const [collections, setCollections] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [newCollection, setNewCollection] = useState({ name: "", image: "" });

  useEffect(() => {
    if (activeTab === "collections") {
      fetchCollections();
      fetchThumbnails();
    }
  }, [activeTab]);

  const fetchCollections = () => {
    axios.get(`${API_URL}/api/collections`)
      .then(res => setCollections(res.data))
      .catch(err => console.error("Erro ao carregar coleções:", err));
  };

  const fetchThumbnails = () => {
    axios.get(`${API_URL}/api/thumbnails`)
      .then(res => setThumbnails(res.data))
      .catch(err => console.error("Erro ao buscar thumbnails:", err));
  };

  const handleCollectionSubmit = () => {
    if (!newCollection.name || !newCollection.image) {
      alert("Nome e imagem são obrigatórios.");
      return;
    }

    axios.post(`${API_URL}/api/collections/add`, newCollection)
      .then(() => {
        fetchCollections();
        setNewCollection({ name: "", image: "" });
        alert("Coleção adicionada com sucesso!");
      })
      .catch(err => console.error("Erro ao adicionar coleção:", err));
  };

  return (
    <div className="p-4 bg-marvelDark text-white min-h-screen">
      <h1 className="text-3xl mb-6 font-bold text-center text-red-500">Painel Administrativo</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button onClick={() => setActiveTab("collections")} className={`px-4 py-2 rounded ${activeTab === "collections" ? "bg-red-600" : "bg-gray-700"}`}>Coleções</button>
        <button onClick={() => setActiveTab("movies")} className={`px-4 py-2 rounded ${activeTab === "movies" ? "bg-red-600" : "bg-gray-700"}`}>Filmes</button>
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-red-600" : "bg-gray-700"}`}>Usuários</button>
      </div>

      {/* Aba de Coleções */}
      {activeTab === "collections" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Coleções</h2>
          <div className="mb-4 space-y-2">
            {collections.map(col => (
              <div key={col.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{col.name}</span>
                <img src={`${API_URL}/thumbnails/${col.image}`} alt={col.name} className="h-12 w-12 object-cover rounded" />
              </div>
            ))}
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">Nova Coleção</h3>
            <input
              type="text"
              placeholder="Nome da coleção"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newCollection.name}
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            />

            <select
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={newCollection.image}
              onChange={(e) => setNewCollection({ ...newCollection, image: e.target.value })}
            >
              <option value="">Selecione uma imagem</option>
              {thumbnails.map((thumb) => (
                <option key={thumb} value={thumb}>{thumb}</option>
              ))}
            </select>

            <button onClick={handleCollectionSubmit} className="bg-green-600 px-4 py-2 rounded">Criar Coleção</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
