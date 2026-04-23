import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTask = () => {
    // Mengambil {id} materi dari URL (misal: /teacher/materials/1/add-task)
    const { id } = useParams(); 
    const navigate = useNavigate();

    // State untuk menyimpan inputan form
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Ambil token dari localStorage (sesuaikan dengan caramu menyimpan token saat login)
            const token = localStorage.getItem('token'); 

            // Kirim data ke Backend Laravel
            await axios.post(`http://127.0.0.1:8000/api/materials/${id}/tasks`, {
                title: title,
                description: description,
                deadline: deadline
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Mantap! Tugas berhasil ditambahkan.');
            navigate(-1); // Otomatis kembali ke halaman sebelumnya
            
        } catch (error) {
            console.error("Ada yang salah:", error);
            alert('Gagal menambahkan tugas. Cek console untuk detailnya.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Tambah Tugas Baru</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label>Judul Tugas:</label><br />
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Deskripsi/Instruksi:</label><br />
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        rows="5"
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Batas Waktu (Deadline):</label><br />
                    <input 
                        type="datetime-local" 
                        value={deadline} 
                        onChange={(e) => setDeadline(e.target.value)} 
                        required 
                        style={{ padding: '8px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ padding: '10px', backgroundColor: '#4C6FFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {isLoading ? 'Menyimpan...' : 'Simpan Tugas'}
                </button>
                
                <button 
                    type="button" 
                    onClick={() => navigate(-1)}
                    style={{ padding: '10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Batal
                </button>

            </form>
        </div>
    );
};

export default AddTask;