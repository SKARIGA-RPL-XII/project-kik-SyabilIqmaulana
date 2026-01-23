<?php

// app/Models/Chat.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model {
    protected $fillable = [
        'user_id','message_user','message_ai','type'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
