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
        // Validasi input
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:teachers,id', // Harus ada gurunya
            'title'      => 'required',
            'subject'    => 'required',
            'file'       => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,txt|max:20480', // Max 20MB
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Proses Upload File
        $filePath = null;
        if ($request->hasFile('file')) {
            // Simpan ke folder 'public/materials'
            $filePath = $request->file('file')->store('materials', 'public');
        }

        // Simpan ke Database
        $material = Material::create([
            'teacher_id' => $request->teacher_id,
            'title'      => $request->title,
            'description'=> $request->description,
            'subject'    => $request->subject,
            'file_path'  => $filePath, // Simpan path filenya
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil diupload!',
            'data'    => $material
        ], 201);
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
