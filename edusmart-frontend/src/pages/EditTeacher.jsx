import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { User, Mail, Save, ArrowLeft, Loader2, AlertCircle, Lock } from "lucide-react";

export default function EditTeacher() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  
  const [isFetching, setIsFetching] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);    
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/api/teachers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const teacherData = response.data.data || response.data;
        
        setName(teacherData.name);
        setEmail(teacherData.email);
      } catch (err) {
        setError("Gagal mengambil data guru. Pastikan ID benar.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload = { name, email };

      // Hanya kirim password jika diisi (opsional)
      if (password.trim() !== "") {
        payload.password = password;
      }

      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/teachers/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/teachers"); 
    } catch (err) {
      // Perbaikan penangkap error Laravel
      if (err.response && err.response.data && err.response.data.errors) {
        // Jika Laravel mengirim detail error validasi (misal: email atau password salah)
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response && err.response.data && err.response.data.message) {
        // Jika Laravel mengirim pesan umum
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan jaringan saat update data.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-sans">
      
      {/* Header Halaman */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center gap-4">
        <Link to="/teachers" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Data Guru</h1>
            <p className="text-gray-500 text-sm">Perbarui informasi pengajar di bawah ini.</p>
        </div>
      </div>

      {/* Card Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Banner Dekoratif Indigo */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 w-full"></div>

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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                      placeholder="Masukkan nama guru"
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                      placeholder="guru@sekolah.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                </div>
              </div>

              {/* Input Password Baru (Opsional) */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mt-4">
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Reset Password <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <p className="text-xs text-gray-500 mb-3">Kosongkan kolom ini jika tidak ingin mengubah password guru.</p>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-indigo-300" />
                    </div>
                    <input
                      type="password" 
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                      placeholder="Masukkan password baru..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-8">
                 <Link 
                    to="/teachers" 
                    className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition text-sm"
                 >
                   Batal
                 </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <><Loader2 size={18} className="animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save size={18} /> Simpan Perubahan</>
                  )}
                </button>
              </div>

            </form>
        </div>
      </div>
    </div>
  );
}