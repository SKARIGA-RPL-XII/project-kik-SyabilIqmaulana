<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// routes/api.php
Route::middleware('auth:sanctum')->post('/ai/chat', [AiChatController::class, 'chat']);



// public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});


Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/admin/dashboard', [DashboardController::class, 'admin'])
        ->middleware('role:admin');

    Route::get('/guru/dashboard', [DashboardController::class, 'guru'])
        ->middleware('role:guru');

    Route::get('/siswa/dashboard', [DashboardController::class, 'siswa'])
        ->middleware('role:siswa');

});
