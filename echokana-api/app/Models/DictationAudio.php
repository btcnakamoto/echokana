<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DictationAudio extends Model
{
    use HasFactory;

    /**
     * 可批量赋值的属性
     */
    protected $fillable = [
        'title',
        'audio_file_path',
        'transcript',
        'transcript_with_furigana',
        'translation_en',
        'translation_cn',
        'level',
        'category',
        'is_active',
        'duration_seconds',
    ];

    /**
     * 获取使用此音频的用户进度记录
     */
    public function userProgress()
    {
        return $this->hasMany(UserProgress::class, 'content_id')
            ->where('progress_type', 'dictation');
    }
}
