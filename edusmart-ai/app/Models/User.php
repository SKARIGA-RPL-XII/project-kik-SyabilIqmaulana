<?php

// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name','email','password','role','kelas'
    ];

    protected $hidden = [
        'password'
    ];

    public function materials() {
        return $this->hasMany(Material::class, 'teacher_id');
    }

    public function chats() {
        return $this->hasMany(Chat::class);
    }
}
