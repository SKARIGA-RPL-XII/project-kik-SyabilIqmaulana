import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Kirim Request
      const response = await axios.post("http://127.0.0.1:8000/api/login", 
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Sukses:", response.data);

      // 2. Simpan Token
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 3. LOGIKA CEK ROLE (Agar Guru ke Dashboard Guru)
      const role = response.data.user.role;
      let targetUrl = '/';

      if (role === 'admin') {
        targetUrl = '/admin/dashboard';
      } else if (role === 'teacher') {
        targetUrl = '/teacher/dashboard'; // <-- INI YANG PENTING
      } else if (role === 'student') {
        targetUrl = '/student/dashboard';
      }

      // 4. Pindah Halaman
      window.location.href = targetUrl;

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        setError(err.response.data.message || "Email atau password salah.");
      } else {
        setError("Gagal terhubung ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background Gradient Biru-Ungu (Sesuai Gambar)
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      
      {/* Kartu Putih */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
             {/* Ikon EduSmart (Simulasi Logo) */}
             <div className="bg-blue-600 text-white p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
             <h1 className="text-2xl font-bold text-blue-700">EduSmart AI</h1>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">Platform Belajar Pintar Masa Depan</p>
        </div>

        {/* Judul */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Selamat Datang Kembali!</h2>

        {error && (
            <div className="mb-4 text-sm text-center text-red-600 bg-red-100 py-2 rounded">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="siswa@sekolah.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Tombol Gradient */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold text-sm shadow-lg transform transition hover:-translate-y-0.5
              ${loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
          >
            {loading ? "Memuat..." : "Masuk Sekarang"}
          </button>
        </form>

        {/* Footer Register Link */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-purple-600 transition">
             Daftar di sini
          </Link>
        </div>

      </div>
    </div>
  );
}