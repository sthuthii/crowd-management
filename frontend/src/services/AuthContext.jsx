import React, { createContext, useState, useContext } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = async (username, password) => {
        try {
            const response = await loginUser(username, password);
            const accessToken = response.data.access_token;
            setToken(accessToken);
            setUser({ username }); // In a real app, you'd decode the token to get user details
            localStorage.setItem('token', accessToken);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};