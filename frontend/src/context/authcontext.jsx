// src/context/authcontext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

// auth.js
router.get('/me', async (req, res) => {
  try {
    // decodifica token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decryptedId = decrypt(decoded.id);

    // busca user
    const [user] = await queryD1('SELECT * FROM users WHERE id = ?', [decryptedId]);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // devolve user
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});


    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

// authcontext.jsx
      const isAdmin = user?.role === 'admin';


    return (
        <AuthContext.Provider value={{ authToken, login, logout, user, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};