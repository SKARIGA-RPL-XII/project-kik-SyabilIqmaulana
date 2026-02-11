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
    Schema::create('chat_messages', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('chat_session_id');
        $table->enum('role', ['user', 'assistant']); // Siapa yang ngomong?
        $table->text('message'); // Isi pesan
        $table->timestamps();

        $table->foreign('chat_session_id')->references('id')->on('chat_sessions')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
    }
};
