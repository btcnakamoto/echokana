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
        Schema::create('user_vocabularies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('word'); // 日语单词
            $table->string('reading')->nullable(); // 假名读音
            $table->text('meaning_en')->nullable(); // 英语释义
            $table->text('meaning_cn')->nullable(); // 中文释义
            $table->string('level', 10)->nullable(); // JLPT 级别
            $table->string('part_of_speech')->nullable(); // 词性
            $table->text('example_sentence')->nullable(); // 示例句子
            $table->text('example_sentence_translation')->nullable(); // 示例句子翻译
            $table->string('source_type')->nullable(); // 来源类型：reading, dictation
            $table->unsignedBigInteger('source_id')->nullable(); // 来源ID
            $table->integer('srs_level')->default(0); // SRS 级别（0-8）
            $table->timestamp('next_review')->nullable(); // 下次复习时间
            $table->unsignedInteger('review_count')->default(0); // 复习次数
            $table->boolean('is_known')->default(false); // 用户是否已掌握
            $table->timestamps();

            $table->unique(['user_id', 'word']); // 防止用户添加重复单词
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_vocabularies');
    }
};
