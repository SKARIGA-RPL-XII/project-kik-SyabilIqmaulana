import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  // 1. AMBIL DATA USER & ROLE
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role; // 'admin' atau 'teacher'

  // Cek apakah role terbaca (Lihat di Console browser nanti)
  console.log("Sidebar Loaded. Role:", role);

  // Helper untuk warna menu aktif (Biru jika dipilih, Abu jika tidak)
  const isActive = (path) => {
    return location.pathname.startsWith(path) 
      ? "bg-blue-600 text-white shadow-md" 
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600";
  };

  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200 flex flex-col font-sans transition-all duration-300">
      
      {/* LOGO */}
      <div className="p-6 flex items-center border-b border-gray-100">
        <div className="bg-blue-600 p-2 rounded-lg mr-3">
            <span className="text-white font-bold text-xl">ES</span>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-wide">EduSmart AI</span>
      </div>

      {/* MENU NAVIGASI */}
      <nav className="flex-1 p-4 space-y-2 mt-2">
        
        {/* 1. DASHBOARD (Link Pintar) */}
        <Link 
          to={role === 'admin' ? "/admin/dashboard" : "/teacher/dashboard"} 
          className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${isActive(role === 'admin' ? "/admin/dashboard" : "/teacher/dashboard")}`}
        >
          {/* Icon Dashboard */}
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </Link>

        {/* 2. DATA SISWA (HANYA ADMIN) */}
        {role === 'admin' && (
            <Link 
            to="/students" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${isActive("/students")}`}
            >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Data Siswa
            </Link>
        )}

        {/* 3. DATA GURU (HANYA ADMIN) */}
        {role === 'admin' && (
            <Link 
            to="/teachers" 
            className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${isActive("/teachers")}`}
            >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Data Guru
            </Link>
        )}

        {/* 4. MATERI (SEMUA BISA AKSES) */}
        <Link 
          to="/materials" 
          className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${isActive("/materials")}`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          Materi Pelajaran
        </Link>

      </nav>

      {/* FOOTER USER */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 font-bold mb-1">LOGIN SEBAGAI</p>
        <p className="text-sm font-bold text-gray-800">{user?.name}</p>
        <p className="text-xs text-blue-600 capitalize">{role}</p>
      </div>

    </div>
  );
}