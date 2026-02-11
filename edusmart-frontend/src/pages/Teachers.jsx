import { useEffect, useState } from "react";
import api from "../services/api"; 
import { Link } from "react-router-dom";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data dari Laravel
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teachers"); 
      setTeachers(response.data.data || response.data); 
    } catch (err) {
      console.error("Error fetching teacher:", err);
      setError("Gagal mengambil data guru.");
      
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI BARU: DELETE TEACHER ---
  const handleDelete = async (id) => {
    // 1. Konfirmasi dulu biar nggak salah hapus
    if (window.confirm("Apakah anda yakin ingin menghapus data guru ini?")) {
      try {
        // 2. Panggil API Delete ke Laravel
        await api.delete(`/teachers/${id}`);
        
        // 3. Update tampilan tabel secara langsung (tanpa reload halaman)
        // Kita filter data: Ambil semua guru KECUALI yang id-nya barusan dihapus
        setTeachers(teachers.filter(teacher => teacher.id !== id));
        
        alert("Data berhasil dihapus!");
      } catch (error) {
        console.error("Gagal hapus", error);
        alert("Gagal menghapus data. Cek koneksi atau izin server.");
      }
    }
  };

  // Jalankan fungsi ini sekali saat halaman dibuka
  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Daftar Guru</h1>
          {/* Kalau sudah pakai Sidebar Layout, tombol kembali ini opsional */}
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* Card Tabel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          
          {/* Tombol Tambah */}
          <div className="mb-4">
            <Link to="/teachers/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block">
              + Tambah Data Guru
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Tabel */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">Sedang memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">No</th>
                    <th className="py-3 px-6 text-left">NIP</th>
                    <th className="py-3 px-6 text-left">Nama</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {teachers.length > 0 ? (
                    teachers.map((teacher, index) => (
                      <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">                
                        <td className="py-3 px-6 text-left font-bold">{index + 1}</td>
                        <td className="py-3 px-6 text-left">{teacher.nip}</td>
                        <td className="py-3 px-6 text-left">{teacher.name}</td>
                        <td className="py-3 px-6 text-left">{teacher.email}</td>
                        
                        {/* --- BAGIAN AKSI (EDIT & DELETE) --- */}
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center space-x-2">
                            
                            {/* Tombol Edit (Gunakan Link) */}
                            <Link 
                              to={`/teachers/edit/${teacher.id}`}
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                            >
                              Edit
                            </Link>

                            {/* Tombol Hapus (Gunakan onClick) */}
                            <button 
                              onClick={() => handleDelete(teacher.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            >
                              Hapus
                            </button>

                          </div>
                        </td>
                        {/* ---------------------------------- */}

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">Belum ada data siswa.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}