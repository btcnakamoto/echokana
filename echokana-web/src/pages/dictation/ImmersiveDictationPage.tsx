import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from "../../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";

// 模拟听写数据 - 按难度分类
const mockDictations = {
  easy: [
    {
      id: 1,
      text: 'こんにちは',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=こんにちは&kanji=今日は',
      level: '初级',
      meaning: '你好',
      type: '问候语'
    },
    {
      id: 2,
      text: 'ありがとう',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=ありがとう&kanji=有難う',
      level: '初级',
      meaning: '谢谢',
      type: '礼貌用语'
    },
    {
      id: 3,
      text: 'さようなら',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=さようなら&kanji=左様なら',
      level: '初级',
      meaning: '再见',
      type: '问候语'
    }
  ],
  medium: [
    {
      id: 4,
      text: '元気ですか',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=げんき&kanji=元気',
      level: '中级',
      meaning: '你好吗',
      type: '问候语'
    },
    {
      id: 5,
      text: 'お願いします',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=おねがいします&kanji=お願いします',
      level: '中级',
      meaning: '请',
      type: '礼貌用语'
    },
    {
      id: 6,
      text: 'すみません',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=すみません&kanji=済みません',
      level: '中级',
      meaning: '对不起/打扰了',
      type: '礼貌用语'
    }
  ],
  hard: [
    {
      id: 7,
      text: '初めまして、よろしくお願いします',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=はじめまして&kanji=初めまして',
      level: '高级',
      meaning: '初次见面，请多关照',
      type: '问候语'
    },
    {
      id: 8,
      text: 'お疲れ様でした',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=おつかれさまでした&kanji=お疲れ様でした',
      level: '高级',
      meaning: '辛苦了',
      type: '礼貌用语'
    },
    {
      id: 9,
      text: 'いってらっしゃい',
      audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=いってらっしゃい&kanji=行ってらっしゃい',
      level: '高级',
      meaning: '一路顺风',
      type: '日常用语'
    }
  ]
};

// 提示数据
const generateHints = (text: string) => {
  const firstChar = text.charAt(0);
  const lastChar = text.charAt(text.length - 1);
  const length = text.length;
  
  return {
    firstChar: `提示: 第一个字符是 "${firstChar}"`,
    lastChar: `提示: 最后一个字符是 "${lastChar}"`,
    length: `提示: 总共有 ${length} 个字符`,
    masked: text.split('').map((char, index) => index % 2 === 0 ? char : '○').join('')
  };
};

type Difficulty = 'easy' | 'medium' | 'hard';
type HintType = 'firstChar' | 'lastChar' | 'length' | 'masked';

