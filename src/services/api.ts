import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reqres.in/api',
});

api.interceptors.request.use((config) => {
  config.headers['x-api-key'] = 'reqres-free-v1';
  return config;
});

export default api; 