<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\MaterialController;

// =================================================================
// 1. PUBLIC ROUTES (Area Bebas - Bisa diakses di Browser langsung)
// =================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ---> RUTE TESTING KITA TARUH DI SINI, DI LUAR GEMBOK! <---
Route::get('/tes-gemini', function () {
    $apiKey = env('GEMINI_API_KEY');

    if (empty($apiKey)) {
        return response()->json(['error' => 'Gawat! API Key dari file .env tidak terbaca atau kosong.']);
    }

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
    $payload = [
        "contents" => [
            [
                "role" => "user",
                "parts" => [["text" => "Katakan 'Halo ini berhasil!'"]]
            ]
        ]
    ];

    try {
        $response = \Illuminate\Support\Facades\Http::withoutVerifying()
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post($url, $payload);

        return $response->json();
    } catch (\Exception $e) {
        return response()->json(['error_sistem' => $e->getMessage()]);
    }
});


// =================================================================
// 2. PROTECTED ROUTES (Area Tergembok - Wajib Punya Token dari React)
// =================================================================
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rute AI Chat Asli
    Route::post('/chat', [AiChatController::class, 'chat']);

    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->middleware('role:admin');
    Route::get('/guru/dashboard', [DashboardController::class, 'guru'])->middleware('role:guru');
    Route::get('/siswa/dashboard', [DashboardController::class, 'siswa'])->middleware('role:siswa');

    Route::apiResource('students', StudentController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('materials', MaterialController::class);
    Route::post('/materials/{id}', [MaterialController::class, 'update']);
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard']);

});
