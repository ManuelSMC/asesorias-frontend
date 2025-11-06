import axios from 'axios';
import type { Usuario } from '../types';

const API_BASE = 'http://localhost:8081/api/admin';

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createUsuario = async (usuario: Omit<Usuario, 'idUsuario'>): Promise<Usuario> => {
  const response = await axios.post(API_BASE, usuario);
  return response.data;
};

export const updateUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
  const response = await axios.put(`${API_BASE}/${id}`, usuario);
  return response.data;
};

export const enableUsuario = async (id: number): Promise<Usuario> => {
  const response = await axios.put(`${API_BASE}/${id}/enable`);
  return response.data;
};

export const disableUsuario = async (id: number): Promise<Usuario> => {
  const response = await axios.put(`${API_BASE}/${id}/disable`);
  return response.data;
};