// 音频波形组件
const AudioWaveform = ({ isPlaying, difficulty }: { isPlaying: boolean, difficulty: Difficulty }) => {
  // 根据难度选择适当的颜色
  const getBarColor = () => {
    switch (difficulty) {
      case 'easy': return 'from-green-300 to-green-500';
      case 'medium': return 'from-blue-300 to-blue-500';
      case 'hard': return 'from-purple-300 to-purple-500';
      default: return 'from-blue-300 to-blue-500';
    }
  };
  
  // 生成随机高度序列，让波形更自然
  const barHeights = Array.from({ length: 40 }, () => 
    Math.floor(30 + Math.random() * 70)
  );
  
  return (
    <div className="h-16 w-full flex items-center justify-center my-2 px-2">
      <div className="h-full w-full max-w-md flex items-center justify-center">
        {barHeights.map((height, i) => (
          <div 
            key={i}
            className={`bg-gradient-to-t ${getBarColor()} rounded-full w-[2px] mx-[1px] transition-all duration-200 opacity-80`}
            style={{ 
              height: isPlaying ? `${height}%` : '5%',
              animationName: isPlaying ? 'wave' : 'none',
              animationDuration: `${0.5 + Math.random() * 0.7}s`,
              animationDelay: `${i * 20}ms`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
              '--wave-height': `${height}%`
            } as React.CSSProperties}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function ImmersiveDictationPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 状态
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hintText, setHintText] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [comparisonResult, setComparisonResult] = useState<React.ReactNode | null>(null);

  // 当前练习数据
  const currentDictationSet = mockDictations[difficulty];
  const currentDictation = currentDictationSet[currentIndex];
  const progressPercentage = ((currentIndex + 1) / currentDictationSet.length) * 100;
  
  // 播放音频
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setPlayCount(prevCount => prevCount + 1);
        })
        .catch(error => {
          console.error('播放音频失败', error);
        });
    }
  };
  
  // 音频播放结束处理
  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, []);
  
  // 更新播放速率
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  // 检查答案
  const checkAnswer = () => {
    if (!userInput.trim()) return;
    
    const userText = userInput.trim();
    const correctText = currentDictation.text;
    
    if (userText === correctText) {
      setIsCorrect(true);
      setComparisonResult(
        <div className="text-green-500 font-medium">
          <span>✓ 正确！答案是：</span>
          <span className="text-green-400 font-bold ml-1">{correctText}</span>
        </div>
      );
    } else {
      setIsCorrect(false);
      compareTexts();
    }
  };
  
  // 比较文本差异
  const compareTexts = () => {
    const userText = userInput.trim();
    const correctText = currentDictation.text;
    
    // 简单比较，高亮差异
    let result = <div className="text-red-400 font-medium">
      <div>✗ 不正确。正确答案是：</div>
      <div className="text-gray-200 font-bold mt-1">{correctText}</div>
      <div className="mt-2 text-sm">您的答案：</div>
      <div className="font-medium text-red-300">{userText}</div>
    </div>;
    
    setComparisonResult(result);
  };
  
  // 显示提示
  const showHintHandler = (hintType: HintType) => {
    const hints = generateHints(currentDictation.text);
    setHintText(hints[hintType]);
    setShowHint(true);
  };
  
  // 重置当前练习
  const resetCurrent = () => {
    setUserInput('');
    setIsCorrect(null);
    setIsRevealed(false);
    setComparisonResult(null);
    setShowHint(false);
    setPlayCount(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // 下一题
  const nextDictation = () => {
    const nextIndex = (currentIndex + 1) % currentDictationSet.length;
    setCurrentIndex(nextIndex);
    resetCurrent();
  };
  
  // 显示答案
  const revealAnswer = () => {
    setIsRevealed(true);
    setUserInput(currentDictation.text);
    setComparisonResult(
      <div className="text-blue-400 font-medium">
        <span>答案已显示：</span>
        <span className="text-blue-300 font-bold ml-1">{currentDictation.text}</span>
        <div className="mt-1 text-sm text-gray-300">意思：{currentDictation.meaning}</div>
      </div>
    );
  };
  
  // 切换难度
  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setCurrentIndex(0);
    resetCurrent();
  };
  
  // 组件加载时聚焦输入框
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);
  
  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 当对话框打开时不处理快捷键
      if (helpDialogOpen) return;
      
      // 空格: 播放音频 (如果不是在输入框内)
      if (e.code === 'Space' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        playAudio();
      }
      // Alt+R: 重置当前题目
      else if (e.altKey && e.key === 'r') {
        e.preventDefault();
        resetCurrent();
      }
      // Alt+Enter: 提交答案
      else if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        if (userInput.trim()) {
          checkAnswer();
        }
      }
      // Alt+N: 下一题
      else if (e.altKey && e.key === 'n') {
        e.preventDefault();
        if (isCorrect || isRevealed) {
          nextDictation();
        }
      }
      // Alt+H: 显示提示
      else if (e.altKey && e.key === 'h') {
        e.preventDefault();
        showHintHandler('firstChar');
      }
      // Alt+A: 显示答案
      else if (e.altKey && e.key === 'a' && isCorrect === false) {
        e.preventDefault();
        revealAnswer();
      }
      // 数字键1-3: 切换难度
      else if (e.altKey && e.key === '1') {
        e.preventDefault();
        changeDifficulty('easy');
      }
      else if (e.altKey && e.key === '2') {
        e.preventDefault();
        changeDifficulty('medium');
      }
      else if (e.altKey && e.key === '3') {
        e.preventDefault();
        changeDifficulty('hard');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [helpDialogOpen, userInput, isCorrect, isRevealed]);
  
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black text-white overflow-y-auto">
      {/* 背景装饰元素 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-screen h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      </div>
      
      {/* 顶部最小化导航栏 */}
      <header className="sticky top-0 left-0 right-0 bg-black/30 border-b border-white/5 backdrop-blur-md z-50 h-14 flex items-center px-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </Button>
        <div className="flex-1 text-center text-sm font-medium tracking-wide">沉浸式听写练习</div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setHelpDialogOpen(true)}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </Button>
      </header>
      
      {/* 难度选择器 - 固定在左侧 */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40">
        <Button 
          variant={difficulty === 'easy' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => changeDifficulty('easy')}
          className={`rounded-full w-11 h-11 p-0 backdrop-blur-sm transition-all duration-300 ${
            difficulty === 'easy' 
            ? 'bg-green-600/90 hover:bg-green-500 text-white shadow-lg shadow-green-900/40' 
            : 'bg-black/20 border-green-500/30 text-green-400 hover:bg-green-900/30'
          }`}
        >
          初
        </Button>
        <Button 
          variant={difficulty === 'medium' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => changeDifficulty('medium')}
          className={`rounded-full w-11 h-11 p-0 backdrop-blur-sm transition-all duration-300 ${
            difficulty === 'medium' 
            ? 'bg-blue-600/90 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' 
            : 'bg-black/20 border-blue-500/30 text-blue-400 hover:bg-blue-900/30'
          }`}
        >
          中
        </Button>
        <Button 
          variant={difficulty === 'hard' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => changeDifficulty('hard')}
          className={`rounded-full w-11 h-11 p-0 backdrop-blur-sm transition-all duration-300 ${
            difficulty === 'hard' 
            ? 'bg-purple-600/90 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40' 
            : 'bg-black/20 border-purple-500/30 text-purple-400 hover:bg-purple-900/30'
          }`}
        >
          高
        </Button>
      </div>
      
      {/* 进度条 - 顶部固定在导航栏下方 */}
      <div className="sticky top-14 left-0 right-0 h-0.5 z-40 bg-white/5">
        <div 
          className={`h-full ${
            difficulty === 'easy' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
            : difficulty === 'medium' 
            ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
            : 'bg-gradient-to-r from-purple-500 to-violet-400'
          }`}
          style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
        ></div>
      </div>
      
      {/* 主要内容区域 - 使用padding确保内容完全显示 */}
      <main className="px-4 py-10 mt-2 mb-12 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto">
          {/* 听写卡片 - 现代化设计 */}
          <Card className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 border-0 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className={`border-b border-white/5 px-6 py-5 ${
              difficulty === 'easy' 
              ? 'bg-gradient-to-r from-green-900/20 to-transparent' 
              : difficulty === 'medium' 
              ? 'bg-gradient-to-r from-blue-900/20 to-transparent' 
              : 'bg-gradient-to-r from-purple-900/20 to-transparent'
            }`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-white flex items-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-sm text-white ${
                    difficulty === 'easy' 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                    : difficulty === 'medium' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-600' 
                    : 'bg-gradient-to-br from-purple-500 to-violet-600'
                  }`}>
                    {currentIndex + 1}
                  </span>
                  听写练习
                </CardTitle>
                <Badge variant="outline" className={`${
                  difficulty === 'easy' 
                  ? 'bg-green-900/30 text-green-300 border-green-500/30' 
                  : difficulty === 'medium' 
                  ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' 
                  : 'bg-purple-900/30 text-purple-300 border-purple-500/30'
                } px-3 rounded-full`}>
                  {currentDictation.level}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* 音频播放器（隐藏） */}
              <audio ref={audioRef} src={currentDictation.audioUrl} className="hidden" />
              
              {/* 音频播放器中央区域 */}
              <div className="flex flex-col items-center py-6 md:py-8">
                <Button 
                  onClick={playAudio} 
                  className={`relative group h-24 w-24 rounded-full shadow-lg shadow-black/30 transition-all duration-300 ${
                    difficulty === 'easy' 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500' 
                    : difficulty === 'medium' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500'
                  }`}
                  size="icon"
                >
                  <div className="absolute inset-1 rounded-full bg-gray-900/40 backdrop-blur-sm flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                    <span className="text-xs text-white/90 mt-1 font-medium">点击播放</span>
                  </div>
                </Button>
                
                {/* 音频波形 */}
                <div className="mt-6 w-full">
                  <AudioWaveform isPlaying={isPlaying} difficulty={difficulty} />
                </div>
                
                {/* 音频播放次数指示 */}
                <div className="flex items-center justify-center space-x-1.5 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i < Math.min(playCount, 5) 
                        ? difficulty === 'easy' 
                          ? 'bg-green-400' 
                          : difficulty === 'medium' 
                            ? 'bg-blue-400' 
                            : 'bg-purple-400' 
                        : 'bg-gray-700'
                      }`}
                    ></div>
                  ))}
                  {playCount > 5 && <span className={`text-xs ml-1 ${
                    difficulty === 'easy' ? 'text-green-300' : 
                    difficulty === 'medium' ? 'text-blue-300' : 
                    'text-purple-300'
                  }`}>+{playCount - 5}</span>}
                </div>
              </div>
              
              {/* 播放速度控制 */}
              <div className="flex justify-center items-center gap-2">
                <Button 
                  size="sm" 
                  variant={playbackRate === 0.75 ? "default" : "outline"} 
                  onClick={() => setPlaybackRate(0.75)}
                  className={
                    playbackRate === 0.75 
                    ? `${
                        difficulty === 'easy'
                        ? 'bg-green-600/90 hover:bg-green-500/90 text-white border-transparent' 
                        : difficulty === 'medium'
                        ? 'bg-blue-600/90 hover:bg-blue-500/90 text-white border-transparent'
                        : 'bg-purple-600/90 hover:bg-purple-500/90 text-white border-transparent'
                      } rounded-full px-4`
                    : 'bg-gray-900/60 border-gray-600/30 text-gray-300 hover:bg-gray-800/60 rounded-full px-4'
                  }
                >
                  0.75x
                </Button>
                <Button 
                  size="sm" 
                  variant={playbackRate === 1.0 ? "default" : "outline"} 
                  onClick={() => setPlaybackRate(1.0)}
                  className={
                    playbackRate === 1.0 
                    ? `${
                        difficulty === 'easy'
                        ? 'bg-green-600/90 hover:bg-green-500/90 text-white border-transparent' 
                        : difficulty === 'medium'
                        ? 'bg-blue-600/90 hover:bg-blue-500/90 text-white border-transparent'
                        : 'bg-purple-600/90 hover:bg-purple-500/90 text-white border-transparent'
                      } rounded-full px-4`
                    : 'bg-gray-900/60 border-gray-600/30 text-gray-300 hover:bg-gray-800/60 rounded-full px-4'
                  }
                >
                  1.0x
                </Button>
                <Button 
                  size="sm" 
                  variant={playbackRate === 1.25 ? "default" : "outline"} 
                  onClick={() => setPlaybackRate(1.25)}
                  className={
                    playbackRate === 1.25 
                    ? `${
                        difficulty === 'easy'
                        ? 'bg-green-600/90 hover:bg-green-500/90 text-white border-transparent' 
                        : difficulty === 'medium'
                        ? 'bg-blue-600/90 hover:bg-blue-500/90 text-white border-transparent'
                        : 'bg-purple-600/90 hover:bg-purple-500/90 text-white border-transparent'
                      } rounded-full px-4`
                    : 'bg-gray-900/60 border-gray-600/30 text-gray-300 hover:bg-gray-800/60 rounded-full px-4'
                  }
                >
                  1.25x
                </Button>
              </div>
              
              {/* 输入区域 */}
              <div className="mt-4">
                <div className="mb-3 md:mb-4">
                  <label htmlFor="user-input" className="block text-sm font-medium text-gray-300 mb-2">
                    输入听到的内容
                  </label>
                  <Input
                    id="user-input"
                    ref={inputRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        checkAnswer();
                      }
                    }}
                    placeholder="请输入听到的日语..."
                    className={`h-14 text-lg px-4 rounded-xl transition-all duration-300 ${
                      isCorrect === true 
                      ? 'bg-green-900/20 border-green-500/50 text-white placeholder-green-200/50 focus:border-green-400 focus:ring-green-400 focus:ring-opacity-30' 
                      : isCorrect === false 
                      ? 'bg-red-900/20 border-red-500/50 text-white placeholder-red-200/50 focus:border-red-400 focus:ring-red-400 focus:ring-opacity-30' 
                      : 'bg-gray-800/40 border-gray-600/50 text-white placeholder-gray-400 focus:border-' + (difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'blue' : 'purple') + '-400 focus:ring-' + (difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'blue' : 'purple') + '-400 focus:ring-opacity-30'
                    }`}
                    disabled={isRevealed}
                  />
                </div>
                
                {/* 比较结果 */}
                {comparisonResult && (
                  <div className="mt-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/5">
                    {comparisonResult}
                  </div>
                )}
                
                {/* 提示显示 */}
                {showHint && (
                  <div className="mt-3 p-3 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/5 text-sm text-gray-300">
                    {hintText}
                  </div>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-between pt-3 md:pt-4 mt-3">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className={
                      difficulty === 'easy' 
                      ? 'border-green-500/30 text-green-300 hover:bg-green-900/30 rounded-full' 
                      : difficulty === 'medium' 
                      ? 'border-blue-500/30 text-blue-300 hover:bg-blue-900/30 rounded-full'
                      : 'border-purple-500/30 text-purple-300 hover:bg-purple-900/30 rounded-full'
                    }
                    onClick={() => showHintHandler('firstChar')}
                  >
                    提示
                  </Button>
                  {isCorrect === false && (
                    <Button 
                      variant="outline" 
                      className="border-amber-500/30 text-amber-300 hover:bg-amber-900/30 rounded-full"
                      onClick={revealAnswer}
                    >
                      显示答案
                    </Button>
                  )}
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-white/10 text-gray-300 hover:bg-gray-800/60 rounded-full"
                    onClick={resetCurrent}
                  >
                    重置
                  </Button>
                  {isCorrect === null ? (
                    <Button 
                      className={
                        difficulty === 'easy' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0 rounded-full' 
                        : difficulty === 'medium' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 rounded-full'
                        : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 border-0 rounded-full'
                      }
                      onClick={checkAnswer}
                    >
                      确认
                    </Button>
                  ) : (
                    <Button 
                      className={
                        difficulty === 'easy' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0 rounded-full' 
                        : difficulty === 'medium' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 rounded-full'
                        : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 border-0 rounded-full'
                      }
                      onClick={nextDictation}
                    >
                      下一题
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* 帮助对话框 */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-gray-900/95 border-gray-700/50 backdrop-blur-md text-white rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">听写练习帮助</DialogTitle>
            <DialogDescription className="text-gray-300">
              如何使用听写练习功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <h3 className="font-medium text-white mb-1">基本操作</h3>
              <p>点击中间的播放按钮听取音频，然后在输入框中输入你听到的内容。</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">快捷键</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-gray-200">空格</span> - 播放/重播音频</li>
                <li><span className="text-gray-200">Enter</span> - 提交答案</li>
                <li><span className="text-gray-200">Alt+R</span> - 重置当前题目</li>
                <li><span className="text-gray-200">Alt+N</span> - 下一题</li>
                <li><span className="text-gray-200">Alt+H</span> - 显示提示</li>
                <li><span className="text-gray-200">Alt+A</span> - 显示答案</li>
                <li><span className="text-gray-200">Alt+1/2/3</span> - 切换难度</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">提示功能</h3>
              <p>如果遇到困难，可以使用提示功能获取帮助。</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setHelpDialogOpen(false)}
              className={
                difficulty === 'easy' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-0 rounded-full' 
                : difficulty === 'medium' 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 rounded-full'
                : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 border-0 rounded-full'
              }
            >
              明白了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 