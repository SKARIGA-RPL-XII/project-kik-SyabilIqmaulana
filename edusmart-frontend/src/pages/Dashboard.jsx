import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, TrendingUp, LogOut } from 'lucide-react';


const DashboardAdmin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        materials: 0
    });

    useEffect(() => {
        // Cek apakah user ada dan rolenya admin
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || userData.role !== 'admin') {
            navigate("/", { replace: true });
        } else {
            // Simulasi fetch data
            setStats({ students: 120, teachers: 15, materials: 45 });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/", { replace: true });
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className={`p-4 rounded-xl ${color} text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            {/* Header dengan tombol Logout */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 text-sm">Admin Panel</h2>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium"
                >
                    <LogOut size={18} /> Keluar
                </button>
            </div>

            {/* Banner Selamat Datang */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin! 👋</h1>
                    <p className="opacity-90">Ini adalah pusat kontrol aplikasi EduSmart AI. Pantau perkembangan siswa di sini.</p>
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
                                <th className="p-3">User</th>
                                <th className="p-3">Aktivitas</th>
                                <th className="p-3">Waktu</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="p-3 font-medium">Budi Santoso (Siswa)</td>
                                <td className="p-3">Login ke sistem</td>
                                <td className="p-3">2 menit lalu</td>
                                <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Sukses</span></td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Siti Aminah (Guru)</td>
                                <td className="p-3">Upload Materi React JS</td>
                                <td className="p-3">1 jam lalu</td>
                                <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Upload</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;