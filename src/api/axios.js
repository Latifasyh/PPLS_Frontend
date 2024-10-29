// src/utils/axiosInstance.js

import axios from 'axios';

// Créer une instance d'Axios avec une configuration par défaut
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', 
    timeout: 10000, // Délai d'attente pour les requêtes
});

// Configurer les en-têtes par défaut (par exemple, pour l'authentification)
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // ou récupérez le token de votre contexte
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Gérer les réponses et les erreurs globalement si nécessaire
axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    // Traitez les erreurs ici
    if (error.response) {
        // Le serveur a répondu avec un code d'état qui sort de la plage des 2xx
        console.error('Erreur de réponse:', error.response.data);
    } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('Erreur de requête:', error.request);
    } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur:', error.message);
    }
    return Promise.reject(error);
});

export default axiosInstance;
