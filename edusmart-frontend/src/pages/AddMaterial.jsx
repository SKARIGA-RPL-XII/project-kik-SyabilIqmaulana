import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; 

export default function AddMaterial() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState(""); 
  const [teacherId, setTeacherId] = useState("");
  const [file, setFile] = useState(null);

  const [teachers, setTeachers] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Ambil data user dari localStorage untuk cek Role & ID
  const user = JSON.parse(localStorage.getItem('user'));
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    // 1. Jika dia GURU, langsung set teacherId dari ID user yang login
    if (isTeacher) {
      setTeacherId(user.id);
    } 
    // 2. Jika dia ADMIN, baru ambil daftar semua guru untuk dropdown
    else {
      const fetchTeachers = async () => {
        try {
          const res = await api.get("/teachers");
          setTeachers(res.data.data || res.data);
        } catch (err) {
          console.error("Gagal load guru:", err);
        }
      };
      fetchTeachers();
    }
  }, [isTeacher, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherId) {
      alert("ID Guru tidak terdeteksi!");
      return;
    }
    if (!file) {
      alert("Harap pilih file materi!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("teacher_id", teacherId); 
    formData.append("file", file); 

    try {
      await api.post("/materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Materi berhasil diupload!");
      navigate("/materials");
    } catch (err) {
      console.error("Error Upload:", err);
      const errorData = err.response?.data;
      alert("Gagal: " + (errorData?.message || "Terjadi kesalahan server"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upload Materi Baru</h2>
            <p className="text-gray-500 text-sm">Lengkapi detail materi di bawah ini.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Judul */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Materi</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Masukkan judul materi..."
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Input Mapel */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mata Pelajaran</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Contoh: Fisika, Ekonomi..."
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
            />
          </div>

          {/* Dropdown Guru (Hanya muncul jika ADMIN) */}
          {!isTeacher ? (
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Guru Pengampu</label>
                <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}           
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                required
                >
                <option value="">-- Pilih Guru --</option>
                {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
                </select>
            </div>
          ) : (
            /* Jika Guru, kita tampilkan Info saja agar mereka tahu materi diupload atas nama mereka */
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">Mengupload sebagai:</p>
                <p className="text-sm font-bold text-blue-800">{user.name}</p>
            </div>
          )}

          {/* Input Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi (Opsional)</label>
            <textarea 
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
              rows="3"
              placeholder="Berikan deskripsi singkat mengenai materi ini..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-400 transition bg-gray-50">
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Pilih File Materi (PDF/DOCX)</label>
            <input 
              type="file" 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" 
              onChange={(e) => setFile(e.target.files[0])} 
              accept=".pdf,.doc,.docx"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Link to="/materials" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Batal
            </Link>
            <button 
              type="submit" 
              disabled={loading} 
              className={`px-8 py-3 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'}`}
            >
              {loading ? "Sedang Mengirim..." : "Upload Materi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}