<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = ['chat_session_id', 'role', 'message'];

    public function session() {
        return $this->belongsTo(ChatSession::class);
    }
}
