import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


const AdminPanel = () => {
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // 🚨 Redireciona para login se não estiver autenticado
    useEffect(() => {
        if (!authToken) {
            navigate("/login");
        }
    }, [authToken, navigate]);

    const [collections, setCollections] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [newCollection, setNewCollection] = useState("");
    const [collectionImage, setCollectionImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [movie, setMovie] = useState({
        title: "",
        collection_id: "",
        url: "",
        cover_url: "",
        duration: ""
    });

    useEffect(() => {
        const config = { headers: { Authorization: `Bearer ${authToken}` } };

        Promise.all([
            axios.get("${API_URL}/api/collections", config),
            axios.get("${API_URL}/api/thumbnails", config)
        ])
        .then(([collectionsResponse, thumbnailsResponse]) => {
            setCollections(collectionsResponse.data);
            setThumbnails(thumbnailsResponse.data);
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
        });
    }, [authToken]);

    // 🖼️ Capturar a imagem e gerar preview
    const handleCollectionImage = (e) => {
        const file = e.target.files[0];
        setCollectionImage(file);
        setPreviewImage(URL.createObjectURL(file)); // Exibir pré-visualização da imagem
    };

    // 🔹 Adicionar Nova Coleção
    const addCollection = () => {
        if (!newCollection.trim() || !collectionImage) {
            setError("Preencha todos os campos para criar uma coleção!");
            return;
        }

        const formData = new FormData();
        formData.append("name", newCollection);
        formData.append("image", collectionImage);

        axios.post("${API_URL}/api/collections/add", formData, {
            headers: { 
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data"
            }
        })
        .then(response => {
            setCollections([...collections, { id: response.data.id, name: newCollection, image_url: response.data.image_url }]);
            setNewCollection("");
            setCollectionImage(null);
            setPreviewImage(null);
            setMessage("Coleção adicionada com sucesso!");
            setError("");
        })
        .catch(error => {
            console.error("Erro ao adicionar coleção:", error);
            setError("Erro ao criar coleção!");
        });
    };

    // 🔹 Adicionar Novo Filme
    const addMovie = () => {
        if (!movie.title || !movie.collection_id || !movie.url || !movie.cover_url || !movie.duration) {
            setError("Preencha todos os campos para adicionar um filme!");
            return;
        }

        const movieData = {
            ...movie,
            cover_url: `${API_URL}/thumbnails/${movie.cover_url}`
        };

        axios.post("${API_URL}/api/movies/add", movieData, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
        .then(() => {
            setMessage("Filme adicionado com sucesso!");
            setError("");
            setMovie({ title: "", collection_id: "", url: "", cover_url: "", duration: "" });
        })
        .catch(error => {
            console.error("Erro ao adicionar filme:", error);
            setError("Erro ao adicionar filme!");
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-marvelDark text-white">
            <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">Painel Administrativo</h1>

                {message && <p className="text-green-500 text-center mb-3">{message}</p>}
                {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                {/* Adicionar Nova Coleção */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold">Adicionar Nova Coleção</h2>
                    <input
                        type="text"
                        className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
                        placeholder="Nome da nova coleção"
                        value={newCollection}
                        onChange={(e) => setNewCollection(e.target.value)}
                    />

                    {/* Exibir imagem selecionada */}
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

                {/* Formulário para Adicionar Filme */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold">Adicionar Novo Filme</h2>
                    <input 
                        type="text" 
                        className="p-2 rounded bg-gray-700 text-white mt-2 w-full" 
                        placeholder="Nome do Filme"
                        value={movie.title}
                        onChange={(e) => setMovie({ ...movie, title: e.target.value })}
                    />

                    {/* Seleção da Coleção */}
                    <select 
                        className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
                        value={movie.collection_id}
                        onChange={(e) => setMovie({ ...movie, collection_id: e.target.value })}
                    >
                        <option value="">Selecione uma Coleção</option>
                        {collections.map((col) => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                    </select>

                    {/* Inserir ID do Vídeo */}
                    <input 
                        type="text" 
                        className="p-2 rounded bg-gray-700 text-white mt-2 w-full" 
                        placeholder="ID do Vídeo BunnyStream"
                        value={movie.url}
                        onChange={(e) => setMovie({ ...movie, url: e.target.value })}
                    />

                    {/* Seleção de Thumbnail */}
                    <select 
                        className="p-2 rounded bg-gray-700 text-white mt-2 w-full"
                        value={movie.cover_url}
                        onChange={(e) => setMovie({ ...movie, cover_url: e.target.value })}
                    >
                        <option value="">Selecione uma Thumbnail</option>
                        {thumbnails.map((thumb) => (
                            <option key={thumb} value={thumb}>{thumb}</option>
                        ))}
                    </select>

                    {/* Inserir Duração */}
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
