// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("collections"); 
  // "collections" | "movies" | "users"

  // ========== ESTADOS ==========

  // Coleções
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null); 
  // se for null -> criando nova; senão -> editando
  const [collectionName, setCollectionName] = useState("");
  const [collectionImage, setCollectionImage] = useState(null);

  // Filmes
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieData, setMovieData] = useState({
    title: "",
    collection_id: "",
    url: "",
    cover_url: "",
    duration: ""
  });
  // Thumbnails, caso queira exibir um <select> com arquivos
  const [thumbnails, setThumbnails] = useState([]);

  // Usuários
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // Mensagens
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ========== CARREGAR DADOS QUANDO MUDA A ABA ==========

  useEffect(() => {
    setMessage("");
    setError("");

    if (activeTab === "collections") {
      fetchCollections();
    } else if (activeTab === "movies") {
      fetchMovies();
      fetchThumbnails(); // se quiser exibir uma lista p/ cover_url
      fetchCollections(); // para poder escolher a qual coleção pertence
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // ========== FUNÇÕES DE FETCH ==========

  const fetchCollections = () => {
    axios
      .get(`${API_URL}/api/collections`)
      .then((res) => setCollections(res.data))
      .catch((err) => setError("Erro ao carregar coleções."));
  };

  const fetchMovies = () => {
    // Se quiser listar todos, dependendo da sua API 
    // p. ex. GET /api/movies?all=true
    axios
      .get(`${API_URL}/api/movies?collection_id=ALL`) 
      .then((res) => setMovies(res.data))
      .catch((err) => setError("Erro ao carregar filmes."));
  };

  const fetchThumbnails = () => {
    // Se você tiver /api/thumbnails
    axios
      .get(`${API_URL}/api/thumbnails`)
      .then((res) => setThumbnails(res.data))
      .catch((err) => console.error("Erro ao buscar thumbnails:", err));
  };

  const fetchUsers = () => {
    axios
      .get(`${API_URL}/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => setError("Erro ao carregar usuários."));
  };

  // ========== ABA COLEÇÕES ==========

  const handleCreateCollection = () => {
    setEditingCollection(null);
    setCollectionName("");
    setCollectionImage(null);
  };

  const handleEditCollection = (col) => {
    setEditingCollection(col);
    setCollectionName(col.name || "");
    // Se não quiser mudar a imagem, pode deixar. Se quiser trocar, carrega.
    setCollectionImage(null);
  };

  const handleDeleteCollection = (id) => {
    axios
      .delete(`${API_URL}/api/collections/${id}`)
      .then(() => {
        setMessage("Coleção excluída com sucesso!");
        fetchCollections();
      })
      .catch((err) => setError("Erro ao excluir coleção."));
  };

  const handleSubmitCollection = () => {
    if (!collectionName.trim()) {
      setError("Digite o nome da coleção.");
      return;
    }

    const formData = new FormData();
    formData.append("name", collectionName);
    if (collectionImage) {
      formData.append("image", collectionImage);
    }

    if (editingCollection) {
      // EDITAR
      axios
        .put(`${API_URL}/api/collections/${editingCollection.id}`, formData)
        .then(() => {
          setMessage("Coleção atualizada com sucesso!");
          setEditingCollection(null);
          setCollectionName("");
          setCollectionImage(null);
          fetchCollections();
        })
        .catch((err) => setError("Erro ao atualizar coleção."));
    } else {
      // CRIAR
      axios
        .post(`${API_URL}/api/collections`, formData)
        .then(() => {
          setMessage("Coleção criada com sucesso!");
          setCollectionName("");
          setCollectionImage(null);
          fetchCollections();
        })
        .catch((err) => setError("Erro ao criar coleção."));
    }
  };

  // ========== ABA FILMES ==========

  const handleCreateMovie = () => {
    setEditingMovie(null);
    setMovieData({
      title: "",
      collection_id: "",
      url: "",
      cover_url: "",
      duration: ""
    });
  };

  const handleEditMovie = (mov) => {
    setEditingMovie(mov);
    setMovieData({
      title: mov.title || "",
      collection_id: mov.collection_id || "",
      url: mov.url || "",
      cover_url: mov.cover_url || "",
      duration: mov.duration || ""
    });
  };

  const handleDeleteMovie = (id) => {
    axios
      .delete(`${API_URL}/api/movies/${id}`)
      .then(() => {
        setMessage("Filme excluído com sucesso!");
        fetchMovies();
      })
      .catch((err) => setError("Erro ao excluir filme."));
  };

  const handleSubmitMovie = () => {
    if (!movieData.title || !movieData.collection_id) {
      setError("Preencha os campos obrigatórios de filme.");
      return;
    }
    if (editingMovie) {
      // EDITAR
      axios
        .put(`${API_URL}/api/movies/${editingMovie.id}`, movieData)
        .then(() => {
          setMessage("Filme atualizado com sucesso!");
          setEditingMovie(null);
          setMovieData({
            title: "",
            collection_id: "",
            url: "",
            cover_url: "",
            duration: ""
          });
          fetchMovies();
        })
        .catch((err) => setError("Erro ao atualizar filme."));
    } else {
      // CRIAR
      axios
        .post(`${API_URL}/api/movies`, movieData)
        .then(() => {
          setMessage("Filme criado com sucesso!");
          setMovieData({
            title: "",
            collection_id: "",
            url: "",
            cover_url: "",
            duration: ""
          });
          fetchMovies();
        })
        .catch((err) => setError("Erro ao criar filme."));
    }
  };

  // ========== ABA USUÁRIOS ==========

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserEmail(user.email || "");
    setUserPassword(""); // se quiser trocar a senha
  };

  const handleDeleteUser = (id) => {
    axios
      .delete(`${API_URL}/api/users/${id}`)
      .then(() => {
        setMessage("Usuário excluído com sucesso!");
        fetchUsers();
      })
      .catch((err) => setError("Erro ao excluir usuário."));
  };

  const handleSaveUser = () => {
    if (!userEmail) {
      setError("Digite o email do usuário.");
      return;
    }
    const updateData = { email: userEmail };
    if (userPassword) {
      updateData.password = userPassword;
    }
    axios
      .put(`${API_URL}/api/users/${editingUser.id}`, updateData)
      .then(() => {
        setMessage("Usuário atualizado com sucesso!");
        setEditingUser(null);
        setUserEmail("");
        setUserPassword("");
        fetchUsers();
      })
      .catch((err) => setError("Erro ao atualizar usuário."));
  };

  // ========== RENDER ==========

  return (
    <div className="p-4 bg-marvelDark text-white min-h-screen">
      <h1 className="text-3xl mb-6 font-bold text-center text-red-500">
        Painel Administrativo
      </h1>

      {/* Navegação de abas */}
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
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-red-600" : "bg-gray-700"}`}
        >
          Usuários
        </button>
      </div>

      {message && <p className="text-green-500 text-center mb-3">{message}</p>}
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      {/* =========== ABA COLEÇÕES =========== */}
      {activeTab === "collections" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Coleções</h2>
          <div className="mb-4 space-y-2">
            {collections.map((col) => (
              <div key={col.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{col.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditCollection(col)}
                    className="bg-blue-500 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(col.id)}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form para criar/editar */}
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">
              {editingCollection ? "Editar Coleção" : "Nova Coleção"}
            </h3>
            <input
              type="text"
              placeholder="Nome da coleção"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            <input
              type="file"
              className="mb-2"
              onChange={(e) => setCollectionImage(e.target.files[0])}
            />
            <button
              onClick={handleSubmitCollection}
              className="bg-green-600 px-4 py-2 rounded"
            >
              {editingCollection ? "Salvar Alterações" : "Criar Coleção"}
            </button>
            {!editingCollection && (
              <button
                onClick={handleCreateCollection}
                className="ml-2 bg-gray-600 px-3 py-2 rounded"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========== ABA FILMES =========== */}
      {activeTab === "movies" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Filmes</h2>
          <div className="mb-4 space-y-2">
            {movies.map((mov) => (
              <div key={mov.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{mov.title}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditMovie(mov)}
                    className="bg-blue-500 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(mov.id)}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form criar/editar */}
          <div className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold mb-2">
              {editingMovie ? "Editar Filme" : "Novo Filme"}
            </h3>

            <input
              type="text"
              placeholder="Título"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={movieData.title}
              onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
            />

            {/* Escolher coleção */}
            <select
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={movieData.collection_id}
              onChange={(e) => setMovieData({ ...movieData, collection_id: e.target.value })}
            >
              <option value="">Selecione uma coleção</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="URL do vídeo"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={movieData.url}
              onChange={(e) => setMovieData({ ...movieData, url: e.target.value })}
            />

            {/* Se tiver thumbnails => combobox */}
            <select
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={movieData.cover_url}
              onChange={(e) => setMovieData({ ...movieData, cover_url: e.target.value })}
            >
              <option value="">Selecione uma Thumbnail</option>
              {thumbnails.map((thumb) => (
                <option key={thumb} value={thumb}>
                  {thumb}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Duração (ex: 2:04:11)"
              className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
              value={movieData.duration}
              onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
            />

            <button
              onClick={handleSubmitMovie}
              className="bg-green-600 px-4 py-2 rounded"
            >
              {editingMovie ? "Salvar Alterações" : "Adicionar Filme"}
            </button>
            {!editingMovie && (
              <button
                onClick={handleCreateMovie}
                className="ml-2 bg-gray-600 px-3 py-2 rounded"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========== ABA USUÁRIOS =========== */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Usuários</h2>
          <div className="mb-4 space-y-2">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                <span>{user.email}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-blue-500 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 px-2 py-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form editar usuário */}
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
              <button
                onClick={handleSaveUser}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserEmail("");
                  setUserPassword("");
                }}
                className="ml-2 bg-gray-600 px-3 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
