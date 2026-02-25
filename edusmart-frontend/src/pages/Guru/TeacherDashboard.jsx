import React, { useState, useEffect } from "react";
import api from "../../services/api"; // Sesuaikan path-nya
import { Search, Plus, Edit, Trash2, Download, X, FileText } from "lucide-react";

const MateriPelajaran = () => {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({});

  // State untuk Pop-up (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // State untuk Form
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchMaterials();
    }
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await api.get("/materials");
      setMaterials(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil data materi:", error);
    }
  };

  // --- FUNGSI HAPUS (DELETE) ---
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus materi ini? File PDF juga akan terhapus permanen loh!")) {
      try {
        await api.delete(`/materials/${id}`);
        alert("Materi berhasil dihapus!");
        fetchMaterials(); // Refresh tabel
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus materi.");
      }
    }
  };

  // --- FUNGSI BUKA MODAL UNTUK UPLOAD BARU ---
  const openUploadModal = () => {
    setIsEditMode(false);
    setTitle("");
    setSubject("");
    setDescription("");
    setFile(null);
    setIsModalOpen(true);
  };

  // --- FUNGSI BUKA MODAL UNTUK EDIT ---
  const openEditModal = (material) => {
    setIsEditMode(true);
    setEditId(material.id);
    setTitle(material.title);
    setSubject(material.subject);
    setDescription(material.description || "");
    setFile(null); // File tidak wajib diisi ulang saat edit
    setIsModalOpen(true);
  };

  // --- FUNGSI SIMPAN (UPLOAD / UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subject) {
      alert("Judul dan Mata Pelajaran wajib diisi!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("teacher_id", user.id);
    if (file) {
      formData.append("file", file); // Kalau edit, file path-nya disesuaikan di backend
    }

    try {
      if (isEditMode) {
        // Proses Edit
        // Karena Laravel menggunakan _method PUT untuk FormData
        formData.append("_method", "PUT");
        await api.post(`/materials/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Materi berhasil diupdate!");
      } else {
        // Proses Upload Baru
        if (!file) {
          alert("File PDF wajib diisi untuk materi baru!");
          setIsUploading(false);
          return;
        }
        await api.post("/materials", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Materi berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchMaterials(); // Refresh tabel
    } catch (error) {
      console.error("Error simpan data:", error);
      alert("Gagal menyimpan materi.");
    } finally {
      setIsUploading(false);
    }
  };

  // Filter pencarian
  const filteredMaterials = materials.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 font-sans w-full">
      {/* Header & Fitur Pencarian */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Materi Pelajaran</h1>
          <p className="text-sm text-gray-500 mt-1">Upload dan kelola bahan ajar.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari Judul atau Mapel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-sm whitespace-nowrap"
          >
            <Plus size={18} /> Upload Materi
          </button>
        </div>
      </div>

      {/* Tabel Materi */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 pl-6">Judul Materi</th>
                <th className="p-4">Mata Pelajaran</th>
                <th className="p-4">File</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400 font-medium">
                    Tidak ada materi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 capitalize">{item.title}</p>
                          <p className="text-[11px] text-gray-400">
                            Diunggah: {new Date(item.created_at).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
                        {item.subject}
                      </span>
                    </td>
                    <td className="p-4">
                      <a
                        href={`http://localhost:8000/storage/${item.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                      >
                        <Download size={16} /> Download PDF
                      </a>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Materi"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Materi"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP MODAL (FORM UPLOAD & EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-800">
                {isEditMode ? "Edit Materi" : "Upload Materi Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mata Pelajaran</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Matematika" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul Materi</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Aljabar" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi Singkat</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows="2" placeholder="Jelaskan isi materi..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  File PDF {isEditMode && <span className="text-gray-400 font-normal">(Kosongkan jika tidak ingin ganti file)</span>}
                </label>
                <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-3" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isUploading} className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:bg-blue-300">
                  {isUploading ? "Menyimpan..." : "Simpan Materi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MateriPelajaran;