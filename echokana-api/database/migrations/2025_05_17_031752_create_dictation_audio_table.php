<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dictation_audio', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('audio_file_path');
            $table->text('transcript');
            $table->text('transcript_with_furigana')->nullable();
            $table->text('translation_en')->nullable();
            $table->text('translation_cn')->nullable();
            $table->string('level', 10)->default('N5'); // JLPT 级别
            $table->string('category')->default('general');
            $table->boolean('is_active')->default(true);
            $table->integer('duration_seconds')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dictation_audio');
    }
};
