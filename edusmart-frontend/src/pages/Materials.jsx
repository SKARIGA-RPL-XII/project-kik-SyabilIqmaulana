import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ganti URL ini jika port Laravelmu beda
  const STORAGE_URL = "http://localhost:8000/storage/";

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await api.get("/materials");
      setMaterials(response.data.data);
    } catch (err) {
      console.error("Gagal ambil materi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus materi ini?")) {
      try {
        await api.delete(`/materials/${id}`);
        setMaterials(materials.filter(m => m.id !== id));
      } catch (err) {
        alert("Gagal menghapus materi.");
      }
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Materi Pelajaran</h1>
          <Link to="/dashboard" className="text-blue-600 font-medium">&larr; Dashboard</Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <Link to="/materials/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Upload Materi Baru
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">Memuat materi...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                    <th className="py-3 px-6">Judul</th>
                    <th className="py-3 px-6">Mapel</th>
                    <th className="py-3 px-6">Guru</th>
                    <th className="py-3 px-6">File</th>
                    <th className="py-3 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {materials.length > 0 ? (
                    materials.map((m) => (
                      <tr key={m.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-6 font-medium">{m.title}</td>
                        <td className="py-3 px-6">
                            <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                                {m.subject}
                            </span>
                        </td>
                        <td className="py-3 px-6">{m.teacher ? m.teacher.name : "-"}</td>
                        <td className="py-3 px-6">
                          {m.file_path ? (
                            <a 
                              href={`${STORAGE_URL}${m.file_path}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-gray-400">Tidak ada file</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700">
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center py-4">Belum ada materi.</td></tr>
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