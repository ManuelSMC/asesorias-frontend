import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import type { Usuario } from '../types';
import { getUsuarioById, createUsuario, updateUsuario } from '../services/usuarioService';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  password: z.string().optional(),
  rol: z.string().min(1, 'Seleccione un rol'),
});

type FormData = z.infer<typeof schema>;

const UsuarioForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: usuario, isLoading } = useQuery<Usuario, Error>({
    queryKey: ['usuario', id],
    queryFn: () => getUsuarioById(Number(id)),
    enabled: isEdit,
  });

  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      navigate('/usuarios');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Usuario> }) => updateUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      navigate('/usuarios');
    },
  });

  useEffect(() => {
    if (isEdit && usuario) {
      reset({
        nombre: usuario.nombre,
        rol: usuario.rol,
        password: '',
      });
    }
  }, [usuario, reset, isEdit]);

  const onSubmit = (data: FormData) => {
    const submitData = isEdit ? { ...data, password: undefined } : data;

    if (isEdit) {
      updateMutation.mutate({ id: Number(id), data: submitData });
    } else {
      createMutation.mutate(submitData as Omit<Usuario, 'idUsuario'>);
    }
  };

  if (isEdit && isLoading) return <p className="text-center py-6 text-gray-500">Cargando...</p>;

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="card" style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Editar' : 'Crear'} Usuario
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          {!isEdit && (
            <FormInput
              label="Contraseña"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
          )}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Rol</label>
            <select
              {...register('rol')}
              className={`form-select ${errors.rol ? 'error' : ''}`}
            >
              <option value="">Seleccione un rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
              <option value="COORDINADOR">Coordinador</option>
            </select>
            {errors.rol && <p className="form-error">{errors.rol.message}</p>}
          </div>
          <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
            Guardar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;