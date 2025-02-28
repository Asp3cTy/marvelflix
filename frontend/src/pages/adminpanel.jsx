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

  const fetchUsers = () => {
    axios
      .get(`${API_URL}/api/users`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  const fetchThumbnails = () => {
        axios
      .get(`${API_URL}/api/thumbnails-bunny`)
      .then((res) => setThumbnails(res.data))
      .catch(err => console.error("Erro ao buscar thumbnails:", err));

  };

  // ================ COLEÇÕES ================
  const handleCollectionSubmit = () => {
    if (!newCollection.name || !newCollection.image) {
      alert("Nome e imagem são obrigatórios.");
      return;
    }

    // Se tiver "newCollection.id", edita (PUT), senão cria (POST)
    const request = newCollection.id
      ? axios.put(`${API_URL}/api/collections/${newCollection.id}`, newCollection)
      : axios.post(`${API_URL}/api/collections`, newCollection);

    request
      .then(() => {
        fetchCollections();
        setNewCollection({ name: "", image: "" });
        alert("Coleção salva com sucesso!");

        // Se existir o botão, muda o texto para "Criar Coleção"
        const collectionBtn = document.getElementById("collection-submit-button");
        if (collectionBtn) collectionBtn.innerText = "Criar Coleção";
      })
      .catch(err => {
        console.error("Erro ao salvar coleção:", err);
        alert("Erro ao salvar coleção");
      });
  };

  const handleDeleteCollection = (id) => {
    axios
      .delete(`${API_URL}/api/collections/${id}`)
      .then(() => {
        alert("Coleção excluída com sucesso!");
        fetchCollections();
      })
      .catch(err => {
        const msg = err.response?.data?.message || "Erro ao excluir coleção.";
        alert(msg);
      });
  };

  const handleEditCollection = (collection) => {
    setNewCollection(collection);

    // Se existir o botão, muda o texto para "Editar Coleção"
    const collectionBtn = document.getElementById("collection-submit-button");
    if (collectionBtn) collectionBtn.innerText = "Editar Coleção";
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

        const movieBtn = document.getElementById("movie-submit-button");
        if (movieBtn) movieBtn.innerText = "Adicionar Filme";
      })
      .catch(err => {
        console.error("Erro ao salvar filme:", err);
        alert("Erro ao salvar filme");
      });
  };

  const handleDeleteMovie = (id) => {
    axios
      .delete(`${API_URL}/api/movies/${id}`)
      .then(() => {
        alert("Filme excluído com sucesso!");
        fetchMovies();
      })
      .catch(err => {
        const msg = err.response?.data?.message || "Erro ao excluir filme.";
        alert(msg);
      });
  };

  const handleEditMovie = (movie) => {
    setNewMovie(movie);

    // Se existir o botão, muda o texto para "Editar Filme"
    const movieBtn = document.getElementById("movie-submit-button");
    if (movieBtn) movieBtn.innerText = "Editar Filme";
  };

  // ================ USUÁRIOS ================
  const handleDeleteUser = (id) => {
    axios
      .delete(`${API_URL}/api/users/${id}`)
      .then(() => {
        alert("Usuário excluído com sucesso!");
        fetchUsers();
      })
      .catch(err => {
        const msg = err.response?.data?.message || "Erro ao excluir usuário.";
        alert(msg);
      });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserEmail(user.email);
    setUserPassword("");
  };

  const handleSaveUser = () => {
    if (!userEmail) {
      alert("O email não pode estar vazio.");
      return;
    }

    const updateData = { email: userEmail };
    if (userPassword) {
      updateData.password = userPassword;
    }

    axios
      .put(`${API_URL}/api/users/${editingUser.id}`, updateData)
      .then(() => {
        alert("Usuário atualizado com sucesso!");
        setEditingUser(null);
        setUserEmail("");
        setUserPassword("");
        fetchUsers();
      })
      .catch(err => {
        const msg = err.response?.data?.message || "Erro ao atualizar usuário.";
        alert(msg);
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
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-red-600" : "bg-gray-700"}`}
        >
          Usuários
        </button>
      </div>

      {/* ================== COLEÇÕES ================== */}
      {activeTab === "collections" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Coleções</h2>
          {collections.map(collection => (
            <div
              key={collection.id}
              className="bg-gray-800 p-2 rounded flex justify-between items-center mb-2"
            >
              <span>{collection.name}</span>
              <div>
                <button
                  onClick={() => handleEditCollection(collection)}
                  className="bg-blue-500 px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCollection(collection.id)}
                  className="bg-red-500 px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}

          <input
            type="text"
            placeholder="Nome da coleção"
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newCollection.name}
            onChange={e => setNewCollection({ ...newCollection, name: e.target.value })}
          />
          <select
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newCollection.image}
            onChange={e => setNewCollection({ ...newCollection, image: e.target.value })}
          >
            <option value="">Selecione uma imagem</option>
            {thumbnails.map(thumb => (
              <option key={thumb} value={thumb}>
                {thumb}
              </option>
            ))}
          </select>
          <button
            id="collection-submit-button"
            onClick={handleCollectionSubmit}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Criar Coleção
          </button>
        </div>
      )}

      {/* ================== FILMES ================== */}
      {activeTab === "movies" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Filmes</h2>
          {movies.map(movie => (
            <div
              key={movie.id}
              className="bg-gray-800 p-2 rounded flex justify-between items-center mb-2"
            >
              <span>{movie.title}</span>
              <div>
                <button
                  onClick={() => handleEditMovie(movie)}
                  className="bg-blue-500 px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="bg-red-500 px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}

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
          <select
            className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
            value={newMovie.cover_url}
            onChange={e => setNewMovie({ ...newMovie, cover_url: e.target.value })}
          >
            <option value="">Selecione uma imagem de capa</option>
            {thumbnails.map(thumb => (
              <option key={thumb} value={thumb}>
                {thumb}
              </option>
            ))}
          </select>
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

      {/* ================== USUÁRIOS ================== */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-xl font-bold mb-2">Lista de Usuários</h2>
          {users.map(user => (
            <div
              key={user.id}
              className="bg-gray-800 p-2 rounded flex justify-between items-center mb-2"
            >
              <span>{user.email}</span>
              <div>
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-blue-500 px-2 py-1 rounded mr-2"
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
          {editingUser && (
            <div className="bg-gray-800 p-4 rounded mt-4">
              <h3 className="text-xl mb-2">Editar Usuário</h3>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                value={userPassword}
                onChange={e => setUserPassword(e.target.value)}
              />
              <button onClick={handleSaveUser} className="bg-green-600 px-4 py-2 rounded">
                Salvar
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-red-600 px-4 py-2 rounded ml-2"
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
