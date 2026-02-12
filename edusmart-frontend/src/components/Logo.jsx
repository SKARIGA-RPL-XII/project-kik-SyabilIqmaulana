import React from 'react';

const Logo = ({ className = "h-10 w-auto", hideText = false }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* --- BAGIAN IKON SVG --- */}
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto" // Mengikuti tinggi container
      >
        <defs>
          {/* Definisi Gradasi Warna Biru ke Ungu */}
          <linearGradient id="eduGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" /> {/* Blue-600 */}
            <stop offset="100%" stopColor="#9333ea" /> {/* Purple-600 */}
          </linearGradient>
        </defs>

        {/* Bentuk Buku Terbuka di Bawah */}
        <path
          d="M5 35C5 35 12 32 25 35C38 32 45 35 45 35V15C45 15 38 12 25 15C12 12 5 15 5 15V35Z"
          fill="url(#eduGradient)"
          opacity="0.8"
        />
        <path
          d="M25 15V35"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Bentuk Sirkuit Otak/Awan di Atas */}
        <path
          d="M25 5C19.5 5 15 9.5 15 15C15 17.5 16 19.8 17.6 21.5C18 22 19 24 19 26H31C31 24 32 22 32.4 21.5C34 19.8 35 17.5 35 15C35 9.5 30.5 5 25 5Z"
          fill="url(#eduGradient)"
        />
        
        {/* Node/Titik Sirkuit */}
        <circle cx="25" cy="12" r="2" fill="white" />
        <circle cx="20" cy="18" r="1.5" fill="white" />
        <circle cx="30" cy="18" r="1.5" fill="white" />
        
        {/* Garis Koneksi Sirkuit */}
        <path
          d="M25 12L20 18M25 12L30 18"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Spark/Sinyal di Kanan Atas */}
        <path
          d="M40 8L42 12M42 12L46 10M42 12L40 16"
          stroke="#FBBF24" // Warna kuning emas untuk 'spark'
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* --- BAGIAN TEKS (Opsional) --- */}
      {!hideText && (
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
            EduSmart
            <span className="text-purple-700"> AI</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;