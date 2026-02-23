import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import api from "../services/api"; // Pastikan path ini sudah benar
import { User, Mail, Save, ArrowLeft, Loader2, AlertCircle, Lock } from "lucide-react"; // Tambahkan Lock

export default function EditStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // State baru untuk password
  
  // State untuk loading
  const [isFetching, setIsFetching] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);    
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();

  // Ambil data siswa saat halaman dibuka
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`);
        const studentData = response.data.data || response.data;
        
        setName(studentData.name);
        setEmail(studentData.email);
        // Kita TIDAK mengambil password dari database karena password di-hash (rahasia)
      } catch (err) {
        setError("Gagal mengambil data siswa. Pastikan ID benar.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Siapkan data yang akan dikirim
      const payload = {
        name: name,
        email: email,
      };

      // JIKA admin mengisi kolom password, baru masukkan ke payload
      if (password.trim() !== "") {
        payload.password = password;
      }

      await api.put(`/students/${id}`, payload);
      navigate("/admin/students"); 
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' 
            ? err.response.data 
            : "Terjadi kesalahan validasi data."); 
      } else {
        setError("Terjadi kesalahan jaringan saat update data.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      
      {/* Header Halaman */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center gap-4">
        <Link to="/admin/students" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Data Siswa</h1>
            <p className="text-gray-500 text-sm">Perbarui informasi siswa di bawah ini.</p>
        </div>
      </div>

      {/* Card Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Banner Dekoratif Kecil */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 w-full"></div>

        <div className="p-8">
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={18} />
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              
              {/* Input Nama */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Nama Lengkap</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                      placeholder="Masukkan nama siswa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Alamat Email</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                      placeholder="contoh@siswa.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                </div>
              </div>

              {/* Input Password Baru (Opsional) */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Reset Password <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <p className="text-xs text-gray-500 mb-3">Kosongkan kolom ini jika tidak ingin mengubah password siswa.</p>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="password" // Sengaja ditutup agar tidak mengintip
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                      placeholder="Masukkan password baru..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      // TIDAK ADA REQUIRED di sini!
                    />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-8">
                 <Link 
                    to="/admin/students" 
                    className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition text-sm"
                 >
                   Batal
                 </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                        <Loader2 size={18} className="animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    <>
                        <Save size={18} /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>

            </form>
        </div>
      </div>
    </div>
  );
}