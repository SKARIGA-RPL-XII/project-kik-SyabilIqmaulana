<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Student; // Pastikan Model Student di-import
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    // Fungsi untuk mengumpulkan tugas (Siswa)
    public function store(Request $request)
    {
        // 1. Ambil user yang sedang login
        $user = $request->user();

        // 2. Cari data siswa berdasarkan email (sesuaikan jika relasinya pakai user_id)
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Profil siswa tidak ditemukan. Pastikan akun ini terdaftar sebagai siswa.'
            ], 403);
        }

        // 3. Validasi input (TIDAK PERLU student_id dari frontend lagi)
        $request->validate([
            'task_id'    => 'required|exists:tasks,id',
            'file'       => 'required|file|mimes:pdf,doc,docx,zip,rar|max:10240', // Maksimal 10MB
        ]);

        try {
            // Cek apakah siswa sudah pernah mengumpulkan tugas ini sebelumnya
            // MENGGUNAKAN $student->id yang didapat dari pencarian di atas
            $existingSubmission = Submission::where('task_id', $request->task_id)
                                            ->where('student_id', $student->id)
                                            ->first();

            if ($existingSubmission) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah mengumpulkan tugas ini sebelumnya.'
                ], 400);
            }

            // 4. Proses Upload File
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filePath = $file->store('submissions', 'public');

                // 5. Simpan ke database menggunakan ID dari tabel students
                $submission = Submission::create([
                    'task_id'    => $request->task_id,
                    'student_id' => $student->id, // <-- Ini yang bikin error sebelumnya, sekarang sudah pakai ID Student!
                    'file_path'  => $filePath,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Tugas berhasil dikumpulkan!',
                    'data'    => $submission
                ], 201);
            }

            return response()->json(['success' => false, 'message' => 'File tidak ditemukan'], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengumpulkan tugas: ' . $e->getMessage()
            ], 500);
        }
    }
    public function updateGrade(Request $request, $id)
{
    // 1. Validasi input dari React
    $request->validate([
        'grade' => 'required|numeric|min:0|max:100',
        'feedback' => 'nullable|string'
    ]);

    try {
        // 2. Cari data pengumpulan berdasarkan ID
        $submission = \App\Models\Submission::findOrFail($id);

        // 3. Update nilai dan feedback
        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Nilai dan feedback berhasil disimpan!'
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan nilai: ' . $e->getMessage()
        ], 500);
    }
}
public function mySubmission(Request $request, $taskId)
{
    // 1. Angka yang dikirim React ini sebenarnya adalah ID dari tabel Users (misal: 5)
    $userIdFromReact = $request->query('student_id');

    // 2. Kita cari dulu data User-nya untuk mendapatkan emailnya
    $user = \App\Models\User::find($userIdFromReact);

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ], 404);
    }

    // 3. Cari data Student berdasarkan email user tersebut (SAMA SEPERTI DI FUNGSI STORE)
    $student = \App\Models\Student::where('email', $user->email)->first();

    if (!$student) {
        return response()->json([
            'success' => false,
            'message' => 'Profil siswa tidak ditemukan'
        ], 404);
    }

    // 4. Barulah kita cari pengumpulannya menggunakan ID asli dari tabel students (misal: 9)
    $submission = \App\Models\Submission::where('task_id', $taskId)
                                        ->where('student_id', $student->id)
                                        ->first();

    if ($submission) {
        return response()->json([
            'success' => true,
            'data' => $submission
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Belum ada pengumpulan'
    ], 404);
}
}
