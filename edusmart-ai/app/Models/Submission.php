<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    // Pastikan semua kolom didaftarkan di sini
    protected $fillable = [
        'task_id',
        'student_id',
        'file_path',
        'grade',
        'feedback' // <--- Tambahkan ini
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    // Pastikan class yang di-return juga sesuai, misalnya User::class
   public function student()
{
    return $this->belongsTo(Student::class, 'student_id');
}
}
