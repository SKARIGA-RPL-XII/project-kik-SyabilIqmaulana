<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            // Menghubungkan pesan ini ke sesi chat yang mana
            $table->unsignedBigInteger('chat_session_id');
            // Siapa yang mengirim? 'user' (murid) atau 'assistant' (AI)
            $table->enum('role', ['user', 'assistant']);
            // Isi pesannya
            $table->text('message');
            $table->timestamps();

            // Foreign Key: Jika sesi dihapus, pesan di dalamnya ikut terhapus
            $table->foreign('chat_session_id')->references('id')->on('chat_sessions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
