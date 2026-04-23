import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios"; // Tambahkan import axios
import Swal from "sweetalert2"; // Tambahkan import SweetAlert2 untuk notifikasi

const AddTask = () => {
  const { id } = useParams(); // Mengambil ID materi dari URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Ambil token dari local storage
      const token = localStorage.getItem("token");
      
      // 2. Kirim request POST ke API Laravel
      await axios.post(
        `http://localhost:8000/api/materials/${id}/tasks`,
        { title, description, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Tampilkan pesan sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Tugas baru berhasil ditambahkan.",
        icon: "success",
        confirmButtonColor: "#2563eb", 
      });

      // 4. Arahkan kembali ke halaman materi setelah sukses
      navigate("/materials"); // Sesuaikan jika route kamu "/teacher/materials" atau "/teacher/dashboard"
      
    } catch (error) {
   console.error("Error Detail:", error.response); // Akan muncul di console browser
      
      // Ambil pesan error asli dari Laravel (jika ada)
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat menyimpan tugas.";
      
      Swal.fire({
        title: "Gagal!",
        text: errorMessage, // Tampilkan error aslinya di sini
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} // Navigate(-1) otomatis kembali ke halaman sebelumnya
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Tambah Tugas Baru</h1>
          <p className="text-sm text-gray-500 mt-1">Buat tugas untuk materi terpilih.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul Tugas</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Contoh: Latihan Soal Sejarah" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi / Instruksi</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
              rows="4" 
              placeholder="Tuliskan instruksi tugas di sini..." 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Batas Waktu (Deadline)</label>
            <input 
              type="datetime-local" 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              required 
              className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Save size={18} /> 
              {isLoading ? "Menyimpan..." : "Simpan Tugas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;