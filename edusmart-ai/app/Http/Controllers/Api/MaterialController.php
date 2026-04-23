<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Log;

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
            'teacher_id' => 'required',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf|max:10240', // Kita batasi PDF saja untuk sekarang
        ]);

        try {
            // 2. Proses Upload File
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                // Simpan file ke folder 'storage/app/public/materials'
                $filePath = $file->store('materials', 'public');

                // --- INI DIA SIHIRNYA: BACA TEKS DARI PDF ---
                $extractedText = null;
                try {
                    $parser = new \Smalot\PdfParser\Parser();
                    // Baca file langsung dari tempat penyimpanan sementara (tmp) saat diupload
                    $absolutePath = storage_path('app/public/' . $filePath);
                    $pdf = $parser->parseFile($absolutePath);
                    $extractedText = $pdf->getText();

                    // Bersihkan teks dari spasi atau enter yang terlalu banyak
                    $extractedText = preg_replace('/\s+/', ' ', trim($extractedText));
                } catch (\Exception $e) {
                    // Kalau PDF-nya terkunci/error, biarkan kosong agar upload tidak gagal total
                    Log::error('Gagal membaca PDF: ' . $e->getMessage());
                }
                // ----------------------------------------------

            } else {
                return response()->json(['message' => 'File tidak ditemukan'], 400);
            }

            // 3. Simpan ke Database (Termasuk teks aslinya!)
            $material = \App\Models\Material::create([
                'title' => $request->title,
                'subject' => $request->subject,
                'description' => $request->description,
                'teacher_id' => $request->teacher_id,
                'file_path' => $filePath,
                'extracted_text' => $extractedText, // Simpan teks panjang ke kolom baru
            ]);

            return response()->json(['message' => 'Berhasil upload dan ekstrak teks!', 'data' => $material], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal simpan: ' . $e->getMessage()], 500);
        }
    }

    // 3. Lihat Detail Materi (Sudah Diperbarui)
    public function show($id)
    {
        // Gunakan with('tasks') agar Laravel otomatis mengambil semua tugas
        // yang material_id-nya sama dengan ID materi ini.
        $material = Material::with('tasks')->find($id);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Materi tidak ditemukan'
            ], 404);
        }

        // Bungkus dengan 'data' agar sesuai dengan standar response API kita
        return response()->json([
            'success' => true,
            'message' => 'Detail materi berhasil diambil',
            'data' => $material
        ], 200);
    }

    public function getSubmissionsByMaterial($materialId)
    {
        try {
            // Logika: Cari submission yang punya task, dimana task tersebut punya material_id yang dicari
            $submissions = \App\Models\Submission::whereHas('task', function ($query) use ($materialId) {
                $query->where('material_id', $materialId);
            })
            ->with(['student', 'task']) // Mengambil data siswa (dari User model) dan data tugas
            ->get();

            return response()->json([
                'success' => true,
                'data' => $submissions
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data: ' . $e->getMessage()
            ], 500);
        }
    }

    // 4. Hapus Materi (Baru Ditambahkan)
    public function destroy($id)
    {
        try {
            // Cari materi berdasarkan ID
            $material = Material::findOrFail($id);

            // 1. HAPUS RELASI ANAK: Hapus semua tugas yang berelasi dengan materi ini
            // Ini yang mencegah error "Constraint Violation"
            if ($material->tasks()) {
                $material->tasks()->delete();
            }

            // 2. HAPUS FILE FISIK: Hapus file PDF dari folder storage agar tidak memenuhi hardisk
            if ($material->file_path && Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }

            // 3. HAPUS INDUK: Baru hapus data materinya dari database
            $material->delete();

            return response()->json([
                'success' => true,
                'message' => 'Materi dan tugas terkait berhasil dihapus.'
            ], 200);

        } catch (\Exception $e) {
            // Tangkap error jika masih gagal
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus materi: ' . $e->getMessage()
            ], 500);
        }
    }
}
