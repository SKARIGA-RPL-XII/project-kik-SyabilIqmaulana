<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\Material;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    // Nama fungsi ini ADALAH 'chat' (sesuai route kamu)
    public function chat(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'material_id' => 'required',
            'message' => 'required|string',
        ]);

        try {
            $user = Auth::user();
            $apiKey = env('GEMINI_API_KEY');

            // Cek Materi
            $material = Material::findOrFail($request->material_id);

            // 2. Buat/Cek Sesi Chat di Database
            $session = ChatSession::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'material_id' => $request->material_id
                ],
                [
                    'title' => 'Diskusi: ' . $material->title
                ]
            );

            // 3. Simpan Pesan USER
            ChatMessage::create([
                'chat_session_id' => $session->id,
                'role' => 'user',
                'message' => $request->message,
            ]);

            // 4. LOGIKA AI GEMINI (Prompt Guru)
            $systemInstruction = "Kamu adalah guru privat yang asik. Materi: '{$material->title}'. Jawab pertanyaan siswa: {$request->message}";

            // Kirim request ke Google
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => [['parts' => [['text' => $systemInstruction]]]]
            ]);

            // 5. Ambil Jawaban
            if ($response->successful()) {
                $data = $response->json();
                $aiReplyText = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya bingung.';
            } else {
                // Jika error, kita tulis di log, tapi balas pesan sopan ke user
                Log::error('Gemini Error: ' . $response->body());
                $aiReplyText = "Maaf, Pak Guru AI sedang gangguan sinyal. Coba lagi nanti ya.";
            }

            // 6. Simpan Pesan AI
            $aiMessage = ChatMessage::create([
                'chat_session_id' => $session->id,
                'role' => 'assistant',
                'message' => $aiReplyText,
            ]);

            // Kembalikan data ke React
            return response()->json([
                'success' => true,
                'data' => $aiMessage
            ]);

        } catch (\Exception $e) {
            Log::error('Server Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error Sistem: ' . $e->getMessage()], 500);
        }
    }

    // Fungsi Load History (Dipakai saat buka halaman)
    public function show($materialId)
    {
        $session = ChatSession::where('user_id', Auth::id())
                              ->where('material_id', $materialId)
                              ->with('messages')
                              ->first();
        return response()->json(['data' => $session ? $session->messages : []]);
    }
}
