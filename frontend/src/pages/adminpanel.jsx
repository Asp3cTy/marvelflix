import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("collections");
  const [collections, setCollections] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCollection, setNewCollection] = useState({ name: "", image: "" });
  const [newMovie, setNewMovie] = useState({ title: "", collection_id: "", url: "", cover_url: "", duration: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    if (activeTab === "collections") {
      fetchCollections();
      fetchThumbnails();
    } else if (activeTab === "movies") {
      fetchMovies();
      fetchCollections();
      fetchThumbnails();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Buscar dados do backend
  const fetchCollections = () => axios.get(`${API_URL}/api/collections`).then(res => setCollections(res.data)).catch(() => setCollections([]));
  const fetchMovies = () => axios.get(`${API_URL}/api/movies`).then(res => setMovies(res.data)).catch(() => setMovies([]));
  const fetchUsers = () => axios.get(`${API_URL}/api/users`).then(res => setUsers(res.data)).catch(() => setUsers([]));
  const fetchThumbnails = () => axios.get(`${API_URL}/api/thumbnails`).then(res => setThumbnails(res.data)).catch(err => console.error("Erro ao buscar thumbnails:", err));

  // Criar nova coleção
  const handleCollectionSubmit = () => {
    if (!newCollection.name || !newCollection.image) {
      alert("Nome e imagem são obrigatórios.");
      return;
    }

    axios.post(`${API_URL}/api/collections`, newCollection)
      .then(() => {
        fetchCollections();
        setNewCollection({ name: "", image: "" });
        alert("Coleção adicionada com sucesso!");
      })
      .catch(err => console.error("Erro ao adicionar coleção:", err));
  };

  // Criar novo filme
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

  // Excluir usuário
  const handleDeleteUser = (id) => {
    axios.delete(`${API_URL}/api/users/${id}`)
      .then(() => {
        alert("Usuário excluído com sucesso!");
        fetchUsers();
      })
      .catch(err => alert("Erro ao excluir usuário: " + err.response.data.message));
  };

  // Editar usuário
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserEmail(user.email);
    setUserPassword("");
  };

  // Salvar usuário editado
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
          <input type="text" placeholder="Nome da coleção" className="w-full p-2 mb-2 bg-gray-700 text-white rounded" value={newCollection.name} onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })} />
          <select className="w-full p-2 mb-2 bg-gray-700 text-white rounded" value={newCollection.image} onChange={(e) => setNewCollection({ ...newCollection, image: e.target.value })}>
            <option value="">Selecione uma imagem</option>
            {thumbnails.map((thumb) => <option key={thumb} value={thumb}>{thumb}</option>)}
          </select>
          <button onClick={handleCollectionSubmit} className="bg-green-600 px-4 py-2 rounded">Criar Coleção</button>
        </div>
      )}

      {/* ========== Filmes ========== */}
      {activeTab === "movies" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Adicionar Filme</h2>
          <input type="text" placeholder="Título do Filme" className="w-full p-2 mb-2 bg-gray-700 text-white rounded" value={newMovie.title} onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })} />
          <select className="w-full p-2 mb-2 bg-gray-700 text-white rounded" value={newMovie.collection_id} onChange={(e) => setNewMovie({ ...newMovie, collection_id: e.target.value })}>
            <option value="">Selecione uma Coleção</option>
            {collections.map((col) => <option key={col.id} value={col.id}>{col.name}</option>)}
          </select>
          <button onClick={handleMovieSubmit} className="bg-green-600 px-4 py-2 rounded">Adicionar Filme</button>
        </div>
      )}

      {/* ========== Usuários ========== */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Usuários</h2>
          {users.map(user => (
            <div key={user.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
              <span>{user.email}</span>
              <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 px-2 py-1 rounded">Excluir</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
