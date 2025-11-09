// src/utils/auth.js

export const getUserRole = () => {
    return localStorage.getItem("role");
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};