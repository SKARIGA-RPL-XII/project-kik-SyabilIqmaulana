import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// PERHATIKAN BARIS INI: Harus ada 'export default'
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

 try {
      // Pastikan URL ini benar
      const response = await axios.post("http://127.0.0.1:8000/api/login", 
        {
          email: email,       // Data yang dikirim
          password: password,
        },
        {
          // BAGIAN INI WAJIB ADA UNTUK MENGHINDARI ERROR CSRF/HTML
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      console.log("Login Sukses:", response.data);

      // Simpan token
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login Berhasil!");
      navigate("/dashboard");

    } catch (err) {
      // ... (kode catch kamu tetap sama)
      console.error("Login Error:", err);
      if (err.response) {
        setError(err.response.data.message || "Email atau password salah");
      } else {
        setError("Gagal terhubung ke server. Pastikan Laravel (port 8000) menyala.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login EduSmart</h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}