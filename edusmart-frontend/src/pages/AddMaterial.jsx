import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function AddMaterial() {
  // State Form
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [file, setFile] = useState(null); // State khusus File

  // State Data Pendukung
  const [teachers, setTeachers] = useState([]); // Untuk dropdown guru
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Ambil daftar guru buat dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/teachers");
        setTeachers(res.data.data);
      } catch (err) {
        console.error("Gagal load guru");
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // PENTING: Gunakan FormData untuk upload file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("teacher_id", teacherId);
    if (file) {
      formData.append("file", file);
    }

    try {
      await api.post("/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Paksa header ini
      });
      alert("Materi berhasil diupload!");
      navigate("/materials");
    } catch (err) {
      console.error("Error Upload:", err);
      
      // --- KODE BARU: MENAMPILKAN PESAN ERROR SPESIFIK ---
      if (err.response && err.response.data && err.response.data.errors) {
        // Gabungkan semua pesan error dari Laravel
        const messages = Object.values(err.response.data.errors).flat().join("\n");
        alert("Gagal Validasi:\n" + messages);
      } else {
        alert("Gagal upload. Cek console untuk detail.");
      }
      // ---------------------------------------------------
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Materi Baru</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Judul */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Judul Materi</label>
            <input type="text" className="w-full border p-2 rounded" 
              value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* Mapel */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Mata Pelajaran</label>
            <input type="text" className="w-full border p-2 rounded" placeholder="Contoh: Fisika"
              value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>

          {/* Guru (Dropdown) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Guru Pengampu</label>
            <select className="w-full border p-2 rounded" 
              value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
              <option value="">Pilih Guru...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">File Materi (PDF/DOCX)</label>
            <input type="file" className="w-full border p-2 rounded" 
              onChange={(e) => setFile(e.target.files[0])} />
            <p className="text-xs text-gray-500 mt-1">Maksimal 20MB.</p>
          </div>

          <div className="flex justify-between mt-6">
            <Link to="/materials" className="text-gray-600 py-2">Batal</Link>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? "Mengupload..." : "Upload Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}