<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    /**
     * 获取用户的词汇列表
     */
    public function vocabularies()
    {
        return $this->hasMany(UserVocabulary::class);
    }
    
    /**
     * 获取用户的进度记录
     */
    public function progress()
    {
        return $this->hasMany(UserProgress::class);
    }
    
    /**
     * 获取用户的听写进度
     */
    public function dictationProgress()
    {
        return $this->hasMany(UserProgress::class)
            ->where('progress_type', 'dictation');
    }
    
    /**
     * 获取用户的阅读进度
     */
    public function readingProgress()
    {
        return $this->hasMany(UserProgress::class)
            ->where('progress_type', 'reading');
    }
    
    /**
     * 获取用户需要复习的词汇
     */
    public function dueVocabularies()
    {
        return $this->vocabularies()
            ->where('next_review', '<=', now())
            ->where('is_known', false);
    }
}
