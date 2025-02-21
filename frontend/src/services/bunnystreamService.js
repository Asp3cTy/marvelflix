import axios from "axios";

const API_URL = "http://localhost:5000/api/movies/bunnystream";

export const getBunnyVideo = async (movieId) => {
    try {
        const response = await axios.get(`${API_URL}/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar vídeo do BunnyStream:", error);
        return null;
    }
};
