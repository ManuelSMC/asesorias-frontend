import axios from 'axios';
import type { ProgramaEducativo, ProgramaEducativoDTO } from '../types';

const API_BASE = 'http://localhost:8080/api/programas';

export const getAllProgramas = async (): Promise<ProgramaEducativo[]> => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const getProgramaById = async (id: number): Promise<ProgramaEducativo> => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createPrograma = async (dto: ProgramaEducativoDTO): Promise<ProgramaEducativo> => {
  const response = await axios.post(API_BASE, dto);
  return response.data;
};

export const updatePrograma = async (id: number, dto: ProgramaEducativoDTO): Promise<ProgramaEducativo> => {
  const response = await axios.put(`${API_BASE}/${id}`, dto);
  return response.data;
};

export const enablePrograma = async (id: number): Promise<ProgramaEducativo> => {
  const response = await axios.put(`${API_BASE}/${id}/habilitar`);
  return response.data;
};

export const disablePrograma = async (id: number): Promise<ProgramaEducativo> => {
  const response = await axios.put(`${API_BASE}/${id}/deshabilitar`);
  return response.data;
};

export const deletePrograma = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};