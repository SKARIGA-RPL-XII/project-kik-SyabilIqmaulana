import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const AIAssistant = ({ materialId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll ke bawah saat ada pesan baru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Mengambil History Chat saat panel dibuka
  useEffect(() => {
    if (isOpen && materialId) {
      fetchChatHistory();
    }
  }, [isOpen, materialId]);

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      // Sesuaikan URL ini dengan route get history di Laravel kamu (misal: /api/chat/{materialId})
      const response = await axios.get(`http://localhost:8000/api/chat/${materialId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat chat:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !materialId) return;

    const userText = input;
    setInput('');
    
    // Tambahkan pesan user ke layar sementara menunggu balasan AI
    const tempUserMsg = { role: 'user', message: userText };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Sesuaikan URL ini dengan route post chat di Laravel kamu
      const response = await axios.post('http://localhost:8000/api/chat', 
        { 
          message: userText,
          material_id: materialId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.success) {
        // Tambahkan balasan AI dari database ke layar
        setMessages(prev => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error("Error dari AI:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        message: 'Maaf, terjadi kesalahan saat menghubungi AI.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all z-40 flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        title="Tanya AI"
      >
        <MessageSquare size={28} />
      </button>

      {/* 2. SIDE PANEL AI */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-blue-600 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base">EduSmart AI</h3>
              <p className="text-xs text-blue-100">Asisten Belajar Kamu</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 text-sm mt-10">
              Belum ada percakapan. Tanyakan sesuatu tentang materi ini!
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl shadow-sm text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none whitespace-pre-wrap'
              }`}>
                {msg.message}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-sm text-gray-500">AI sedang mengetik...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya tentang materi ini..."
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 flex items-center justify-center"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. OVERLAY (Klik di luar panel untuk menutup di HP) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default AIAssistant;