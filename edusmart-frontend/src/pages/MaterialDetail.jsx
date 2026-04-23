import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, FileText, Download, Eye, Plus, ClipboardList } from 'lucide-react';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaterialDetail();
  }, [id]);

  const fetchMaterialDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterial(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil detail materi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat data materi...</div>;
  if (!material) return <div className="p-8 text-center text-red-500 font-bold">Materi tidak ditemukan!</div>;

  const fileUrl = `http://127.0.0.1:8000/storage/${material.file_path}`;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* TOMBOL KEMBALI */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium"
      >
        <ArrowLeft size={20} />
        <span>Kembali ke Daftar Materi</span>
      </button>

      {/* CARD 1: INFORMASI UTAMA */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={32} />
            </div>
            <div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {material.subject || 'Mata Pelajaran'}
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">{material.title}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Diupload pada: {new Date(material.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>

          {material.file_path && (
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              <Download size={20} />
              Download File
            </a>
          )}
        </div>
      </div>

      {/* --- FITUR REVISI: PREVIEW MATERI --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Eye className="text-blue-500" size={20} />
          <h2 className="font-bold text-gray-700">Preview Materi (Tampilan Guru)</h2>
        </div>
        <div className="p-2">
          {material.file_path?.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={`${fileUrl}#toolbar=0`} 
              className="w-full h-[600px] rounded-lg border border-gray-200"
              title="Preview PDF Guru"
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText size={48} className="mb-2 opacity-20" />
              <p>Preview tidak tersedia untuk format file ini.</p>
              <p className="text-xs italic">Silakan klik tombol download untuk melihat file.</p>
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: DAFTAR TUGAS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Tugas Terkait</h2>
          </div>
          <Link 
            to={`/teacher/materials/${id}/add-task`} 
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition text-sm font-bold shadow-sm"
          >
            <Plus size={18} />
            Tambah Tugas
          </Link>
        </div>

        <div className="p-6">
          {material.tasks && material.tasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {material.tasks.map((task, index) => (
                <div key={task.id} className="group border border-gray-200 p-5 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">Tugas {index + 1}: {task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">
                      📅 Tenggat: {new Date(task.deadline).toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => navigate(`/teacher/materials/${material.id}/submissions`)}
                      className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1"
                    >
                      Lihat Pengumpulan Materi &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Belum ada tugas untuk materi ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;