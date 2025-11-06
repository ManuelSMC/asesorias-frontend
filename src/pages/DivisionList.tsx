import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import type { Division } from '../types';
import { getAllDivisions, enableDivision, disableDivision, deleteDivision } from '../services/divisionService';

const DivisionList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { data: divisions, isLoading, error } = useQuery<Division[], Error>({
    queryKey: ['divisions'],
    queryFn: getAllDivisions,
  });

  const enableMutation = useMutation({
    mutationFn: enableDivision,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['divisions'] }),
  });

  const disableMutation = useMutation({
    mutationFn: disableDivision,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['divisions'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDivision,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['divisions'] }),
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
    { key: 'idDivision', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'clave', header: 'Clave' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'director', header: 'Director' },
    { key: 'status', header: 'Estado' },
  ];

  const actions = (division: Division) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button variant="secondary" onClick={() => navigate(`/divisions/edit/${division.idDivision}`)}>
        Editar
      </Button>
      <Button
        variant="danger"
        loading={loadingId === division.idDivision}
        onClick={() => {
          if (typeof division.idDivision === 'number') {
            handleDelete(division.idDivision);
          }
        }}
      >
        Eliminar
      </Button>
      <Button
        loading={loadingId === division.idDivision}
        onClick={() => {
          if (typeof division.idDivision === 'number') {
            void (division.status ? handleDisable(division.idDivision) : handleEnable(division.idDivision));
          }
        }}
      >
        {division.status ? 'Deshabilitar' : 'Habilitar'}
      </Button>
    </div>
  );

  if (isLoading) return <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>Cargando...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '1.5rem', color: '#dc2626' }}>Error: {error.message}</p>;

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          Lista de Divisiones
        </h1>
        <Button style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/divisions/create')}>
          Crear Nueva División
        </Button>
        <Table data={divisions || []} columns={columns} actions={actions} />
      </div>
    </div>
  );
};

export default DivisionList;
