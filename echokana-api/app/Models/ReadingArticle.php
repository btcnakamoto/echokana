<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReadingArticle extends Model
{
    use HasFactory;

    /**
     * 可批量赋值的属性
     */
    protected $fillable = [
        'title',
        'content',
        'content_with_furigana',
        'translation_en',
        'translation_cn',
        'level',
        'category',
        'grammar_points',
        'vocabulary',
        'is_active',
        'estimated_read_time',
    ];

    /**
     * 应该被转换成原生类型的属性
     */
    protected $casts = [
        'grammar_points' => 'array',
        'vocabulary' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * 获取使用此文章的用户进度记录
     */
    public function userProgress()
    {
        return $this->hasMany(UserProgress::class, 'content_id')
            ->where('progress_type', 'reading');
    }
}
