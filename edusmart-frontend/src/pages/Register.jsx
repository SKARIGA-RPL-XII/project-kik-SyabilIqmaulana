import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if(formData.password !== formData.password_confirmation) {
        alert("Password dan Konfirmasi tidak sama!");
        return;
    }

    setLoading(true);

    try {
        // Sesuaikan endpoint register API kamu
        await axios.post("http://127.0.0.1:8000/api/register", {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            role: 'student' // Default daftar sebagai siswa
        });
        
        alert("Pendaftaran Berhasil! Silakan Login.");
        navigate("/"); // Kembali ke login
    } catch (error) {
        console.error(error);
        alert("Gagal Mendaftar. Cek data kembali.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">EduSmart AI</h1>
          <p className="text-xs text-gray-400 mt-1">Platform Belajar Pintar Masa Depan</p>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Buat Akun Baru</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Nama Lengkap</label>
            <input name="name" onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Email Address</label>
            <input name="email" type="email" onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="siswa@sekolah.sch.id" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Password</label>
            <input name="password" type="password" onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="••••••" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Konfirmasi Password</label>
            <input name="password_confirmation" type="password" onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 mt-2 rounded-lg text-white font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Sudah punya akun? <Link to="/" className="font-bold text-blue-600 hover:text-purple-600">Login di sini</Link>
        </div>
      </div>
    </div>
  );
}