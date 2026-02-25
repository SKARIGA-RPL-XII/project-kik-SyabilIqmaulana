<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    // ========================================================
    // BAGIAN 1: KHUSUS UNTUK HALAMAN DASHBOARD
    // ========================================================
    public function dashboard()
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalMaterials = Material::count();
        $recentMaterials = Material::latest()->take(5)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_students' => $totalStudents,
                'total_materials' => $totalMaterials,
                'recent_materials' => $recentMaterials
            ]
        ]);
    }

    // ========================================================
    // BAGIAN 2: KHUSUS UNTUK KELOLA DATA GURU (CRUD)
    // ========================================================

    // 1. GET /api/teachers (Ambil semua data guru)
    public function index()
    {
        $teachers = Teacher::latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'List Data Guru',
            'data' => $teachers // Data array ada di dalam properti 'data'
        ], 200);
    }

    // 2. POST /api/teachers (Tambah guru baru)
    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'nip'      => 'required|unique:teachers',
            'name'     => 'required',
            'email'    => 'required|email|unique:teachers,email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Simpan ke database
        $teacher = Teacher::create([
            'nip'      => $request->nip,
            'name'     => $request->name,
            'email'    => $request->email,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Guru Berhasil Ditambahkan!',
            'data'    => $teacher
        ], 201);
    }

    // 3. GET Detail Guru (Untuk ditampilkan di form Edit)
    public function show($id)
    {
        $teacher = Teacher::find($id);

        if ($teacher) {
            return response()->json([
                'status' => true,
                'message' => 'Detail Data Guru',
                'data' => $teacher
            ], 200);
        }

        return response()->json([
            'status' => false,
            'message' => 'Data Guru Tidak Ditemukan',
        ], 404);
    }

    // 4. PUT Update Guru
    public function update(Request $request, $id)
    {
        // 1. Validasi (NIP dihapus jika memang tidak ada inputan NIP di frontend)
        $validator = Validator::make($request->all(), [
            'name'     => 'required',
            'email'    => 'required|email|unique:teachers,email,'.$id,
            'password' => 'nullable|min:6' // Password opsional, tapi kalau diisi minimal 6 karakter
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors() // Format error ini yang ditangkap oleh React kita tadi
            ], 422);
        }

        // 2. Cari Data Guru
        $teacher = Teacher::find($id);

        if($teacher) {
            // 3. Siapkan data yang pasti di-update
            $dataToUpdate = [
                'name'     => $request->name,
                'email'    => $request->email,
            ];

            // 4. Cek apakah password ikut dikirim/diisi
            if ($request->filled('password')) {
                $dataToUpdate['password'] = Hash::make($request->password);
            }

            // 5. Eksekusi Update ke Database
            $teacher->update($dataToUpdate);

            // 6. Kembalikan Response Sukses
            return response()->json([
                'status' => true,
                'message' => 'Data Guru Berhasil Diupdate!',
                'data'    => $teacher
            ], 200);
        }

        // 7. Jika ID Guru tidak ditemukan
        return response()->json([
            'status' => false,
            'message' => 'Data tidak ditemukan'
        ], 404);
    }
}
