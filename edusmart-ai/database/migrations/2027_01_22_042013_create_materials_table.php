<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();

            // 1. Definisikan kolomnya
            $table->unsignedBigInteger('teacher_id');

            $table->string('title');
            $table->text('description')->nullable();
            $table->string('subject');
            $table->string('file_path');
            $table->timestamps();

            // 2. Tambahkan RELASI (Foreign Key)
            // Ini artinya: teacher_id merujuk ke kolom 'id' di tabel 'users'
            // onDelete('cascade') artinya: Jika User dihapus, materinya ikut terhapus otomatis.
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');

            // CATATAN: Jika nama tabel gurumu adalah 'teachers', ganti 'users' menjadi 'teachers'
        });
    }

    public function down(): void {
        Schema::dropIfExists('materials');
    }
};
