import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const token = localStorage.getItem("token"); // Ambil token
      const response = await axios.get("http://localhost:8000/api/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const deleteStudent = async (id) => {
    if(!window.confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        getStudents();
    } catch (error) {
        console.error("Gagal hapus", error);
    }
  };

  // Filter siswa berdasarkan pencarian
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Data Siswa</h2>
            <p className="text-gray-500 text-sm">Kelola data siswa yang terdaftar.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari nama atau email..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Add Button */}
            <Link to="/students/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-md">
                <Plus size={20} />
                <span className="hidden md:inline">Tambah Siswa</span>
            </Link>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
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
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-800">{item.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{item.email}</td>
                                <td className="p-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        Aktif
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link to={`/students/edit/${item.id}`} className="inline-block p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                                        <Edit size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => deleteStudent(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-8 text-center text-gray-400">
                                Tidak ada data siswa ditemukan.
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