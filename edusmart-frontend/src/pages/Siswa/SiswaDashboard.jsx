import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, BookOpen, MessageSquare, Send, X, Bot, User } from "lucide-react";
import Logo from "../../components/Logo"; 

const SiswaDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [user, setUser] = useState({});
  
  // State untuk Chat AI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Halo! Saya asisten AI belajarmu. Pilih materi lalu tanya apa saja!" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  useEffect(() => {
    // Ambil data user dari local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser || {});
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Buka Chat Modal
  const openChat = (material) => {
    setSelectedMaterial(material);
    setIsChatOpen(true);
    // Reset chat history saat buka materi baru (opsional)
    setChatHistory([
        { sender: "ai", text: `Halo ${user.name}! Ada yang belum paham tentang materi "${material.title}"?` }
    ]);
  };

  // Kirim Pesan ke AI (Simulasi)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // 1. Tambah pesan user ke chat
    const newHistory = [...chatHistory, { sender: "user", text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage("");
    setIsAiTyping(true);

    // 2. Simulasi AI Menjawab (Nanti diganti dengan API Call beneran)
    setTimeout(() => {
        const aiResponse = { 
            sender: "ai", 
            text: `Ini adalah jawaban simulasi AI untuk pertanyaan: "${chatMessage}" mengenai materi ${selectedMaterial.title}. (Sambungkan ke API OpenAI/Gemini di sini nanti)` 
        };
        setChatHistory([...newHistory, aiResponse]);
        setIsAiTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* === NAVBAR === */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Logo className="h-8" />
            <div className="flex items-center gap-4">
                <span className="text-gray-600 hidden md:block">Halo, <span className="font-bold text-gray-800">{user.name}</span> 👋</span>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span className="hidden md:inline">Keluar</span>
                </button>
            </div>
        </div>
      </nav>

      {/* === MAIN CONTENT === */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Banner Selamat Datang */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Semangat Belajar, {user.name}! 🚀</h1>
                <p className="opacity-90 text-blue-100 max-w-lg">
                    Akses materi pelajaranmu di bawah ini dan gunakan fitur <b>Tanya AI</b> jika kamu mengalami kesulitan.
                </p>
            </div>
            {/* Dekorasi Icon */}
            <Bot size={150} className="absolute -right-6 -bottom-6 opacity-20 transform rotate-12" />
        </div>

        {/* Grid Materi */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-600"/> Daftar Materi Tersedia
        </h2>

        {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col group">
                        {/* Card Header */}
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wide">
                                    {item.subject}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2">
                                Pelajari materi tentang {item.title} untuk mata pelajaran {item.subject}.
                            </p>
                        </div>

                        {/* Card Footer / Actions */}
                        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex gap-3">
                            {/* Tombol Download/Baca */}
                            <a 
                                href={`http://localhost:8000/storage/${item.file_path}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                            >
                                <BookOpen size={16} />
                                Baca PDF
                            </a>
                            
                            {/* Tombol Tanya AI */}
                            <button 
                                onClick={() => openChat(item)}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm"
                            >
                                <Bot size={16} />
                                Tanya AI
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">Belum ada materi yang tersedia saat ini.</p>
            </div>
        )}

      </main>

      {/* === MODAL CHAT AI (Floating & Modern) === */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-fade-in-up">
                
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Asisten AI Pintar</h3>
                            <p className="text-xs text-blue-100">Diskusi: {selectedMaterial?.title}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Body (History) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isAiTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-500 text-xs px-3 py-2 rounded-full animate-pulse">
                                AI sedang mengetik...
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
                    <input 
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Tanyakan sesuatu tentang materi ini..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button 
                        type="submit"
                        disabled={!chatMessage.trim() || isAiTyping}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
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