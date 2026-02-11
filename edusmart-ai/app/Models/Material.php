<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'file_path',
        'subject',
    ];

    // Relasi: Materi milik satu Guru
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
