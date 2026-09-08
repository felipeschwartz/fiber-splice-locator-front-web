import axios from 'axios';
import { API_BASE_URL } from './config';

const TOKEN_STORAGE_KEY = 'fiberSpliceLocator.token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token && !config.url?.includes('/api/auth/v1/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error, fallback = 'Não foi possível concluir a operação.') {
  if (!error?.response) return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  if (error.response.status === 401) return 'Sessão expirada ou credenciais inválidas.';
  if (error.response.status === 403) return 'Você não tem permissão para acessar este recurso.';
  return error.response.data?.message || error.response.data?.error || fallback;
}
