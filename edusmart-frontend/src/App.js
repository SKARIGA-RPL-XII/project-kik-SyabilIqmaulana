import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout"; 
import EditStudent from "./pages/EditStudent";

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
            
            </Route>
        </Route>
<Route path="/students/edit/:id" element={<EditStudent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;