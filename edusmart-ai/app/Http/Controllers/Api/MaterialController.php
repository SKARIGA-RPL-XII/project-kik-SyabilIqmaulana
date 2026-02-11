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
        // Kita ambil materi beserta info gurunya
        $materials = Material::with('teacher')->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $materials
        ]);
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
        $material = Material::with('teacher')->find($id);

        if (!$material) {
            return response()->json(['success' => false, 'message' => 'Materi tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $material
        ]);
    }

    // 4. Hapus Materi
    public function destroy($id)
    {
        $material = Material::find($id);

        if (!$material) {
            return response()->json(['success' => false, 'message' => 'Materi tidak ditemukan'], 404);
        }

        // Hapus file fisik dari storage jika ada
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }

        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil dihapus!'
        ]);
    }
}
