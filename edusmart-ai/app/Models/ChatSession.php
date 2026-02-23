<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    // Pastikan field ini boleh diisi (mass assignable)
    protected $fillable = ['user_id', 'material_id', 'title'];

    // Relasi ke User
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Chat Messages
    public function messages() {
        return $this->hasMany(ChatMessage::class);
    }
}
