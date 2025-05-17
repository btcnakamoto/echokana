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
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('progress_type'); // dictation, reading
            $table->unsignedBigInteger('content_id'); // dictation_audio_id 或 reading_article_id
            $table->boolean('completed')->default(false);
            $table->float('accuracy_rate')->nullable(); // 准确率（百分比）
            $table->timestamp('last_practiced_at')->nullable();
            $table->integer('practice_count')->default(0); // 练习次数
            $table->json('mistakes')->nullable(); // 错误记录
            $table->json('progress_data')->nullable(); // 其他进度数据
            $table->timestamps();

            $table->unique(['user_id', 'progress_type', 'content_id']); // 每个用户对每个内容只有一条进度记录
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_progress');
    }
};
