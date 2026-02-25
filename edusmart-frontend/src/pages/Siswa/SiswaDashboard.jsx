import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api"; // Gunakan instance API yang sudah kita buat
import { LogOut, BookOpen, Send, X, Bot, MessageCircle, FileText } from "lucide-react";
import Logo from "../../components/Logo"; 
import ReactMarkdown from 'react-markdown';

const SiswaDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [user, setUser] = useState({});
  
  // State untuk Chat AI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
        window.location.href = "/";
    } else {
        setUser(storedUser);
        fetchMaterials();
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiTyping]);

  const fetchMaterials = async () => {
    try {
      const response = await api.get("/materials");
      setMaterials(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal ambil materi:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const openChat = (material) => {
    setSelectedMaterial(material);
    setIsChatOpen(true);
    setChatHistory([
        { sender: "ai", text: `Halo ${user.name}! Saya asisten belajarmu. Ada yang bingung dari materi "${material.title}" ini?` }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const currentMessage = chatMessage;
    const currentChat = [...chatHistory, { sender: "user", text: currentMessage }];
    
    setChatHistory(currentChat);
    setChatMessage(""); 
    setIsAiTyping(true);

    try {
        const response = await api.post("/chat", {
            material_id: selectedMaterial.id,
            message: currentMessage
        });

        // KITA UBAH BAGIAN INI: Langsung cari variabel 'answer' dari Laravel
        if (response.data.answer) {
            setChatHistory([...currentChat, { 
                sender: "ai", 
                text: response.data.answer // <--- SESUAI DENGAN LABEL DARI LARAVEL
            }]);
        }
    } catch (error) {
        console.error("Error Chat:", error);
        setChatHistory([...currentChat, { 
            sender: "ai", 
            text: "Waduh, koneksi ke otak AI saya terputus. Coba tanya lagi ya!" 
        }]);
    } finally {
        setIsAiTyping(false);
    }
  };

  // Fungsi untuk mengambil inisial nama (misal "Budi" jadi "B")
  const getInitial = (name) => {
      return name ? name.charAt(0).toUpperCase() : "S";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Logo className="h-8" />
            <div className="flex items-center gap-4 md:gap-6">
                
                {/* User Info (Tampil di Desktop) */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-800 capitalize">{user.name}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider mt-0.5">
                            Siswa
                        </span>
                    </div>
                    {/* Avatar Inisial */}
                    <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm cursor-pointer">
                        {getInitial(user.name)}
                    </div>
                </div>

                <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

                {/* Tombol Logout */}
                <button 
                    onClick={handleLogout}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    title="Keluar"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-200/50 mb-10 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 capitalize">Selamat Belajar, {user.name}! ✨</h1>
                <p className="opacity-90 text-blue-50 max-w-xl leading-relaxed text-sm md:text-base">
                    Semua materi sudah siap diakses. Jika ada bagian yang sulit dipahami, jangan ragu klik tombol <b className="text-white">Tanya AI</b> ya!
                </p>
            </div>
            {/* Hiasan Background Banner */}
            <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 scale-110">
                <Bot size={200} strokeWidth={1.5} />
            </div>
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2.5">
                <BookOpen className="text-blue-600" size={26}/> Materi Pelajaran
            </h2>
            <span className="text-sm text-gray-500 font-semibold bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                {materials.length} Materi Tersedia
            </span>
        </div>

        {/* Grid Materi */}
        {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {materials.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden group">
                        
                        {/* Area Konten Card */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-5">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <FileText size={24} />
                                </div>
                                <span className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-100 text-[11px] font-bold rounded-full uppercase tracking-wider">
                                    {item.subject}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug capitalize group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mt-auto">
                                {item.description || `Materi pembelajaran untuk mata pelajaran ${item.subject}.`}
                            </p>
                        </div>

                        {/* Area Tombol Bawah */}
                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                            <a 
                                href={`http://localhost:8000/storage/${item.file_path}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Baca PDF
                            </a>
                            
                            <button 
                                onClick={() => openChat(item)}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all"
                            >
                                <MessageCircle size={16} />
                                Tanya AI
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <BookOpen className="text-gray-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">Belum Ada Materi</h3>
                <p className="text-gray-500 font-medium">Saat ini belum ada materi yang diupload oleh guru.</p>
            </div>
        )}

      </main>

      {/* MODAL CHAT AI */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] md:h-[550px] animate-in zoom-in duration-200">
                
                {/* Header Chat */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Tanya Materi AI</h3>
                            <p className="text-xs text-blue-100 opacity-90 capitalize">Topik: {selectedMaterial?.title}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Chat */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                            }`}>
                               {msg.sender === 'ai' ? (
    <div className="prose prose-sm max-w-none text-gray-700">
        <ReactMarkdown>
            {msg.text}
        </ReactMarkdown>
    </div>
) : (
    msg.text
)}
                            </div>
                        </div>
                    ))}
                    
                    {isAiTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Chat */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                    <input 
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ketik pertanyaanmu di sini..."
                        className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                    <button 
                        type="submit"
                        disabled={!chatMessage.trim() || isAiTyping}
                        className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </form>

            </div>
        </div>
      )}

    </div>
  );
};

export default SiswaDashboard;