<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DictationController;
use App\Http\Controllers\Api\ReadingController;
use App\Http\Controllers\Api\VocabularyController;
use App\Http\Controllers\Api\UserProgressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 公开路由
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 需要认证的路由
Route::middleware('auth:sanctum')->group(function () {
    // 用户信息
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // 听写练习
    Route::apiResource('dictation', DictationController::class);
    Route::post('/dictation/check', [DictationController::class, 'checkAnswer']);
    
    // 阅读内容
    Route::apiResource('reading', ReadingController::class);
    Route::post('/reading/progress', [ReadingController::class, 'updateProgress']);
    
    // 用户词汇
    Route::apiResource('vocabulary', VocabularyController::class);
    Route::post('/vocabulary/add-from-reading', [VocabularyController::class, 'addFromReading']);
    
    // 用户进度
    Route::apiResource('progress', UserProgressController::class);
    Route::get('/progress/srs-due', [UserProgressController::class, 'srsDueItems']);
    Route::post('/progress/update-srs', [UserProgressController::class, 'updateSrsProgress']);
    
    // 统计数据
    Route::get('/stats', [UserProgressController::class, 'getStats']);
});
