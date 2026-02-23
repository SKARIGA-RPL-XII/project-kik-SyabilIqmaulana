import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Search, FileText, Download, Trash2, Edit } from "lucide-react";

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
    if(!window.confirm("Hapus materi ini?")) return;
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/materials/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchMaterials();
    } catch (error) { console.error(error); }
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
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link to="/materials/add" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md">
                <Plus size={20} />
                <span className="hidden md:inline">Upload Materi</span>
            </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{item.title}</p>
                                        <p className="text-xs text-gray-400">Uploaded: {new Date(item.created_at).toLocaleDateString()}</p>
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
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </a>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Link to={`/materials/edit/${item.id}`} className="inline-block p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                    <Edit size={18} />
                                </Link>
                                <button onClick={() => deleteMaterial(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
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