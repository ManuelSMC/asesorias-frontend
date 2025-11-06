import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import type { Usuario } from '../types';
import { getAllUsuarios, enableUsuario, disableUsuario } from '../services/usuarioService';

const UsuarioList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { data: usuarios, isLoading, error } = useQuery<Usuario[], Error>({
    queryKey: ['usuarios'],
    queryFn: getAllUsuarios,
  });

  const enableMutation = useMutation({
    mutationFn: enableUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });

  const disableMutation = useMutation({
    mutationFn: disableUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
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

  const columns = [
    { key: 'idUsuario', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'rol', header: 'Rol' },
  ];

  const actions = (usuario: Usuario) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button
        variant="secondary"
        onClick={() => navigate(`/usuarios/edit/${usuario.idUsuario}`)}
      >
        Editar
      </Button>
      <Button
        loading={loadingId === usuario.idUsuario}
        onClick={() => {
            if (usuario.idUsuario) {
            void (usuario.status === 1
                ? handleDisable(usuario.idUsuario)
                : handleEnable(usuario.idUsuario));
            }
        }}
        >
        {usuario.status === 1 ? 'Deshabilitar' : 'Habilitar'}
        </Button>
    </div>
  );

  if (isLoading) return <p className="text-center py-6 text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center py-6 text-red-600">Error: {error.message}</p>;

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>
        <Button style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/usuarios/create')}>
          Crear Nuevo Usuario
        </Button>
        <Table data={usuarios || []} columns={columns} actions={actions} />
      </div>
    </div>
  );
};

export default UsuarioList;