import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, Download, Trash2, Edit } from "lucide-react";
import Swal from "sweetalert2"; // Tambahan pop-up cantik

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMaterial = async (id) => {
    // Mengganti window.confirm standar dengan SweetAlert2
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: "File materi yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#f97316', // Warna orange sesuai tema materi
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      shape: 'rounded-xl'
    });

    if (result.isConfirmed) {
      try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:8000/api/materials/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          Swal.fire({
            title: 'Terhapus!',
            text: 'Materi berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#f97316'
          });

          fetchMaterials();
      } catch (error) {
          console.error("Gagal hapus", error);
          Swal.fire({
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menghapus materi.',
            icon: 'error',
            confirmButtonColor: '#f97316'
          });
      }
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Materi Pelajaran</h2>
            <p className="text-gray-500 text-sm">Upload dan kelola bahan ajar.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari Judul atau Mapel..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link to="/materials/add" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md transition">
                <Plus size={20} />
                <span className="hidden md:inline">Upload Materi</span>
            </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4 border-b">Judul Materi</th>
                        <th className="p-4 border-b">Mata Pelajaran</th>
                        <th className="p-4 border-b">File</th>
                        <th className="p-4 border-b text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {filteredMaterials.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-10 text-center text-gray-500">
                                Belum ada materi ditemukan.
                            </td>
                        </tr>
                    )}
                    {filteredMaterials.map((item) => (
                        <tr key={item.id} className="hover:bg-orange-50/50 transition">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.title}</p>
                                        <p className="text-xs text-gray-400">Uploaded: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                    {item.subject}
                                </span>
                            </td>
                            <td className="p-4">
                                <a 
                                    href={`http://localhost:8000/storage/${item.file_path}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition font-medium"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </a>
                            </td>
                            <td className="p-4">
                                {/* PERBAIKAN KOLOM AKSI DENGAN FLEXBOX */}
                                <div className="flex items-center justify-end gap-2">
                                    <Link 
                                        to={`/materials/edit/${item.id}`} 
                                        className="flex items-center justify-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors duration-200"
                                        title="Edit Materi"
                                    >
                                        <Edit size={16} strokeWidth={2.5} />
                                    </Link>
                                    <button 
                                        onClick={() => deleteMaterial(item.id)} 
                                        className="flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
                                        title="Hapus Materi"
                                    >
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Materials;