import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        user: null,
        token: null,
        loading: true,
    });

    const { user, token, loading } = authState;

    // Check if token exists and verify it
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await axios.get('http://localhost:5000/api/auth/verify-token', {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    });
                    setAuthState({
                        user: response.data.user,
                        token: storedToken,
                        loading: false,
                    });
                } catch (err) {
                    console.error('Invalid or expired token');
                    localStorage.removeItem('token'); // Clear invalid token
                    setAuthState({
                        user: null,
                        token: null,
                        loading: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    token: null,
                    loading: false,
                });
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const token = response.data.token;

            // Save token to local storage
            localStorage.setItem('token', token);

            // Fetch user details immediately after login
            const userResponse = await axios.get('http://localhost:5000/api/auth/verify-token', {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the state with the user and token
            setAuthState({
                user: userResponse.data.user,
                token,
                loading: false,
            });
        } catch (err) {
            console.error('Login failed:', err.message);
            throw new Error(err.response?.data || 'Login failed');
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({
            user: null,
            token: null,
            loading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
