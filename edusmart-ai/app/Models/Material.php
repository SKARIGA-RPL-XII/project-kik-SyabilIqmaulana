<?php

// app/Models/Material.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model {
    protected $fillable = [
        'title','content','subject','file_path','teacher_id'
    ];

    public function teacher() {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}

