<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Material;
use App\Models\Teacher;

class TaskController extends Controller
{
public function store(Request $request, $materialId)
    {
        // 1. Ambil user yang sedang login
        $user = $request->user();

        // 2. Cari data guru berdasarkan EMAIL (karena tidak ada user_id di tabel teachers)
        $teacher = Teacher::where('email', $user->email)->first();

        // Jika tidak ketemu profil gurunya, tolak dengan pesan error
        if (!$teacher) {
            return response()->json([
                'message' => 'Profil guru tidak ditemukan. Pastikan email akun yang login ini (' . $user->email . ') sudah terdaftar di data Guru.'
            ], 403);
        }

        // 3. Simpan tugas menggunakan ID guru yang cocok tadi
        $task = new Task();
        $task->material_id = $materialId;

        // Gunakan ID dari hasil pencarian email di atas
        $task->teacher_id = $teacher->id;

        $task->title = $request->title;
        $task->description = $request->description;
        $task->deadline = $request->deadline;
        $task->save();

        return response()->json([
            'message' => 'Tugas berhasil ditambahkan!',
            'data' => $task
        ], 201);
    }
  }


