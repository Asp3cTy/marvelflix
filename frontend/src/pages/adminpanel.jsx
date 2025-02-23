// src/pages/adminpanel.jsx
import { useEffect, useContext } from "react";
import { PanelContext } from "../context/panelcontext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const AdminPanel = () => {
  const { panelToken } = useContext(PanelContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Se não houver token, manda pro login
    if (!panelToken) {
      navigate("/login");
    }
  }, [panelToken, navigate]);

  // Exemplo de qualquer lógica do painel
  // Se quiser, pode chamar endpoints passando o token:
  // const config = { headers: { Authorization: `Bearer ${panelToken}` } };
  // axios.get(`${API_URL}/api/...`, config)

  return (
    <div className="flex items-center justify-center min-h-screen bg-marvelDark text-white">
      <h1 className="text-3xl font-bold text-red-600">Painel Administrativo</h1>
      {/* conteúdo do painel */}
    </div>
  );
};

export default AdminPanel;
