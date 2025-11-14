import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Asesoria {
  idAsesoria: number;
  nombre: string;        // CAMBIADO: tema, no nombre
  descripcion: string;
  status: boolean;
}

const API = 'http://localhost:8080/api/admin';

export default function AsesoriaList() {
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => {
        setAsesorias(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-8">Cargando...</p>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600' }}>Asesorías</h2>
        <Link to="/asesorias/create" className="btn-primary">
          + Nueva Asesoría
        </Link>
      </div>

      {asesorias.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">No hay asesorías registradas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Tema</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asesorias.map(a => (
                <tr key={a.idAsesoria}>
                  <td><strong>{a.nombre}</strong></td>
                  <td>{a.descripcion}</td>
                  <td>
                    <span style={{ 
                      color: a.status ? '#28a745' : '#dc3545',
                      fontWeight: 500
                    }}>
                      {a.status ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/asesorias/edit/${a.idAsesoria}`} className="btn-sm">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}