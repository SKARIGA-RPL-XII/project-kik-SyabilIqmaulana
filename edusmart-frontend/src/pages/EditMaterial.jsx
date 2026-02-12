import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Layout from '../components/Layout'; // Uncomment jika pakai layout

const EditMaterial = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Form
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        teacher_id: '',
        description: '',
    });
    const [file, setFile] = useState(null);

    // State Data Pendukung (Daftar Guru)
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // 1. Ambil Data Materi yang mau diedit
        const fetchMaterial = axios.get(`http://127.0.0.1:8000/api/materials/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Ambil Daftar Guru untuk Dropdown
        const fetchTeachers = axios.get(`http://127.0.0.1:8000/api/teachers`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Jalankan keduanya bersamaan
        Promise.all([fetchMaterial, fetchTeachers])
            .then(([resMaterial, resTeachers]) => {
                const data = resMaterial.data;
                
                // Isi form dengan data lama
                setFormData({
                    title: data.title,
                    subject: data.subject,
                    teacher_id: data.teacher_id, // ID Guru otomatis terpilih nanti
                    description: data.description || '',
                });

                // Simpan daftar guru
                // Cek format respon (kadang dibungkus .data lagi)
                setTeachers(resTeachers.data.data || resTeachers.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                alert("Gagal mengambil data.");
                setLoading(false);
            });

    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        data.append('teacher_id', formData.teacher_id);
        data.append('description', formData.description);
        
        // Method Spoofing untuk File Upload di Edit (PUT)
        data.append('_method', 'PUT'); 

        if (file) {
            data.append('file_path', file);
        }

        try {
            // Perhatikan URL POST, tapi data mengandung _method: PUT
            await axios.post(`http://127.0.0.1:8000/api/materials/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });
            alert('Materi berhasil diupdate!');
            navigate('/materials');
        } catch (error) {
            console.error("Error updating:", error);
            if (error.response && error.response.data.errors) {
                 alert("Gagal update: " + JSON.stringify(error.response.data.errors));
            } else {
                 alert('Gagal update materi.');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8"> 
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                
                <div className="bg-blue-600 p-6">
                    <h2 className="text-2xl font-bold text-white">Edit Materi Pelajaran</h2>
                    <p className="text-blue-100 text-sm mt-1">Silakan ubah informasi materi di bawah ini.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Input Judul */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
                            <input 
                                type="text" 
                                name="title" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.title} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Input Mapel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                            <input 
                                type="text" 
                                name="subject" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.subject} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Dropdown Guru (SUDAH DIUPDATE) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pengampu</label>
                            <select
                                name="teacher_id"
                                value={formData.teacher_id} // Ini akan otomatis memilih guru yang sesuai ID
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                required
                            >
                                <option value="">-- Pilih Guru --</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} {teacher.nip ? `(NIP: ${teacher.nip})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Input Deskripsi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea 
                                name="description" 
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.description} 
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* Input File */}
                        <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ganti File Materi</label>
                            <input 
                                type="file" 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                                onChange={handleFileChange} 
                            />
                            <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengganti file.</p>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button 
                                type="button"
                                onClick={() => navigate('/materials')}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition"
                            >
                                Simpan Perubahan
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditMaterial;