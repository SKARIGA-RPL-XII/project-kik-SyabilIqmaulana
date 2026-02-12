import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import Logo from './Logo';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Menu Items Config
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/students', label: 'Data Siswa', icon: <GraduationCap size={20} /> },
    { path: '/teachers', label: 'Data Guru', icon: <Users size={20} /> },
    { path: '/materials', label: 'Materi Pelajaran', icon: <BookOpen size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* === SIDEBAR (Desktop & Mobile) === */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between p-6 border-b">
          <Logo className="h-8" />
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button (Bottom) */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition font-medium"
           >
             <LogOut size={20} />
             Keluar Aplikasi
           </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Mobile */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
            <Logo className="h-8" hideText={true} />
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                <Menu size={24} />
            </button>
        </header>

        {/* Header Desktop (User Profile) */}
        <header className="hidden md:flex justify-between items-center bg-white border-b px-8 py-4">
            <h2 className="text-xl font-bold text-gray-800">
                {/* Menampilkan Judul Halaman secara Dinamis */}
                {menuItems.find(item => location.pathname.startsWith(item.path))?.label || 'Admin Panel'}
            </h2>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'A'}
                </div>
            </div>
        </header>

        {/* Konten Halaman Berubah di Sini */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;