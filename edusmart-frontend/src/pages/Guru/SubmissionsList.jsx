import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, CheckCircle, Search, FileText } from "lucide-react";

const SubmissionsList = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [materialId]);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get(`/materials/${materialId}/submissions`);
      setSubmissions(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengumpulan:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI BARU: Untuk mengupdate angka saat guru mengetik ---
  const handleInputChange = (id, field, value) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  // --- FUNGSI SIMPAN NILAI ---
  const handleGiveGrade = async (id, grade, feedback) => {
    try {
      await api.put(`/submissions/${id}/grade`, { grade, feedback });
      alert("Nilai berhasil disimpan!");
      fetchSubmissions(); // Refresh data dari database setelah sukses
    } catch (error) {
      alert("Gagal menyimpan nilai.");
    }
  };

  const filteredSubmissions = submissions.filter((s) =>
    s.student?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 font-sans w-full min-h-screen bg-gray-50/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Kembali ke Materi
          </button>
          <h1 className="text-2xl font-extrabold text-gray-800">Daftar Pengumpulan Tugas</h1>
          <p className="text-sm text-gray-500 mt-1">Evaluasi hasil pekerjaan siswa di bawah ini.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 pl-6">Siswa</th>
                <th className="p-4">File Jawaban</th>
                <th className="p-4 text-center">Nilai</th>
                <th className="p-4">Feedback Guru</th>
                <th className="p-4 pr-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">Sedang memuat data...</td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                    Belum ada siswa yang mengumpulkan tugas untuk materi ini.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {s.student?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{s.student?.name}</p>
                          <p className="text-[11px] text-gray-400">{s.student?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <a
                        href={`http://localhost:8000/storage/${s.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors"
                      >
                        <FileText size={14} /> Buka PDF
                      </a>
                    </td>

                    {/* --- INPUT NILAI SUDAH DIPERBAIKI --- */}
                    <td className="p-4">
                      <input
                        type="number"
                        placeholder="0-100"
                        value={s.grade || ""}
                        onChange={(e) => handleInputChange(s.id, "grade", e.target.value)}
                        className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-center"
                      />
                    </td>

                    {/* --- INPUT FEEDBACK SUDAH DIPERBAIKI --- */}
                    <td className="p-4 text-right">
                      <input
                        type="text"
                        placeholder="Beri masukan..."
                        value={s.feedback || ""}
                        onChange={(e) => handleInputChange(s.id, "feedback", e.target.value)}
                        className="w-full min-w-[150px] px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </td>

                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleGiveGrade(s.id, s.grade, s.feedback)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all shadow-sm"
                        title="Simpan Nilai & Feedback"
                      >
                        <CheckCircle size={22} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsList;