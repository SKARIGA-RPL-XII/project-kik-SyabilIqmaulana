import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, User, Mail, Lock } from 'lucide-react';

const AddStudent = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    // State untuk menampung inputan form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' // Default role diset student
    });

    // Fungsi untuk menangani perubahan input teks
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Fungsi saat tombol simpan ditekan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/students', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            navigate('/students');
        } catch (error) {
            console.error("Error menambah siswa:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg('Terjadi kesalahan saat menyimpan data. Pastikan server menyala.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header Area */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/students')}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                    title="Kembali"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Tambah Data Siswa</h2>
                    <p className="text-gray-500 text-sm mt-1">Masukkan informasi siswa baru ke dalam sistem.</p>
                </div>
            </div>

            {/* Alert Error jika gagal */}
            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
                    <span className="font-semibold">Gagal:</span> {errorMsg}
                </div>
            )}

            {/* Form Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Garis Aksen di Atas Card */}
                <div className="h-2 w-full bg-indigo-500"></div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    
                    {/* Input Nama */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-700"
                                placeholder="Masukkan nama siswa"
                            />
                        </div>
                    </div>

                    {/* Input Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Alamat Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400" />
                            </div>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-700"
                                placeholder="siswa@sekolah.id"
                            />
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Password Akun</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-700"
                                placeholder="Buat password untuk siswa..."
                            />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="pt-4 flex items-center justify-end gap-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/students')}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2.5 flex items-center gap-2 text-white rounded-xl font-medium transition ${
                                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            }`}
                        >
                            <Save size={18} />
                            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddStudent;