import { Routes, Route } from 'react-router-dom';
import DivisionList from './pages/DivisionList';
import DivisionForm from './pages/DivisionForm';
import ProgramaList from './pages/ProgramaList';
import ProgramaForm from './pages/ProgramaForm';
import UsuarioForm from './pages/UsuarioForm';
import UsuarioList from './pages/UsuarioList';
import AsesoriaList from './pages/AsesoriaList';
import AsesoriaForm from './pages/AsesoriaForm'

function App() {
  return (
    <div className="min-h-screen">
      <header>
        <div className="container">
          <h1>Asesorías UTEQ</h1>
          <nav>
            <ul>
              <li>
                <a href="/divisions">Divisiones </a>
              </li>
              <li>
                <a href="/programas">Programas Educativos</a>
              </li>
              <li>
                <a href="/usuarios">Gestión de Usuarios</a>
              </li>
              <li>
                <a href="/asesorias">Asesorías</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/divisions" element={<DivisionList />} />
          <Route path="/divisions/create" element={<DivisionForm />} />
          <Route path="/divisions/edit/:id" element={<DivisionForm />} />
          <Route path="/programas" element={<ProgramaList />} />
          <Route path="/programas/create" element={<ProgramaForm />} />
          <Route path="/programas/edit/:id" element={<ProgramaForm />} />
          <Route path="/usuarios" element={<UsuarioList />} />
          <Route path="/usuarios/create" element={<UsuarioForm />} />
          <Route path="/usuarios/edit/:id" element={<UsuarioForm />} />
          <Route path="/" element={<DivisionList />} />
          <Route path="/asesorias" element={<AsesoriaList />} />
          <Route path="/asesorias/create" element={<AsesoriaForm />} />
          <Route path="/asesorias/edit/:id" element={<AsesoriaForm />} />
        </Routes>
      </main>
      <footer>
        <p>© 2025 Asesorías UTEQ</p>
      </footer>
    </div>
  );
}

export default App;