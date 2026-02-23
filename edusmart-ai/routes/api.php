<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\MaterialController;

/*
|--------------------------------------------------------------------------
| API Routes - Versi Bersih & Rapi
|--------------------------------------------------------------------------
*/

// =================================================================
// 1. PUBLIC ROUTES (Bisa diakses SIAPAPUN tanpa login)
// =================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// =================================================================
// 2. PROTECTED ROUTES (Harus Login / Punya Token)
// =================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- User Info & Auth ---
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);


    // --- AI Chat (Fitur Baru) ---
    // Pastikan ini mengarah ke ChatController yang baru kita buat
    // Ubah 'chat' menjadi 'store'
    Route::post('/chat', [ChatController::class, 'chat']);


    // --- Dashboard Role Based ---
    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->middleware('role:admin');
    Route::get('/guru/dashboard', [DashboardController::class, 'guru'])->middleware('role:guru');
    Route::get('/siswa/dashboard', [DashboardController::class, 'siswa'])->middleware('role:siswa');


    // --- Resources (CRUD Otomatis) ---
    // apiResource otomatis membuat route: index, store, show, update, destroy
    Route::apiResource('students', StudentController::class);
    Route::apiResource('teachers', TeacherController::class);

    // Khusus Materials
    Route::apiResource('materials', MaterialController::class);
    // Tambahan jika butuh update via POST (untuk upload file biasanya pakai ini karena method PUT bermasalah dengan file)
    Route::post('/materials/{id}', [MaterialController::class, 'update']);

    // Route untuk Dashboard Guru
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard']);

});
