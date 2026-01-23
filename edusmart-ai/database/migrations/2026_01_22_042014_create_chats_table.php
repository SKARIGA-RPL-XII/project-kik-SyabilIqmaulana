<?php

// database/migrations/2026_01_01_000003_create_chats_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message_user');
            $table->text('message_ai')->nullable();
            $table->enum('type', ['qa','summary','task_help'])->default('qa');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('chats');
    }
};
