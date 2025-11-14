import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface FormData {
  nombre: string;
  descripcion: string;
  status: boolean;
}

const API = 'http://localhost:8080/api/admin';

export default function AsesoriaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState<FormData>({ nombre: '', descripcion: '', status: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEdit) {
      fetch(`${API}/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({ 
            nombre: data.nombre || '',           // ← AQUÍ ESTÁ EL FIX
            descripcion: data.descripcion || '', 
            status: data.status ?? true 
          });
          setLoading(false);
        })
        .catch(() => {
          alert('No se pudo cargar la asesoría');
          navigate('/asesorias');
        });
    } else {
      setLoading(false);
    }
  }, [id, isEdit, navigate]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${API}/${id}` : API;

    // Enviamos 'tema' porque el backend lo espera
    const payload = {
      nombre: form.nombre,        // ← Convertimos 'nombre' → 'tema'
      descripcion: form.descripcion,
      status: form.status
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(isEdit ? '¡Actualizado!' : '¡Creado!');
        navigate('/asesorias');
      } else {
        alert('Error al guardar');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  if (loading) return <p className="text-center py-12">Cargando...</p>;

  return (
    <div className="container">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          {isEdit ? 'Editar Asesoría' : 'Crear Asesoría'}
        </h2>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <form onSubmit={save} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="input"
                placeholder="Ej. Cálculo Diferencial"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                className="input"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="status"
                checked={form.status}
                onChange={e => setForm({ ...form, status: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <label htmlFor="status" className="font-medium">Activa</label>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button type="submit" className="btn-primary px-6">
                {isEdit ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/asesorias')}
                className="btn-secondary px-6"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}