import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Pastikan path ini benar sesuai struktur foldermu

export default function AddMaterial() {
  // --- STATE FORM ---
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState(""); // State ada, sekarang inputnya kita adakan
  const [teacherId, setTeacherId] = useState("");
  const [file, setFile] = useState(null);

  // --- STATE PENDUKUNG ---
  const [teachers, setTeachers] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- 1. AMBIL DATA GURU (Saat Halaman Dibuka) ---
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/teachers");
        // Cek apakah data dibungkus wrapper 'data' (Laravel Resource) atau array langsung
        setTeachers(res.data.data || res.data);
      } catch (err) {
        console.error("Gagal load guru:", err);
        alert("Gagal mengambil daftar guru.");
      }
    };
    fetchTeachers();
  }, []);

  // --- 2. HANDLE SUBMIT (Upload) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("teacher_id", teacherId); // Sesuai database (snake_case)
    
    // PENTING: Key harus "file_path" sesuai Controller Laravel ($request->file('file_path'))
    if (file) {
      formData.append("file_path", file); 
    }

    try {
      await api.post("/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Materi berhasil diupload!");
      navigate("/materials"); // Kembali ke list materi
    } catch (err) {
      console.error("Error Upload:", err);
      
      // Tampilkan pesan error detail dari Laravel (Validation Error)
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat().join("\n");
        alert("Gagal Validasi:\n" + messages);
      } else {
        alert("Gagal upload. Terjadi kesalahan server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Materi Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Judul */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Judul Materi</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Input Mapel */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Mata Pelajaran</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Contoh: Matematika Wajib"
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
            />
          </div>

          {/* Dropdown Guru */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Guru Pengampu</label>
            <select
              name="teacher_id"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}          
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            >
              <option value="">-- Pilih Guru --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.nip ? `(NIP: ${teacher.nip})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Input Deskripsi (BARU DITAMBAHKAN) */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Deskripsi (Opsional)</label>
            <textarea 
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              rows="3"
              placeholder="Tambahkan keterangan singkat tentang materi..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="border-t pt-4">
            <label className="block text-gray-700 font-bold mb-2">File Materi (PDF/DOCX)</label>
            <input 
              type="file" 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              onChange={(e) => setFile(e.target.files[0])} 
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal ukuran file: 20MB.</p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 mt-6">
            <Link 
              to="/materials" 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={loading} 
              className={`px-4 py-2 text-white rounded transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? "Sedang Upload..." : "Upload Sekarang"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}