<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $table = 'materials'; // Nama tabel di database

    // 1. Pastikan nama kolom di sini SAMA PERSIS dengan di database
    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'file_path',
        'subject',
        'extracted_text'
    ];

    // 2. Relasi ke User (Guru)
    // Ini dipakai saat: Material::with('user')->get();
    public function user()
    {
        // Parameter kedua 'user_id' menegaskan bahwa foreign key di tabel materials adalah 'user_id'
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // (Opsional) Jika ingin memanggilnya dengan nama 'guru', tapi tetap ke tabel users
    public function guru()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function tasks() {
    return $this->hasMany(Task::class);
}
}
