<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // <--- JANGAN LUPA IMPORT INI
use App\Models\User;
use App\Models\Student;

class AuthController extends Controller
{
    // === TAMBAHKAN FUNGSI REGISTER INI ===
public function register(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // Perlu field password_confirmation di frontend
        ]);

        // 2. Buat User Baru di tabel 'users' (Untuk keperluan Login)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        // 3. Buat data di tabel 'students' (Untuk keperluan Profil & Tugas)
        // Ini agar pas login, profil siswanya sudah otomatis ada
        Student::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Simpan hash-nya, jangan 0
            // Jika tabel students punya kolom user_id, tambahkan:
            // 'user_id' => $user->id,
        ]);

        // 4. Kembalikan Respon Sukses
        return response()->json([
            'message' => 'Registrasi berhasil! Silakan login.',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        // Validasi
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Cek Credentials
        if (Auth::attempt($credentials)) {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login success',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 200);
        }

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
