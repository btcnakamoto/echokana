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
        Schema::create('reading_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->text('content_with_furigana');
            $table->text('translation_en')->nullable();
            $table->text('translation_cn')->nullable();
            $table->string('level', 10)->default('N5'); // JLPT 级别
            $table->string('category')->default('general');
            $table->json('grammar_points')->nullable(); // 存储文章中的语法点
            $table->json('vocabulary')->nullable(); // 预定义的重要词汇
            $table->boolean('is_active')->default(true);
            $table->integer('estimated_read_time')->default(0); // 预计阅读时间（分钟）
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
        Schema::dropIfExists('reading_articles');
    }
};
