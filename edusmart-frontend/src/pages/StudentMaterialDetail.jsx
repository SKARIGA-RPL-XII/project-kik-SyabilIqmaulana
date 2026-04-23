import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileText, Download, ClipboardList, ChevronRight, Eye } from "lucide-react";
import AIAssistant from '../components/AIAssistant';

const StudentMaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaterialDetail();
  }, [id]);

  const fetchMaterialDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8000/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMaterial(response.data.data);
      setTasks(response.data.data.tasks || []); 
    } catch (error) {
      console.error("Gagal mengambil detail materi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat materi...</div>;
  }

  if (!material) {
    return <div className="p-8 text-center text-red-500">Materi tidak ditemukan.</div>;
  }

  // URL lengkap ke file di storage backend
  const fileUrl = `http://localhost:8000/storage/${material.file_path}`;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 mt-4 pb-20">
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition font-medium"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Materi</span>
        </button>

        {/* Card Info Materi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={32} />
              </div>
              <div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3 inline-block">
                  {material.subject}
                </span>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{material.title}</h1>
                <p className="text-gray-500 text-sm">
                  Diupload pada: {new Date(material.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <a 
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-medium rounded-xl transition-colors shrink-0"
            >
              <Download size={20} />
              Download Materi
            </a>
          </div>
        </div>

        {/* --- FITUR BARU: PREVIEW MATERI --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Eye className="text-blue-500" size={20} />
            <h2 className="font-bold text-gray-700">Preview Materi</h2>
          </div>
          <div className="p-2">
            {material.file_path?.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`${fileUrl}#toolbar=0`} 
                className="w-full h-[600px] rounded-lg border border-gray-200"
                title="Preview Materi"
              ></iframe>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FileText size={48} className="mb-2 opacity-20" />
                <p>Preview tidak tersedia untuk format file ini.</p>
                <p className="text-xs">Silakan gunakan tombol download di atas.</p>
              </div>
            )}
          </div>
        </div>
        {/* --------------------------------- */}

        {/* Bagian Daftar Tugas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <ClipboardList className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Tugas untuk Materi Ini</h2>
          </div>
          
          <div className="p-6 space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Belum ada tugas untuk materi ini.</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors gap-4"
                >
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      Tugas {index + 1}: {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                  
                  <Link 
                    to={`/student/tasks/${task.id}/submit`}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition shadow-sm shrink-0"
                  >
                    Kumpulkan Tugas
                    <ChevronRight size={18} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tetap sertakan Assistant AI di bawah */}
      <AIAssistant materialId={id} />
    </>
  );
};

export default StudentMaterialDetail;