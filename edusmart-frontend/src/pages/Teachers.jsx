import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Briefcase } from "lucide-react";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/teachers", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTeachers(response.data.data);
    } catch (error) {
        console.error("Error", error);
    }
  };

  const deleteTeacher = async (id) => {
    if(!window.confirm("Hapus guru ini?")) return;
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/teachers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        getTeachers();
    } catch (error) { console.error(error); }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.nip?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Data Guru</h2>
            <p className="text-gray-500 text-sm">Kelola daftar pengajar.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari Nama atau NIP..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Link to="/teachers/add" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md">
                <Plus size={20} />
                <span className="hidden md:inline">Tambah Guru</span>
            </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4 border-b">Nama Guru</th>
                        <th className="p-4 border-b">NIP</th>
                        <th className="p-4 border-b">Email</th>
                        <th className="p-4 border-b text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="p-4 flex items-center gap-3">
                                {/* Avatar Guru - Purple */}
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                    <Briefcase size={18} />
                                </div>
                                <span className="font-medium text-gray-800">{item.name}</span>
                            </td>
                            <td className="p-4 text-gray-600 font-mono text-sm">{item.nip || '-'}</td>
                            <td className="p-4 text-gray-600">{item.email}</td>
                            <td className="p-4 text-right space-x-2">
                                <Link to={`/teachers/edit/${item.id}`} className="inline-block p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                    <Edit size={18} />
                                </Link>
                                <button onClick={() => deleteTeacher(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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

export default Teachers;