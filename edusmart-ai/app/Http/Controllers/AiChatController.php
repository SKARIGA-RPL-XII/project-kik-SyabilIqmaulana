<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Models\Material;
use App\Models\ChatSession;
use App\Models\ChatMessage;

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $apiKey = env('GEMINI_API_KEY');
        $userMessage = $request->input('message');
        $materialId = $request->input('material_id');

        if (empty($userMessage)) {
            return response()->json(['message' => 'Pesan tidak boleh kosong ya.'], 400);
        }

        // 1. Ambil Data Materi & User
        $material = Material::find($materialId);
        $user = Auth::user();

        // 2. Buat atau Cari Sesi Obrolan di Database (Biar history tidak hilang)
        $session = ChatSession::firstOrCreate(
            ['user_id' => $user->id, 'material_id' => $materialId],
            ['title' => 'Diskusi: ' . ($material->title ?? 'Materi')]
        );

        // 3. Simpan Pesan User ke Database
        ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => 'user',
            'message' => $userMessage,
        ]);

        // 4. Buat Prompt dengan EXTRACTED TEXT (Biar AI benar-benar baca PDF)
        $isiMateri = ($material && $material->extracted_text) ? substr($material->extracted_text, 0, 15000) : 'Materi belum ada teksnya.';

        $systemInstruction = "Kamu adalah asisten belajar AI yang ramah.
        Tugasmu menjawab pertanyaan siswa BERDASARKAN materi berikut.

        MATERI:
        {$isiMateri}

        PERTANYAAN SISWA:
        {$userMessage}

        Aturan: Jawab dengan bahasa gaul yang sopan. Jika jawaban tidak ada di materi, katakan dengan jujur.";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $payload = [
            "contents" => [
                [
                    "role" => "user",
                    "parts" => [["text" => $systemInstruction]]
                ]
            ]
        ];

        try {
            // Kirim ke Google Gemini
            $response = Http::withoutVerifying()
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if ($response->successful()) {
                $aiAnswer = $response->json('candidates.0.content.parts.0.text') ?? 'Maaf, AI tidak memberikan jawaban.';
            } else {
                $aiAnswer = 'Maaf, otak AI sedang gangguan koneksi.';
            }

            // 5. Simpan Balasan AI ke Database
            $aiMessage = ChatMessage::create([
                'chat_session_id' => $session->id,
                'role' => 'assistant',
                'message' => $aiAnswer,
            ]);

            // 6. Kembalikan data ke React
            return response()->json([
                'success' => true,
                'data' => $aiMessage // Mengirim data yang berisi properti 'message'
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error Sistem: ' . $e->getMessage()], 500);
        }
    }

    // =========================================================
    // FUNGSI BARU: Untuk Mengambil Riwayat (History) Chat Siswa
    // =========================================================
    public function show($materialId)
    {
        // Cari history berdasarkan siapa yang login dan materi apa yang dibuka
        $session = ChatSession::where('user_id', Auth::id())
                              ->where('material_id', $materialId)
                              ->with('messages')
                              ->first();

        return response()->json([
            'data' => $session ? $session->messages : []
        ]);
    }
}
