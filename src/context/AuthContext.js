import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { saveToken, getToken, saveUser, getUser, clearAuthData } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await getToken();
            const cachedUser = await getUser();

            if (token && cachedUser) {
                setUser(cachedUser);
                setIsAuthenticated(true);


                try {
                    const response = await authAPI.getCurrentUser();
                    setUser(response.data.user);
                    await saveUser(response.data.user);
                } catch (error) {

                    await clearAuthData();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        } catch (error) {
            console.error('Load user error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { user, token } = response.data;

            await saveToken(token);
            await saveUser(user);
            setUser(user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { user, token } = response.data;

            await saveToken(token);
            await saveUser(user);
            setUser(user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            await clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            setUser(response.data.user);
            await saveUser(response.data.user);
            return response.data.user;
        } catch (error) {
            console.error('Refresh user error:', error);
            return null;
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
