import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import type { ProgramaEducativoDTO, Division } from '../types';
import { getProgramaById, createPrograma, updatePrograma } from '../services/programaService';
import { getAllDivisions } from '../services/divisionService';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  clave: z.string().min(1, 'La clave es requerida'),
  descripcion: z.string().optional(),
  divisionId: z.number().min(1, 'Seleccione una división'),
  status: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const ProgramaForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: true },
  });

  const { data: programa, isLoading: programaLoading } = useQuery<ProgramaEducativoDTO, Error>({
    queryKey: ['programa', id],
    queryFn: async () => {
      const data = await getProgramaById(Number(id));
      return {
        idProgramaEducativo: data.idProgramaEducativo,
        nombre: data.nombre,
        clave: data.clave,
        descripcion: data.descripcion,
        status: data.status,
        divisionId: data.division?.idDivision ?? 0, // Ensure divisionId is always a number
      };
    },
    enabled: isEdit,
  });

  const { data: divisions, isLoading: divisionsLoading } = useQuery<Division[], Error>({
    queryKey: ['divisions'],
    queryFn: getAllDivisions,
  });

  const createMutation = useMutation({
    mutationFn: createPrograma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programas'] });
      navigate('/programas');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProgramaEducativoDTO }) => updatePrograma(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programas'] });
      navigate('/programas');
    },
  });

  useEffect(() => {
    if (isEdit && programa) {
      reset(programa);
    }
  }, [programa, reset, isEdit]);

  const onSubmit = (data: FormData) => {
    const fixedData = { ...data, descripcion: data.descripcion ?? '' };
    if (isEdit) {
      updateMutation.mutate({ id: Number(id), data: fixedData });
    } else {
      createMutation.mutate(fixedData);
    }
  };

  if (programaLoading || divisionsLoading) return <p style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>Cargando...</p>;

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="card" style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
          {isEdit ? 'Editar' : 'Crear'} Programa Educativo
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          <FormInput label="Clave" {...register('clave')} error={errors.clave?.message} />
          <FormInput label="Descripción" {...register('descripcion')} />
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">División</label>
            <select
              {...register('divisionId', { valueAsNumber: true })}
              className={`form-select ${errors.divisionId ? 'error' : ''}`}
            >
              <option value="">Seleccione una división</option>
              {divisions?.map(division => (
                <option key={division.idDivision} value={division.idDivision}>
                  {division.nombre}
                </option>
              ))}
            </select>
            {errors.divisionId && <p className="form-error">{errors.divisionId.message}</p>}
          </div>
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

export default ProgramaForm;