<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;

/*
|--------------------------------------------------------------------------
| API Routes - Versi Rapi
|--------------------------------------------------------------------------
*/

// 1. PUBLIC ROUTES (Bisa diakses tanpa login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. PROTECTED ROUTES (Harus Login / Punya Token)
Route::middleware('auth:sanctum')->group(function () {

    // User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Fitur Aplikasi
    Route::post('/ai/chat', [AiChatController::class, 'chat']);

    // Student Resource (Otomatis buat index, store, update, destroy)
    Route::apiResource('students', StudentController::class);
    Route::resource('teachers',TeacherController::class);

    // Dashboard Role Based
    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])->middleware('role:admin');
    Route::get('/guru/dashboard', [DashboardController::class, 'guru'])->middleware('role:guru');
    Route::get('/siswa/dashboard', [DashboardController::class, 'siswa'])->middleware('role:siswa');

});
