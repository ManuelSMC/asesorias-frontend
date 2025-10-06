import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import type { Division } from '../types';
import { getDivisionById, createDivision, updateDivision } from '../services/divisionService';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  clave: z.string().min(1, 'La clave es requerida'),
  descripcion: z.string().optional(),
  director: z.string().optional(),
  status: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const DivisionForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: true },
  });

  const { data: division, isLoading } = useQuery<Division, Error>({
    queryKey: ['division', id],
    queryFn: () => getDivisionById(Number(id)),
    enabled: isEdit,
  });

  const createMutation = useMutation({
    mutationFn: createDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      navigate('/divisions');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Division> }) => updateDivision(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      navigate('/divisions');
    },
  });

  useEffect(() => {
    if (isEdit && division) {
      reset(division);
    }
  }, [division, reset, isEdit]);

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateMutation.mutate({ id: Number(id), data });
    } else {
      // No incluir idDivision para nuevas divisiones
      createMutation.mutate({
        ...data,
        descripcion: data.descripcion ?? '',
        director: data.director ?? '',
      });
    }
  };

  if (isEdit && isLoading) return <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>Cargando...</p>;

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="card" style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          {isEdit ? 'Editar' : 'Crear'} División
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          <FormInput label="Clave" {...register('clave')} error={errors.clave?.message} />
          <FormInput label="Descripción" {...register('descripcion')} />
          <FormInput label="Director" {...register('director')} />
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Activo</label>
            <input
              type="checkbox"
              {...register('status')}
              className="checkbox"
            />
          </div>
          <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
            Guardar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DivisionForm;