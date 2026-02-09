<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
      // 1. Validasi Input DAN SIMPAN ke variabel $credentials
$credentials = $request->validate([
    'email' => 'required|email',
    'password' => 'required',
]);

// 2. Cek apakah email & password cocok
if (Auth::attempt($credentials)) {
    // ... kode selanjutnya ...
    /** @var \App\Models\User $user */  // <--- TAMBAHKAN BARIS INI
    $user = Auth::user();

    // Sekarang garis merah di bawah createToken pasti hilang
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login success',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 200);
        }

        // Jika gagal
        return response()->json([
            'message' => 'Email atau password salah'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
