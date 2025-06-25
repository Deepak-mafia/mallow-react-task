import api from './api';

export const fetchUsers = (page: number = 1) => api.get(`/users?page=${page}`);
export const createUser = (data: { first_name: string; last_name: string; email: string; avatar: string }) => api.post('/users', data);
export const updateUser = (id: string, data: { first_name: string; last_name: string; email: string; avatar: string }) => api.put(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`); 