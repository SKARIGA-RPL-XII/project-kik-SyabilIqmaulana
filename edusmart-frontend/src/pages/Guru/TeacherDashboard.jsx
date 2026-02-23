import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Users, Upload, List, LogOut } from "lucide-react";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    // Proteksi role Guru
    if (!userData || userData.role !== 'teacher') {
      navigate("/", { replace: true });
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="p-6">
      {/* Header dengan tombol Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel Guru</h1>
        <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium"
        >
            <LogOut size={18} /> Keluar
        </button>
      </div>

      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Selamat Datang, {user ? user.name : "Guru"}! 👋
        </h2>
        <p className="opacity-90">
          Ini adalah ruang kerja Anda. Kelola materi pelajaran dan pantau siswa dari sini.
        </p>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
            <BookOpen size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Materi Saya</p>
            <p className="text-2xl font-bold text-gray-800">12</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
            <Users size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Siswa Aktif</p>
            <p className="text-2xl font-bold text-gray-800">120</p>
          </div>
        </div>
      </div>

      {/* Shortcut Menu Cepat */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/teacher/add-material" className="block p-5 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition group">
              <div className="flex items-center gap-3 mb-2">
                <Upload className="text-blue-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-blue-700">Upload Materi Baru</h4>
              </div>
              <p className="text-sm text-blue-600 mt-1">Tambahkan PDF atau Video baru untuk materi ajar siswa.</p>
          </Link>
          
          <Link to="/teacher/materials" className="block p-5 bg-purple-50 border border-purple-200 rounded-2xl hover:bg-purple-100 transition group">
              <div className="flex items-center gap-3 mb-2">
                <List className="text-purple-600 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-purple-700">Lihat Semua Materi</h4>
              </div>
              <p className="text-sm text-purple-600 mt-1">Edit, hapus, atau tinjau kembali materi yang sudah diupload.</p>
          </Link>
      </div>
    </div>
  );
}