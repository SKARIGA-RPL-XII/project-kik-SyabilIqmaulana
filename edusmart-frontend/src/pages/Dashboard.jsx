import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Jangan lupa import axios
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        materials: 0
    });

    useEffect(() => {
        // Cek apakah user ada dan rolenya admin
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token"); // Ambil token untuk akses API
        
        if (!userData || userData.role !== 'admin') {
            navigate("/", { replace: true });
            return;
        } 
        
        // Fungsi untuk mengambil data asli dari Laravel
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Mengambil 3 data sekaligus secara paralel agar loading lebih cepat
                const [studentsRes, teachersRes, materialsRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/students", { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    axios.get("http://localhost:8000/api/teachers", { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    axios.get("http://localhost:8000/api/materials", { 
                        headers: { Authorization: `Bearer ${token}` } 
                    })
                ]);

                // Menghitung jumlah array dari masing-masing data
                setStats({ 
                    students: studentsRes.data.data.length, 
                    teachers: teachersRes.data.data.length, 
                    materials: materialsRes.data.data.length 
                });
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData(); // Panggil fungsinya
        
    }, [navigate]);

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition duration-300 transform hover:-translate-y-1">
            <div className={`p-4 rounded-xl ${color} text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                    {/* Jika masih loading tampilkan titik-titik, jika selesai tampilkan angka asli */}
                    {isLoading ? "..." : value} 
                </h3>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                <p className="text-gray-500 text-sm mt-1">Ringkasan data aplikasi EduSmart AI</p>
            </div>

            {/* Banner Selamat Datang */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin! 👋</h1>
                    <p className="opacity-90">Ini adalah pusat kontrol aplikasi EduSmart AI. Pantau perkembangan seluruh data di sini.</p>
                </div>
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                    <Users size={200} />
                </div>
            </div>

            {/* Grid Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Siswa" 
                    value={stats.students} 
                    icon={<GraduationCap size={24} />} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Total Guru" 
                    value={stats.teachers} 
                    icon={<Users size={24} />} 
                    color="bg-purple-500" 
                />
                <StatCard 
                    title="Materi Pembelajaran" 
                    value={stats.materials} 
                    icon={<BookOpen size={24} />} 
                    color="bg-orange-500" 
                />
            </div>

            {/* Tabel Aktivitas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600"/>
                    Aktivitas Terbaru
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                            <tr>
                                <th className="p-4 rounded-tl-lg">User</th>
                                <th className="p-4">Aktivitas</th>
                                <th className="p-4">Waktu</th>
                                <th className="p-4 rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Dummy data untuk aktivitas, nanti bisa diganti dengan log asli jika backend sudah siap */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">Budi Santoso (Siswa)</td>
                                <td className="p-4">Login ke sistem</td>
                                <td className="p-4">2 menit lalu</td>
                                <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Sukses</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">Siti Aminah (Guru)</td>
                                <td className="p-4">Upload Materi React JS</td>
                                <td className="p-4">1 jam lalu</td>
                                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Upload</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;