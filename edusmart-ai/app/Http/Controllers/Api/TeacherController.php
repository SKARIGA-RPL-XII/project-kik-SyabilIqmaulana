<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher; // Pastikan Model di-import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    // 1. GET /api/teachers (Ambil semua data)
    public function index()
    {
        $teachers = Teacher::latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'List Data Guru',
            'data' => $teachers
        ], 200);
    }

    // 2. POST /api/teachers (Tambah data baru)
    public function store(Request $request)
    {
        // Validasi input
        $validator =Validator::make($request->all(), [
            'nip' => 'required|unique:teachers',
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
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data Guru Tidak Ditemukan',
            ], 404);
        }
    }

    // 4. PUT Update Guru
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nip' => 'required|unique:teachers',
            'name'     => 'required',
            'email'    => 'required|email|unique:teachers,email,'.$id, // Email boleh sama kalau punya diri sendiri
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
