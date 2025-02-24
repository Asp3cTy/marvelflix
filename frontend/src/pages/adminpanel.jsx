import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("collections");
  const [collections, setCollections] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [newCollection, setNewCollection] = useState({ name: "", image: "" });

  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    if (activeTab === "collections") {
      fetchCollections();
      fetchThumbnails();
    } else if (activeTab === "movies") {
      fetchMovies();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Buscar Coleções
  const fetchCollections = () => {
    axios.get(`${API_URL}/api/collections`)
      .then(res => setCollections(res.data))
      .catch(() => setCollections([])); 
  };

  // Buscar Thumbnails (Imagens)
  const fetchThumbnails = () => {
    axios.get(`${API_URL}/api/thumbnails`)
      .then(res => setThumbnails(res.data))
      .catch(err => console.error("Erro ao buscar thumbnails:", err));
  };

  // Buscar Filmes
  const fetchMovies = () => {
    axios.get(`${API_URL}/api/movies?collection_id=ALL`)
      .then(res => setMovies(res.data))
      .catch(() => setMovies([])); 
  };

  // Buscar Usuários
  const fetchUsers = () => {
    axios.get(`${API_URL}/api/users`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([])); 
  };

  // Criar Coleção
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

  // Excluir Usuário
  const handleDeleteUser = (id) => {
    axios.delete(`${API_URL}/api/users/${id}`)
      .then(() => {
        alert("Usuário excluído com sucesso!");
        fetchUsers();
      })
      .catch(err => alert("Erro ao excluir usuário: " + err.response.data.message));
  };

  // Editar Usuário
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserEmail(user.email);
    setUserPassword("");
  };

  // Salvar Alterações do Usuário
  const handleSaveUser = () => {
    if (!userEmail) {
      alert("O email não pode estar vazio.");
      return;
    }

    const updateData = { email: userEmail };
    if (userPassword) {
      updateData.password = userPassword;
    }

    axios.put(`${API_URL}/api/users/${editingUser.id}`, updateData)
      .then(() => {
        alert("Usuário atualizado com sucesso!");
        setEditingUser(null);
        setUserEmail("");
        setUserPassword("");
        fetchUsers();
      })
      .catch(err => alert("Erro ao atualizar usuário: " + err.response.data.message));
  };

  return (
    <div className="p-4 bg-marvelDark text-white min-h-screen">
      <h1 className="text-3xl mb-6 font-bold text-center text-red-500">Painel Administrativo</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button onClick={() => setActiveTab("collections")} className={`px-4 py-2 rounded ${activeTab === "collections" ? "bg-red-600" : "bg-gray-700"}`}>Coleções</button>
        <button onClick={() => setActiveTab("movies")} className={`px-4 py-2 rounded ${activeTab === "movies" ? "bg-red-600" : "bg-gray-700"}`}>Filmes</button>
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-red-600" : "bg-gray-700"}`}>Usuários</button>
      </div>

      {/* ========== Coleções ========== */}
      {activeTab === "collections" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Coleções</h2>
          {collections.length === 0 ? (
            <p className="text-gray-400">Nenhuma coleção cadastrada.</p>
          ) : (
            collections.map(col => (
              <div key={col.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{col.name}</span>
                <img src={`${API_URL}/thumbnails/${col.image}`} alt={col.name} className="h-12 w-12 object-cover rounded" />
              </div>
            ))
          )}

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

      {/* ========== Usuários ========== */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Usuários</h2>
          {users.length === 0 ? (
            <p className="text-gray-400">Nenhum usuário cadastrado.</p>
          ) : (
            users.map(user => (
              <div key={user.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{user.email}</span>
                <div className="space-x-2">
                  <button onClick={() => handleEditUser(user)} className="bg-blue-500 px-2 py-1 rounded">Editar</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 px-2 py-1 rounded">Excluir</button>
                </div>
              </div>
            ))
          )}

          {editingUser && (
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-bold mb-2">Editar Usuário</h3>
              <input
                type="text"
                placeholder="Email"
                className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nova senha (opcional)"
                className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <button onClick={handleSaveUser} className="bg-green-600 px-4 py-2 rounded">Salvar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
