// src/context/authcontext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (authToken) {
            axios.get(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(() => {
                setAuthToken(null);
                setUser(null);
                localStorage.removeItem('token');
            });
        }
    }, [authToken]);

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    const isAdmin = user?.username === 'admin';

    return (
        <AuthContext.Provider value={{ authToken, login, logout, user, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};