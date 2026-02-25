<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Material; // <--- WAJIB TAMBAH INI SUPAYA LARAVEL BISA BACA TABEL MATERI

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $apiKey = env('GEMINI_API_KEY');

        // Menangkap pesan dan ID materi dari React
        $userMessage = $request->input('message');
        $materialId = $request->input('material_id');

        if (empty($userMessage)) {
            return response()->json(['answer' => 'Pesan tidak boleh kosong ya.']);
        }

        // 1. Ambil data materi dari Database berdasarkan ID
        $material = Material::find($materialId);

        // 2. Buat "Bisikan" Konteks untuk AI (System Prompting)
        $konteksMateri = "Kamu adalah asisten belajar AI yang ramah dan cerdas. ";

        if ($material) {
            $konteksMateri .= "Saat ini siswa sedang bertanya tentang mata pelajaran {$material->subject}, khusus pada materi berjudul '{$material->title}'. Deskripsi singkat materinya adalah: {$material->description}. Bimbing siswa untuk memahami materi tersebut. ";
        }

        $konteksMateri .= "Jawablah pertanyaan siswa berikut ini dengan bahasa gaul yang sopan dan mudah dipahami. Jangan terlalu panjang. Pertanyaan siswa: ";

        // 3. Gabungkan bisikan dengan pertanyaan asli siswa
        $finalPrompt = $konteksMateri . '"' . $userMessage . '"';

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $payload = [
            "contents" => [
                [
                    "role" => "user",
                    "parts" => [["text" => $finalPrompt]]
                ]
            ]
        ];

        try {
            $response = Http::withoutVerifying()
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if ($response->successful()) {
                $aiAnswer = $response->json('candidates.0.content.parts.0.text') ?? 'Maaf, AI tidak memberikan jawaban.';
                return response()->json(['answer' => $aiAnswer]);
            } else {
                return response()->json(['answer' => 'Error Google: ' . $response->body()]);
            }

        } catch (\Exception $e) {
            return response()->json(['answer' => 'Error Sistem: ' . $e->getMessage()]);
        }
    }
}
