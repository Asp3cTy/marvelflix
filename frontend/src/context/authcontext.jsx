// src/context/authcontext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);



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