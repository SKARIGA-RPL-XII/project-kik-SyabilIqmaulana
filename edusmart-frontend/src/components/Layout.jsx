import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Menu, X, UserCircle } from "lucide-react";
import { UserCheck } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false); // Untuk mobile
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Menu Sidebar
  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Data Siswa", path: "/students", icon: <Users size={20} /> },
    { name: "Data Guru", path: "/teachers", icon: <UserCheck size={20} /> }, 
    { name: "Materi Pelajaran", path: "/materials", icon: <BookOpen size={20} /> },
];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          EduSmart 🚀
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname.startsWith(menu.path)
                  ? "bg-blue-600 text-white" // Warna menu aktif
                  : "text-gray-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {menu.icon}
              <span>{menu.name}</span>
            </Link>
          ))}
          
          {/* Tombol Logout */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 mt-8 text-red-400 hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </nav>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <span className="font-bold text-gray-700">EduSmart</span>
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
            {isOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Isi Halaman (Disini halaman Dashboard/Siswa akan muncul) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet /> {/* <--- INI PENTING: Tempat anak-anak route dirender */}
        </main>
      </div>
    </div>
  );
}