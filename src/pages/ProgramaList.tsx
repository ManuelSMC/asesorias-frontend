import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import type { ProgramaEducativo } from '../types';
import { getAllProgramas, enablePrograma, disablePrograma, deletePrograma } from '../services/programaService';

const ProgramaList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { data: programas, isLoading, error } = useQuery<ProgramaEducativo[], Error>({
    queryKey: ['programas'],
    queryFn: getAllProgramas,
  });

  const enableMutation = useMutation({
    mutationFn: enablePrograma,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programas'] }),
  });

  const disableMutation = useMutation({
    mutationFn: disablePrograma,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programas'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrograma,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programas'] }),
  });

  const handleEnable = async (id: number) => {
    setLoadingId(id);
    try {
      await enableMutation.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDisable = async (id: number) => {
    setLoadingId(id);
    try {
      await disableMutation.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    { key: 'idProgramaEducativo', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'clave', header: 'Clave' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'division.nombre', header: 'División' },
    { key: 'status', header: 'Estado' },
  ];

  const actions = (programa: ProgramaEducativo) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button variant="secondary" onClick={() => navigate(`/programas/edit/${programa.idProgramaEducativo}`)}>
        Editar
      </Button>
      <Button variant="danger" loading={loadingId === programa.idProgramaEducativo} onClick={() => handleDelete(programa.idProgramaEducativo)}>
        Eliminar
      </Button>
      <Button
        loading={loadingId === programa.idProgramaEducativo}
        onClick={() => programa.status ? handleDisable(programa.idProgramaEducativo) : handleEnable(programa.idProgramaEducativo)}
      >
        {programa.status ? 'Deshabilitar' : 'Habilitar'}
      </Button>
    </div>
  );

  if (isLoading) return <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>Cargando...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '1.5rem', color: '#dc2626' }}>Error: {error.message}</p>;

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Lista de Programas Educativos
        </h1>
        <Button style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/programas/create')}>
          Crear Nuevo Programa
        </Button>
        <Table data={programas || []} columns={columns} actions={actions} />
      </div>
    </div>
  );
};

export default ProgramaList;