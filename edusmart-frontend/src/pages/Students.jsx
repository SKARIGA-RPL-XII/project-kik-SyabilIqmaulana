import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react"; // Ikon User sudah saya hapus agar tidak ada warning lagi
import Swal from "sweetalert2"; // Import SweetAlert2

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get("http://localhost:8000/api/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Fungsi Hapus yang Diperbarui dengan SweetAlert2
  const deleteStudent = async (id) => {
    // 1. Tampilkan Pop-up Konfirmasi
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "Data siswa yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Warna merah (sesuai tailwind text-red-500)
      cancelButtonColor: '#3b82f6', // Warna biru (sesuai tailwind text-blue-500)
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      shape: 'rounded-xl'
    });

    // 2. Jika user klik "Ya, Hapus!"
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // 3. Tampilkan Pesan Sukses
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data siswa berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });

        getStudents(); // Refresh tabel setelah dihapus
      } catch (error) {
        console.error("Gagal hapus", error);
        
        // 4. Tampilkan Pesan Error jika gagal
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menghapus data.',
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2 md:p-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
            <p className="text-gray-500 text-sm">Kelola data siswa yang terdaftar.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Link to="/students/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-md shadow-blue-200">
                <Plus size={20} />
                <span className="hidden md:inline">Tambah Siswa</span>
            </Link>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        <th className="p-4 border-b">Siswa</th>
                        <th className="p-4 border-b">Email</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/50 transition duration-150">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-800">{item.name}</span>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">{item.email}</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        Aktif
                                    </span>
                                </td>
                                <td className="p-4">
                                    {/* Container flex dan justify-end agar lurus sejajar di kanan */}
                                    <div className="flex items-center justify-end gap-2">
                                        <Link 
                                            to={`/students/edit/${item.id}`} 
                                            className="flex items-center justify-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors duration-200"
                                            title="Edit Siswa"
                                        >
                                            <Edit size={16} strokeWidth={2.5} />
                                        </Link>
                                        <button 
                                            onClick={() => deleteStudent(item.id)}
                                            className="flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
                                            title="Hapus Siswa"
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
                                <p className="text-gray-500 font-medium">Tidak ada data siswa ditemukan.</p>
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

export default Students;