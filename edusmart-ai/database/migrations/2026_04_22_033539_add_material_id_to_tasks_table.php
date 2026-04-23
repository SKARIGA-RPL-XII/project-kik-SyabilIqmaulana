<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
{
    Schema::table('tasks', function (Blueprint $table) {
        // Menambahkan kolom material_id setelah kolom teacher_id
        $table->foreignId('material_id')->after('teacher_id')->constrained('materials')->onDelete('cascade');
    });
}

public function down(): void
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->dropForeign(['material_id']);
        $table->dropColumn('material_id');
    });
}
};
