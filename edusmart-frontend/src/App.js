import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout"; 
import EditStudent from "./pages/EditStudent";
import Teachers from "./pages/Teachers";
import AddTeacher from "./pages/AddTeacher";
import EditTeacher from "./pages/EditTeacher";
import Materials from "./pages/Materials";
import AddMaterial from "./pages/AddMaterial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Bungkus semua halaman admin dengan PrivateRoute DAN Layout */}
        <Route element={<PrivateRoute />}>
            <Route element={<Layout />}> {/* <--- Layout dipasang disini */}
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/add" element={<AddStudent />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/teachers/add" element={<AddTeacher />} />
                <Route path="/teachers/edit/:id" element={<EditTeacher />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/materials/add" element={<AddMaterial />} />
            
            </Route>
        </Route>
<Route path="/students/edit/:id" element={<EditStudent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;