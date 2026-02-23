<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MaterialController extends Controller
{
    // 1. Ambil Semua Materi
    public function index()
{
    $materials = Material::with('user')->latest()->get();
    return response()->json([
        'success' => true,
        'message' => 'Daftar Materi Berhasil Diambil',
        'data'    => $materials
    ], 200);
}

    // 2. Upload Materi Baru
   public function store(Request $request)
    {
        // 1. Validasi dulu biar aman
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'teacher_id' => 'required', // Pastikan ID Guru dikirim
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // Maks 10MB
        ]);

        try {
            // 2. Proses Upload File
            if ($request->hasFile('file')) {
                // Simpan file ke folder 'storage/app/public/materials'
                $filePath = $request->file('file')->store('materials', 'public');
            } else {
                return response()->json(['message' => 'File tidak ditemukan'], 400);
            }

            // 3. Simpan ke Database
            $material = \App\Models\Material::create([
                'title' => $request->title,
                'subject' => $request->subject,
                'description' => $request->description,
                'teacher_id' => $request->teacher_id, // Pastikan kolom ini ada di database
                'file_path' => $filePath,            // Pastikan kolom ini ada di database
            ]);

            return response()->json(['message' => 'Berhasil upload!', 'data' => $material], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal simpan: ' . $e->getMessage()], 500);
        }
    }

    // 3. Lihat Detail Materi
   public function show($id)
{
    $material = Material::find($id);
    if (!$material) {
        return response()->json(['message' => 'Materi tidak ditemukan'], 404);
    }
    return response()->json($material);
}
       // 3. Update Materi
       public function update(Request $request, $id)
{
    $material = Material::find($id);
    if (!$material) {
    return response()->json(['message' => 'Materi tidak ditemukan'], 404);
    }

    // Validasi (File tidak wajib diisi saat edit)
    $request->validate([
        'title' => 'required',
        'subject' => 'required',
        'teacher_id' => 'required',
        // 'file_path' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,txt|max:2048',
    ]);

    // Update data text dulu
    $material->title = $request->title;
    $material->subject = $request->subject;
    $material->teacher_id = $request->teacher_id;
    $material->description = $request->description;

    // Cek apakah user upload file baru?
    if ($request->hasFile('file_path')) {
        // 1. Hapus file lama biar server gak penuh
        if ($material->file_path) {
            Storage::delete('public/materials/' . $material->file_path);
        }

        // 2. Upload file baru
        $file = $request->file('file_path');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->storeAs('public/materials', $filename);

        // 3. Simpan nama file baru ke database
        $material->file_path = $filename;
    }

    $material->save();

    return response()->json(['message' => 'Materi berhasil diupdate!', 'data' => $material]);
}

    // 4. Hapus Materi
    public function destroy($id)
    {
        // 1. Cari materi berdasarkan ID
        $material = Material::find($id);

        if (!$material) {
            return response()->json(['message' => 'Materi tidak ditemukan'], 404);
        }

        // 2. Hapus File Fisik di Storage (PENTING!)
        // Cek dulu apakah filenya ada, kalau ada hapus.
        if ($material->file_path && Storage::exists('public/materials/' . $material->file_path)) {
            Storage::delete('public/materials/' . $material->file_path);
        }

        // 3. Hapus Data di Database
        $material->delete();

        return response()->json([
            'message' => 'Materi berhasil dihapus!'
        ], 200);
    }

}
