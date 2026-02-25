import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout"; 

// --- PAGES IMPORT ---
import Login from "./pages/Login"; 
import Register from "./pages/Register";
import AdminDashboard from "./pages/Dashboard"; 
import TeacherDashboard from "./pages/Guru/TeacherDashboard";
import SiswaDashboard from "./pages/Siswa/SiswaDashboard"; 
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Teachers from "./pages/Teachers";
import AddTeacher from "./pages/AddTeacher";
import EditTeacher from "./pages/EditTeacher";
import Materials from "./pages/Materials";
import AddMaterial from "./pages/AddMaterial";
import EditMaterial from './pages/EditMaterial';

// 1. KOMPONEN BARU: Pengecek Login Secara Live (Memecah Infinite Loop)
const LoginRedirect = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  // Jika token atau user tidak ada, benar-benar tampilkan form Login
  if (!token || !user) return <Login />;
  
  // Jika masih ada sesi, arahkan ke dashboard sesuai role
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role; 

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. PUBLIC ROUTES */}
        {/* Gunakan Komponen LoginRedirect yang kita buat di atas */}
        <Route path="/login" element={<LoginRedirect />} />
        
        {/* Redirect dari root (/) ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/register" element={<Register />} />

        {/* 2. PROTECTED ROUTES (Harus punya token) */}
        <Route element={<PrivateRoute />}>
            
            {/* JALUR SISWA */}
            {role === 'student' && (
                <Route path="/student/dashboard" element={<SiswaDashboard />} />
            )}

            {/* JALUR GURU & ADMIN (Pakai Layout Sidebar) */}
            {(role === 'teacher' || role === 'admin') && (
                <Route element={<Layout />}>
                    {/* Dashboard menyesuaikan Role */}
                    <Route 
                        path={role === 'admin' ? "/admin/dashboard" : "/teacher/dashboard"} 
                        element={role === 'admin' ? <AdminDashboard /> : <TeacherDashboard />} 
                    />

                    {/* Menu Materi (Bisa diakses Guru & Admin) */}
                    <Route path="/materials" element={<Materials />} />
                    <Route path="/materials/add" element={<AddMaterial />} />
                    <Route path="/materials/edit/:id" element={<EditMaterial />} />

                    {/* Menu Khusus Admin */}
                    {role === 'admin' && (
                        <>
                            <Route path="/students" element={<Students />} />
                            <Route path="/students/add" element={<AddStudent />} />
                            <Route path="/students/edit/:id" element={<EditStudent />} />
                            <Route path="/teachers" element={<Teachers />} />
                            <Route path="/teachers/add" element={<AddTeacher />} />
                            <Route path="/teachers/edit/:id" element={<EditTeacher />} />
                        </>
                    )}
                </Route>
            )}
        </Route>

        {/* 404 REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;