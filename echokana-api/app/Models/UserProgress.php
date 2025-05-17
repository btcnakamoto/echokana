<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    use HasFactory;

    /**
     * 可批量赋值的属性
     */
    protected $fillable = [
        'user_id',
        'progress_type',
        'content_id',
        'completed',
        'accuracy_rate',
        'last_practiced_at',
        'practice_count',
        'mistakes',
        'progress_data',
    ];

    /**
     * 应该被转换成原生类型的属性
     */
    protected $casts = [
        'completed' => 'boolean',
        'accuracy_rate' => 'float',
        'last_practiced_at' => 'datetime',
        'mistakes' => 'array',
        'progress_data' => 'array',
    ];

    /**
     * 获取拥有此进度的用户
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 获取关联的听写内容
     */
    public function dictation()
    {
        return $this->belongsTo(DictationAudio::class, 'content_id')
            ->when($this->progress_type === 'dictation');
    }

    /**
     * 获取关联的阅读内容
     */
    public function reading()
    {
        return $this->belongsTo(ReadingArticle::class, 'content_id')
            ->when($this->progress_type === 'reading');
    }

    /**
     * 更新练习记录并计算准确率
     */
    public function updatePracticeResult($mistakes = null, $accuracy = null)
    {
        $this->practice_count += 1;
        $this->last_practiced_at = now();
        
        if ($mistakes !== null) {
            $this->mistakes = $mistakes;
        }
        
        if ($accuracy !== null) {
            $this->accuracy_rate = $accuracy;
        }
        
        return $this;
    }
}
