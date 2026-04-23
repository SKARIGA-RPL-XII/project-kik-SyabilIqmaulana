<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;

class TaskSubmissionController extends Controller
{
    // Melihat daftar siswa yang mengumpulkan tugas dari satu materi
    public function index($materialId)
    {
        // Mencari submission yang task-nya berhubungan dengan material_id tersebut
        $submissions = Submission::whereHas('task', function($query) use ($materialId) {
            $query->where('material_id', $materialId);
        })->with(['student', 'task'])->get();

        return response()->json(['data' => $submissions]);
    }

    // Memberikan nilai dan feedback
    public function updateGrade(Request $request, $id)
    {
        $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string'
        ]);

        $submission = Submission::findOrFail($id);
        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback
        ]);

        return response()->json(['message' => 'Nilai berhasil disimpan!', 'data' => $submission]);
    }
}
