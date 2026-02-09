<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    // TAMBAHKAN INI AGAR BISA DI-INPUT DATANYA
    protected $fillable = [
        'name',
        'email',
        // 'jurusan', // tambahkan disini jika nanti ada kolom lain
    ];
}
