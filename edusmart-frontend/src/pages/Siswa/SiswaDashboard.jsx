import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api"; // Gunakan instance API yang sudah kita buat
import { LogOut, BookOpen, Send, X, Bot, MessageCircle, FileText } from "lucide-react";
import Logo from "../../components/Logo"; 

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
      // Instance 'api' sudah otomatis bawa Token di Header
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

        if (response.data.success) {
            setChatHistory([...currentChat, { 
                sender: "ai", 
                text: response.data.data.message 
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Logo className="h-8" />
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold">Siswa</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
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
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Selamat Belajar, {user.name}! ✨</h1>
                <p className="opacity-90 text-blue-50 max-w-xl leading-relaxed">
                    Semua materi sudah siap diakses. Jika ada bagian yang sulit dipahami, jangan ragu klik tombol <b>Tanya AI</b> ya!
                </p>
            </div>
            <Bot size={180} className="absolute -right-10 -bottom-10 opacity-15 transform rotate-12" />
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-blue-600" size={24}/> Materi Pelajaran
            </h2>
            <span className="text-sm text-gray-500 font-medium">{materials.length} Materi ditemukan</span>
        </div>

        {/* Grid Materi */}
        {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={20} />
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase">
                                    {item.subject}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                {item.description || `Materi pembelajaran untuk mata pelajaran ${item.subject}.`}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50/50 border-t flex gap-2">
                            <a 
                                href={`http://localhost:8000/storage/${item.file_path}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition shadow-sm"
                            >
                                Baca PDF
                            </a>
                            
                            <button 
                                onClick={() => openChat(item)}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                            >
                                <MessageCircle size={14} />
                                Tanya AI
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada materi yang diupload oleh guru.</p>
            </div>
        )}

      </main>

      {/* MODAL CHAT AI */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] md:h-[550px] animate-in zoom-in duration-200">
                
                {/* Header Chat */}
                <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Tanya Materi AI</h3>
                            <p className="text-[10px] text-blue-100 opacity-80">Topik: {selectedMaterial?.title}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Chat */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                            }`}>
                                {msg.text}
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
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                    <input 
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ketik pertanyaanmu di sini..."
                        className="flex-1 bg-gray-100 border-none text-sm rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 transition outline-none"
                    />
                    <button 
                        type="submit"
                        disabled={!chatMessage.trim() || isAiTyping}
                        className="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition shadow-lg shadow-blue-100"
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