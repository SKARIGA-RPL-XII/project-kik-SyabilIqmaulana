import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout"; 

// PAGES
import AuthPage from "./components/AuthPage"; // <--- GANTI IMPORT INI (Sesuaikan path file AuthPage kamu)
// import Login from "./pages/Login"; // <--- HAPUS INI

import Dashboard from "./pages/Dashboard"; 
import SiswaDashboard from "./pages/Siswa/SiswaDashboard"; 

// ADMIN PAGES (Import lainnya tetap sama...)
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Teachers from "./pages/Teachers";
import AddTeacher from "./pages/AddTeacher";
import EditTeacher from "./pages/EditTeacher";
import Materials from "./pages/Materials";
import AddMaterial from "./pages/AddMaterial";
import EditMaterial from './pages/EditMaterial';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role; 

  return (
    <BrowserRouter>
      <Routes>
        
        {/* RUTE UTAMA DIGANTI KE AUTHPAGE */}
        <Route path="/" element={<AuthPage />} />

        {/* PROTECTED ROUTES */}
        <Route element={<PrivateRoute />}>
            
            {/* === JALUR SISWA === */}
            {role === 'student' ? (
                <Route path="/dashboard" element={<SiswaDashboard />} />
            ) : (
                
                // === JALUR ADMIN & GURU ===
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Kelola Siswa */}
                    <Route path="/students" element={<Students />} />
                    <Route path="/students/add" element={<AddStudent />} />
                    <Route path="/students/edit/:id" element={<EditStudent />} />
                    
                    {/* Kelola Guru */}
                    <Route path="/teachers" element={<Teachers />} />
                    <Route path="/teachers/add" element={<AddTeacher />} />
                    <Route path="/teachers/edit/:id" element={<EditTeacher />} />
                    
                    {/* Kelola Materi */}
                    <Route path="/materials" element={<Materials />} />
                    <Route path="/materials/add" element={<AddMaterial />} />
                    <Route path="/materials/edit/:id" element={<EditMaterial />} />
                </Route>
            )}

        </Route>

        {/* Redirect nyasar */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;