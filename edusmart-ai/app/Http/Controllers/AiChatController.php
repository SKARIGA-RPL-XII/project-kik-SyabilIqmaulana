<?php

// app/Http/Controllers/AiChatController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Chat;

class AiChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'type' => 'nullable|in:qa,summary,task_help'
        ]);

        $user = $request->user();

        // Simpan pertanyaan siswa
        $chat = Chat::create([
            'user_id' => $user->id,
            'message_user' => $request->message,
            'type' => $request->type ?? 'qa',
        ]);

        // Prompt dasar (AMAN & EDUKATIF)
        $systemPrompt = "Kamu adalah asisten belajar siswa SMK.
        Jawab dengan bahasa Indonesia yang sederhana, singkat, dan mudah dipahami.
        Jangan memberikan jawaban yang tidak berkaitan dengan pembelajaran.";

        // Panggil API AI
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.openai.key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $request->message],
            ],
            'max_tokens' => 400,
        ]);

        $aiAnswer = $response->json('choices.0.message.content')
                    ?? 'Maaf, AI belum dapat menjawab saat ini.';

        // Update jawaban AI
        $chat->update([
            'message_ai' => $aiAnswer
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'question' => $chat->message_user,
                'answer' => $chat->message_ai
            ]
        ]);
    }
}
