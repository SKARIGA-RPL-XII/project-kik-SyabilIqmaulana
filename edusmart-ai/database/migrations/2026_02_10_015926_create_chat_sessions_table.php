<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus tabel lama jika ada biar bersih
        Schema::dropIfExists('chat_sessions');

        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // <--- INI WAJIB ADA
            $table->unsignedBigInteger('material_id')->nullable();
            $table->timestamps();

            // Relasi agar aman
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
