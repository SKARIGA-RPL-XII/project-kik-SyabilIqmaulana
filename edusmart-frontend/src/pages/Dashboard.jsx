import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Ambil data user dari localStorage (opsional, biar keren ada namanya)
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Selamat Datang, {user ? user.name : "Admin"}!
        </h1>
        <p className="text-gray-600 mb-6">Ini adalah halaman Dashboard Sekolah.</p>

        <div className="flex space-x-4">
          {/* Tombol Menuju Halaman Siswa */}
          <button
            onClick={() => navigate("/students")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition shadow"
          >
            Kelola Data Siswa
          </button>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}