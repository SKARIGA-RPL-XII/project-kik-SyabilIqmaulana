import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2"; // Import SweetAlert2 untuk pop-up cantik

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      // Sesuaikan endpoint API ini jika berbeda (misalnya /api/guru)
      const response = await axios.get("http://localhost:8000/api/teachers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(response.data.data || response.data); 
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const deleteTeacher = async (id) => {
    // Tampilkan Pop-up Konfirmasi SweetAlert2
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Data guru yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#3b82f6', 
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      shape: 'rounded-xl'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/teachers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data guru berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });

        getTeachers(); // Refresh data tabel
      } catch (error) {
        console.error("Gagal hapus", error);
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menghapus data guru.',
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    (teacher.name && teacher.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 p-2 md:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Data Guru</h2>
            <p className="text-gray-500 text-sm">Kelola daftar guru pengajar yang terdaftar.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Tombol Tambah Guru */}
            <Link to="/teachers/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-md shadow-indigo-200">
                <Plus size={20} />
                <span className="hidden md:inline">Tambah Guru</span>
            </Link>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        <th className="p-4 border-b">Nama Guru</th>
                        <th className="p-4 border-b">Email</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((item) => (
                            <tr key={item.id} className="hover:bg-indigo-50/50 transition duration-150">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <span className="font-semibold text-gray-800">{item.name}</span>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">{item.email}</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        Pengajar
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link 
                                            to={`/teachers/edit/${item.id}`} 
                                            className="flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors duration-200"
                                            title="Edit Guru"
                                        >
                                            <Edit size={16} strokeWidth={2.5} />
                                        </Link>
                                        <button 
                                            onClick={() => deleteTeacher(item.id)}
                                            className="flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
                                            title="Hapus Guru"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-12 text-center">
                                <p className="text-gray-500 font-medium">Tidak ada data guru ditemukan.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Teachers;