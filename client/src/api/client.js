import axios from 'axios';

const TOKEN_KEY = 'todo_token';

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: token => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use(config => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized = () => {};
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  response => response,
  error => {
    const isLoginOrRegister = /^\/auth\/(login|register)$/.test(error.config?.url ?? '');
    if (error.response?.status === 401 && !isLoginOrRegister) onUnauthorized();
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.details) return Object.values(data.details).join('. ');
  return data?.message || error?.message || 'Something went wrong';
}
