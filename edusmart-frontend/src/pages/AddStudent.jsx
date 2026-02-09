import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link untuk tombol kembali
import api from "../services/api";

export default function AddStudent() {
  // State untuk menampung inputan user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // State untuk loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fungsi saat tombol "Simpan" diklik
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);
    setError(null);

    try {
      // Kirim data ke Backend
      await api.post("/students", {
        name: name,
        email: email,
      });

      // Jika sukses, kembali ke halaman daftar siswa
      navigate("/students");
      
    } catch (err) {
      console.error(err);
      // Tampilkan pesan error dari Backend (misal: email kembar)
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data)); 
      } else {
        setError("Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Siswa Baru</h2>

        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Input Nama */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ahmad Dahlan"
              required
            />
          </div>

          {/* Input Email */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Alamat Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: ahmad@sekolah.id"
              required
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-between items-center">
             <Link to="/students" className="text-gray-600 hover:text-gray-800">
               Batal
             </Link>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}