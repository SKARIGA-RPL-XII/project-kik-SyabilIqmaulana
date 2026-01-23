<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'kelas' => 'nullable|string|max:50',
            'role' => 'nullable|in:student,teacher,admin'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'kelas' => $request->kelas,
            'role' => $request->role ?? 'student',
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('edusmart-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email atau password salah'
            ], 401);
        }

        // hapus token lama (opsional)
        $user->tokens()->delete();

        $token = $user->createToken('edusmart-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ]);
    }

    // PROFILE (cek auth)
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
