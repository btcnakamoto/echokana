<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVocabulary extends Model
{
    use HasFactory;

    /**
     * 可批量赋值的属性
     */
    protected $fillable = [
        'user_id',
        'word',
        'reading',
        'meaning_en',
        'meaning_cn',
        'level',
        'part_of_speech',
        'example_sentence',
        'example_sentence_translation',
        'source_type',
        'source_id',
        'srs_level',
        'next_review',
        'review_count',
        'is_known',
    ];

    /**
     * 应该被转换成原生类型的属性
     */
    protected $casts = [
        'is_known' => 'boolean',
        'next_review' => 'datetime',
    ];

    /**
     * 获取拥有此词汇的用户
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 根据复习算法计算下次复习时间
     */
    public function calculateNextReview($quality)
    {
        // 简化版的 SM-2 算法
        $quality = min(max(0, $quality), 5); // 确保 quality 在 0-5 之间
        
        // 更新 SRS 级别
        if ($quality < 3) {
            // 如果回答质量不好，重置到级别 0
            $this->srs_level = 0;
        } else {
            // 否则，增加 SRS 级别，最高到 8
            $this->srs_level = min($this->srs_level + 1, 8);
        }
        
        // 基于 SRS 级别计算下次复习间隔（单位：天）
        $intervals = [0, 1, 2, 4, 7, 15, 30, 60, 120];
        $days = $intervals[$this->srs_level];
        
        $this->next_review = now()->addDays($days);
        $this->review_count += 1;
        
        return $this;
    }
}
