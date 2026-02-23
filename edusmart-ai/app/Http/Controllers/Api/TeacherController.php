<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        // Validasi yang sudah diperbaiki!
        $validator = Validator::make($request->all(), [
            'nip'      => 'required|unique:teachers,nip,'.$id,
            'name'     => 'required',
            'email'    => 'required|email|unique:teachers,email,'.$id,
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $teacher = Teacher::find($id);

        if($teacher) {
            $teacher->update([
                'nip'      => $request->nip,
                'name'     => $request->name,
                'email'    => $request->email,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Data Guru Berhasil Diupdate!',
                'data'    => $teacher
            ], 200);
        }

        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }

    // 5. DELETE Hapus Guru
    public function destroy($id)
    {
        $teacher = Teacher::find($id);

        if($teacher) {
            $teacher->delete();
            return response()->json([
                'status' => true,
                'message' => 'Data Guru Berhasil Dihapus!',
            ], 200);
        }

        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}
