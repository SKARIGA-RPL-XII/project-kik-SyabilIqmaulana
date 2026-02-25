<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('chats', function (Blueprint $table) {
        $table->id();
        // Menyambungkan chat dengan user yang login
        $table->foreignId('user_id')->constrained()->onDelete('cascade');

        $table->text('message_user'); // Menyimpan pertanyaan siswa
        $table->text('message_ai')->nullable(); // Menyimpan jawaban AI (nullable karena bisa jadi kosong saat error)
        $table->string('type')->default('qa'); // Tipe chat

        $table->timestamps(); // Membuat kolom created_at dan updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
