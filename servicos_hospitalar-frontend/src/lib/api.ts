import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token encontrado:', token ? 'Sim' : 'Não'); // Debug
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token adicionado ao header:', config.headers.Authorization); // Debug
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Erro na requisição:', error.response?.status, error.response?.data); // Debug
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { api }; 