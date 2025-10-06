import axios from 'axios';
import type { Division } from '../types';

const API_BASE = 'http://localhost:8080/api/divisiones';

export const getAllDivisions = async (): Promise<Division[]> => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const getDivisionById = async (id: number): Promise<Division> => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createDivision = async (division: Division): Promise<Division> => {
  const response = await axios.post(API_BASE, division);
  return response.data;
};

export const updateDivision = async (id: number, division: Partial<Division>): Promise<Division> => {
  const response = await axios.put(`${API_BASE}/${id}`, division);
  return response.data;
};

export const enableDivision = async (id: number): Promise<Division> => {
  const response = await axios.put(`${API_BASE}/${id}/habilitar`);
  return response.data;
};

export const disableDivision = async (id: number): Promise<Division> => {
  const response = await axios.put(`${API_BASE}/${id}/deshabilitar`);
  return response.data;
};

export const deleteDivision = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};