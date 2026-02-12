import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // State untuk pindah mode Login <-> Register
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // Untuk notifikasi error/sukses
  const navigate = useNavigate();

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // Handle Ketikan User
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit (Login atau Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const url = isLogin 
        ? "http://localhost:8000/api/login" 
        : "http://localhost:8000/api/register";

    try {
      const response = await axios.post(url, formData);

      if (isLogin) {
        // Logika jika Login Sukses
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("role", response.data.user.role); // Simpan role
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/dashboard";
        // Arahkan sesuai Role
        if (response.data.user.role === 'guru') {
            navigate("/teacher-dashboard");
        } else {
            navigate("/dashboard");
        }
      } else {
        // Logika jika Register Sukses
        setMessage({ type: "success", text: "Akun berhasil dibuat! Silakan Login." });
        setIsLogin(true); // Pindah otomatis ke tab Login
        setFormData({ ...formData, password: "", password_confirmation: "" }); // Reset password
      }

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan koneksi.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header / Logo Area */}
       <div className="bg-gray-50 p-6 flex flex-col items-center border-b">
            {/* Panggil Komponen Logo, atur tingginya */}
            <Logo className="h-14" /> 
            <p className="text-gray-500 text-sm mt-2">Platform Belajar Pintar Masa Depan</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
            
            {/* Title Dinamis */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {isLogin ? "Selamat Datang Kembali!" : "Buat Akun Baru"}
            </h2>

            {/* Alert Message */}
            {message && (
                <div className={`p-3 rounded mb-4 text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Input Nama (Hanya muncul saat Register) */}
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" name="name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="John Doe"
                            value={formData.name} onChange={handleChange} required 
                        />
                    </div>
                )}

                {/* Input Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                        type="email" name="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="siswa@sekolah.sch.id"
                        value={formData.email} onChange={handleChange} required 
                    />
                </div>

                {/* Input Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" name="password"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="••••••••"
                        value={formData.password} onChange={handleChange} required 
                    />
                </div>

                {/* Input Konfirmasi Password (Hanya saat Register) */}
                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <input 
                            type="password" name="password_confirmation"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                            value={formData.password_confirmation} onChange={handleChange} required 
                        />
                    </div>
                )}

                {/* Tombol Submit */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                >
                    {isLoading ? "Memproses..." : (isLogin ? "Masuk Sekarang" : "Daftar Sekarang")}
                </button>
            </form>

            {/* Switch Login/Register */}
            <div className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
                    className="text-blue-600 font-bold hover:underline"
                >
                    {isLogin ? "Daftar di sini" : "Login di sini"}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;