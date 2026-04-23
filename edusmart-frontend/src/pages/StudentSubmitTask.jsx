import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UploadCloud, ArrowLeft, File, CheckCircle, Award, MessageSquare, ExternalLink } from "lucide-react";

const StudentSubmitTask = () => {
  const { id } = useParams(); // Mendapatkan task_id dari URL
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State baru untuk mengecek status pengumpulan
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 
  const studentId = user ? user.id : 1; // Pastikan ini sesuai dengan ID siswa di tabel database

  // Mengecek apakah siswa sudah pernah mengirim tugas ini saat komponen dimuat
  useEffect(() => {
    checkSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkSubmission = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/tasks/${id}/my-submission?student_id=${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setExistingSubmission(response.data.data);
      }
    } catch (error) {
      // BONGKAR ERROR DI SINI:
      console.error("Detail Error API:", error.response || error);
      
      if (error.response && error.response.status !== 404) {
        // Jika errornya BUKAN 404 (Not Found), tampilkan popup error server
        alert("Peringatan: Backend Error! Cek Inspect Element -> Console. Pesan: " + (error.response.data.message || error.message));
      } else {
        console.log("Siswa memang belum mengumpulkan tugas ini.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani saat file dipilih
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fungsi untuk mengirim file ke API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        title: "Peringatan!",
        text: "Silakan pilih file jawaban terlebih dahulu.",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("task_id", id);
      formData.append("file", file);
      formData.append("student_id", studentId); 

      await axios.post("http://localhost:8000/api/submissions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Tugas kamu berhasil dikumpulkan.",
        icon: "success",
        confirmButtonColor: "#f97316",
      }).then(() => {
        // Alih-alih kembali (-1), kita panggil fungsi cek lagi agar tampilan berubah jadi halaman nilai
        checkSubmission();
      });

    } catch (error) {
      console.error("Gagal kumpul tugas:", error);
      Swal.fire({
        title: "Gagal!",
        text: error.response?.data?.message || "Terjadi kesalahan saat mengumpulkan tugas.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 mt-8">
        <p className="text-gray-500 font-medium">Memuat data pengumpulan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-8 p-4 md:p-0 font-sans">
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition font-medium"
      >
        <ArrowLeft size={18} />
        <span>Kembali ke Materi</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
        
        {/* JIKA SUDAH MENGUMPULKAN */}
        {existingSubmission ? (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-4">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">Tugas Telah Dikumpulkan</h2>
              <p className="text-gray-500 text-sm mt-2">Berikut adalah detail pengumpulan tugasmu.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-5">
              {/* Info File */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-200 text-blue-500 shadow-sm">
                  <File size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">File Jawaban</p>
                  <a 
                    href={`http://localhost:8000/storage/${existingSubmission.file_path}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
                  >
                    Buka File <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Info Nilai */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award size={16} /> Nilai Tugas
                  </p>
                  <div className="inline-block px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <p className={`text-2xl font-extrabold ${existingSubmission.grade !== null ? "text-green-600" : "text-gray-400"}`}>
                      {existingSubmission.grade !== null ? existingSubmission.grade : "-"}
                      <span className="text-sm text-gray-400 ml-1 font-normal">/ 100</span>
                    </p>
                  </div>
                  {existingSubmission.grade === null && (
                    <p className="text-xs text-orange-500 mt-2 font-medium italic">* Menunggu penilaian guru</p>
                  )}
                </div>

                {/* Info Feedback */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MessageSquare size={16} /> Catatan Guru
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm min-h-[80px]">
                    {existingSubmission.feedback ? (
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        "{existingSubmission.feedback}"
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">Belum ada catatan.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* JIKA BELUM MENGUMPULKAN (FORM UPLOAD) */
          <>
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-orange-100 text-orange-500 rounded-full mb-4">
                <UploadCloud size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">Kumpulkan Tugas</h2>
              <p className="text-gray-500 text-sm mt-2">Unggah file jawaban kamu di sini (PDF, Word, atau ZIP).</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Area Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.zip,.rar"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  {file ? (
                    <>
                      <File size={48} className="text-blue-500" />
                      <div>
                        <p className="font-bold text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <span className="mt-2 text-sm text-orange-500 font-bold hover:underline">Ganti File</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={48} className="text-gray-400" />
                      <p className="font-bold text-gray-700">Klik untuk memilih file</p>
                      <p className="text-xs text-gray-400 font-medium">Maksimal ukuran file: 10MB</p>
                    </>
                  )}
                </label>
              </div>

              {/* Tombol Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 flex items-center justify-center gap-2 rounded-xl text-white font-bold transition shadow-md
                  ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
              >
                {isSubmitting ? (
                  "Mengunggah..."
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Kirim Jawaban
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentSubmitTask;