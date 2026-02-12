<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        try {
            // 1. Validasi input (tambah konteks materi)
            $request->validate([
                'message' => 'required',
                'material_title' => 'nullable|string',
                'material_description' => 'nullable|string',
            ]);

            $userMessage = $request->input('message');
            $title = $request->input('material_title', 'Umum');
            $description = $request->input('material_description', 'Tidak ada deskripsi khusus.');

            $apiKey = env('GEMINI_API_KEY');
            $model = 'gemini-flash-latest'; // Model andalan kita

            // 2. Rakit Prompt "Guru Privat"
            // Kita beritahu AI bahwa dia sedang mengajar materi tertentu
            $systemInstruction = "Kamu adalah guru privat yang sabar dan ramah untuk siswa sekolah. \n" .
                                 "Saat ini siswa sedang mempelajari materi: '{$title}'. \n" .
                                 "Deskripsi materi: {$description}. \n\n" .
                                 "Tugasmu: Jawablah pertanyaan siswa berikut ini dengan bahasa yang mudah dimengerti. " .
                                 "Jika pertanyaan tidak berhubungan dengan materi, tetap jawab dengan sopan tapi arahkan kembali ke topik belajar.\n\n" .
                                 "Pertanyaan Siswa: ";

            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $payload = [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $systemInstruction . $userMessage]
                        ]
                    ]
                ]
            ];

            // 3. Kirim ke Google
            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json'
            ])->post($url, $payload);

            if ($response->failed()) {
                Log::error('Gemini Error: ' . $response->body());
                return response()->json(['reply' => 'Maaf, Pak Guru AI sedang sibuk. Coba lagi nanti ya.'], 200);
            }

            $data = $response->json();
            $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya kurang paham.';

            return response()->json([
                'reply' => $aiReply
            ]);

        } catch (\Throwable $e) {
            Log::error('Server Error: ' . $e->getMessage());
            return response()->json(['reply' => 'Terjadi kesalahan sistem.'], 200);
        }
    }
}
