import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditTeacher() {
const [nip, setNip] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL

  // Ambil data guru saat halaman dibuka
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await api.get(`/teachers/${id}`);
        setNip(response.data.data.nip);
        setName(response.data.data.name);
        setEmail(response.data.data.email);
      } catch (err) {
        setError("Gagal mengambil data guru.");
      }
    };
    fetchTeacher();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Pakai PUT untuk update
      await api.put(`/teachers/${id}`, {
        nip: nip,
        name: name,
        email: email,
      });
      navigate("/teachers"); 
    } catch (err) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data)); 
      } else {
        setError("Terjadi kesalahan saat update data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Data Guru</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate}>
            <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">NIP</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Alamat Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center">
             <Link to="/teachers" className="text-gray-600 hover:text-gray-800">
               Batal
             </Link>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white transition ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Update Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}