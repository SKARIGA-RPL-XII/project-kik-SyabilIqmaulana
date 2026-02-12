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
        'teacher_id',      // Konsisten menggunakan teacher_id (FK ke tabel users)
        'title',
        'description',
        'file_path',
        'subject',      // Pastikan kolom ini ada di database kamu
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
}
