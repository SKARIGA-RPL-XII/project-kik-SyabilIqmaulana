<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student; // Pastikan Model di-import
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // 1. GET /api/students (Ambil semua data)
    public function index()
    {
        $students = Student::latest()->get();

        return response()->json([
            'status' => true,
            'message' => 'List Data Siswa',
            'data' => $students
        ], 200);
    }

    // 2. POST /api/students (Tambah data baru)
    public function store(Request $request)
    {
        // Validasi input
        $validator =Validator::make($request->all(), [
            'name'     => 'required',
            'email'    => 'required|email|unique:students,email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Simpan ke database
        $student = Student::create([
            'name'     => $request->name,
            'email'    => $request->email,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Siswa Berhasil Ditambahkan!',
            'data'    => $student
        ], 201);
    }

    // 3. GET Detail Siswa (Untuk ditampilkan di form Edit)
    public function show($id)
    {
        $student = Student::find($id);

        if ($student) {
            return response()->json([
                'status' => true,
                'message' => 'Detail Data Siswa',
                'data' => $student
            ], 200);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Data Siswa Tidak Ditemukan',
            ], 404);
        }
    }

    // 4. PUT Update Siswa
   public function update(Request $request, $id)
{
    // 1. Tambahkan validasi 'password' (nullable = boleh kosong)
    $validator = Validator::make($request->all(), [
        'name'     => 'required',
        'email'    => 'required|email|unique:students,email,'.$id,
        'password' => 'nullable|min:6', // Jika diisi, minimal 6 karakter
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $student = Student::find($id);

    if($student) {
        // 2. Siapkan array data dasar yang pasti diupdate
        $dataToUpdate = [
            'name'  => $request->name,
            'email' => $request->email,
        ];

        // 3. Cek apakah request dari React membawa password yang tidak kosong
        if ($request->filled('password')) {
            // Jika ada, tambahkan ke array dan enkripsi password-nya
            $dataToUpdate['password'] = Hash::make($request->password);
            // atau bisa juga pakai bcrypt($request->password)
        }

        // 4. Update ke database menggunakan array yang sudah disiapkan
        $student->update($dataToUpdate);

        return response()->json([
            'status' => true,
            'message' => 'Data Siswa Berhasil Diupdate!',
            'data'    => $student
        ], 200);
    }

    return response()->json(['message' => 'Data tidak ditemukan'], 404);
}

    // 5. DELETE Hapus Siswa
    public function destroy($id)
    {
        $student = Student::find($id);

        if($student) {
            $student->delete();

            return response()->json([
                'status' => true,
                'message' => 'Data Siswa Berhasil Dihapus!',
            ], 200);
        }

        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }
}
