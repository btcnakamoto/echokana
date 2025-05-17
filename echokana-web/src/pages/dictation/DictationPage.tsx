import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { useToast } from '../../components/ui/use-toast';
import { Toaster } from '../../components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

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

export default function DictationPage() {
  const navigate = useNavigate();
  // 状态变量
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [streakCount, setStreakCount] = useState(0);
  const [showHint, setShowHint] = useState<HintType | null>(null);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'practice'|'challenge'>('practice');
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<JSX.Element | null>(null);
  
  // refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // 获取当前难度的题目
  const currentDictationSet = mockDictations[difficulty];
  const currentDictation = currentDictationSet[currentIndex];
  
  // 计算进度百分比
  const progressPercentage = Math.round((currentIndex / currentDictationSet.length) * 100);
  
  // 生成当前题目的提示
  const hints = generateHints(currentDictation.text);
  
  // 播放音频
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play();
      setPlayCount(prev => prev + 1);
    }
  };
  
  // 检查答案
  const checkAnswer = () => {
    const isAnswerCorrect = userInput.trim() === currentDictation.text;
    setIsCorrect(isAnswerCorrect);
    
    // 创建比较结果
    const correctText = currentDictation.text;
    const userText = userInput.trim();
    
    // 生成比较结果的JSX
    const compareTexts = () => {
      // 如果完全正确，显示完整的正确答案
      if (isAnswerCorrect) {
        setComparisonResult(
          <p className="text-sm">
            正确答案: <span className="font-bold text-green-600">{correctText}</span>
            <span className="ml-4 text-muted-foreground">含义: <span className="font-medium">{currentDictation.meaning}</span></span>
          </p>
        );
        setIsRevealed(true);
        return;
      }
      
      // 创建用户输入展示（错误部分为红色）
      const userInputDisplay: JSX.Element[] = [];
      
      for (let i = 0; i < userText.length; i++) {
        if (i < correctText.length && userText[i] === correctText[i]) {
          // 字符匹配
          userInputDisplay.push(<span key={`user-${i}`}>{userText[i]}</span>);
        } else {
          // 字符不匹配或超出长度
          userInputDisplay.push(<span key={`user-${i}`} className="text-red-600">{userText[i]}</span>);
        }
      }
      
      // 创建正确答案展示（只显示用户输入正确的部分，其他用星号替代）
      const correctAnswerDisplay: JSX.Element[] = [];
      
      for (let i = 0; i < correctText.length; i++) {
        if (i < userText.length && userText[i] === correctText[i]) {
          // 用户输入正确的字符
          correctAnswerDisplay.push(<span key={`correct-${i}`}>{correctText[i]}</span>);
        } else {
          // 用户输入错误或缺失的字符
          correctAnswerDisplay.push(<span key={`correct-${i}`}>*</span>);
        }
      }
      
      setComparisonResult(
        <div className="space-y-2">
          <p className="text-sm">
            您写道: <span className="font-bold">{userInputDisplay}</span>
          </p>
          <p className="text-sm">
            正确答案: <span className="font-bold">{correctAnswerDisplay}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            含义: <span className="font-medium">{currentDictation.meaning}</span>
          </p>
        </div>
      );
      
      // 设置为已显示答案，这样用户可以进入下一题
      setIsRevealed(true);
    };
    
    // 比较文本
    compareTexts();
    
    if (isAnswerCorrect) {
      // 增加连续答对计数和分数
      const newStreakCount = streakCount + 1;
      setStreakCount(newStreakCount);
      
      // 根据难度和连续正确计算得分
      const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 }[difficulty];
      const streakBonus = Math.min(5, Math.floor(newStreakCount / 3)) * 0.2 + 1; // 连续答对奖励，最高+100%
      const newPoints = Math.round(10 * difficultyMultiplier * streakBonus);
      setScore(prev => prev + newPoints);
      
      toast({
        title: `正确! +${newPoints}分`,
        description: newStreakCount >= 3 ? `太棒了，连续答对${newStreakCount}题！` : "你的听写完全正确!",
        variant: "default",
      });
    } else {
      // 重置连续答对计数
      setStreakCount(0);
      
      toast({
        title: "不完全正确",
        description: "继续努力，红色字是不正确的部分，星号(*)表示缺失的字符。",
        variant: "destructive",
      });
    }
  };
  
  // 显示提示
  const showHintHandler = (hintType: HintType) => {
    setShowHint(hintType);
    
    // 使用提示会减少可获得的分数
    if (mode === 'challenge') {
      toast({
        title: "已使用提示",
        description: "使用提示会减少本题的得分。",
        variant: "default",
      });
    }
  };
  
  // 重置当前题目
  const resetCurrent = () => {
    setUserInput('');
    setIsCorrect(null);
    setIsRevealed(false);
    setPlayCount(0);
    setShowHint(null);
    setComparisonResult(null);
    
    // 设置焦点到输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  
  // 进入下一题
  const nextDictation = () => {
    if (currentIndex < currentDictationSet.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsCorrect(null);
      setIsRevealed(false);
      setPlayCount(0);
      setShowHint(null);
      setComparisonResult(null);
      setProgress(Math.round(((currentIndex + 1) / currentDictationSet.length) * 100));
      
      // 设置焦点到输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // 已完成所有听写
      toast({
        title: "恭喜完成!",
        description: `你已完成所有${difficulty}难度的听写练习!`,
        variant: "default",
      });
    }
  };
  
  // 切换难度
  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setCurrentIndex(0);
    setUserInput('');
    setIsCorrect(null);
    setIsRevealed(false);
    setPlayCount(0);
    setShowHint(null);
    setComparisonResult(null);
    setProgress(0);
  };
  
  // 更改模式
  const changeMode = (newMode: 'practice' | 'challenge') => {
    setMode(newMode);
    if (newMode === 'challenge') {
      setScore(0);
      setStreakCount(0);
      toast({
        title: "挑战模式已开启!",
        description: "在这个模式下，你将获得积分并跟踪连续答对次数。",
        variant: "default",
      });
    }
  };
  
  useEffect(() => {
    // 页面加载时自动播放第一个音频
    const timer = setTimeout(() => {
      playAudio();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentIndex, difficulty]);
  
  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+P: 播放音频
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        playAudio();
      }
      // Alt+Enter: 检查答案
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
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userInput, isCorrect, isRevealed]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* 简约导航栏 */}
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 border-b bg-background/95 backdrop-blur">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Button>
        <h1 className="text-lg font-medium">日语听写练习</h1>
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              title="帮助"
              className="rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>听写练习帮助</DialogTitle>
              <DialogDescription>
                学习如何有效使用听写练习功能
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-medium mb-2">基本使用</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• 点击播放按钮聆听音频</li>
                  <li>• 在输入框中输入你听到的日语</li>
                  <li>• 点击"检查答案"验证你的听写</li>
                  <li>• 完成后进入下一题</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">模式说明</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• <span className="font-medium">练习模式</span>: 自由练习，无计分</li>
                  <li>• <span className="font-medium">挑战模式</span>: 获得积分，跟踪连续答对</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">快捷键</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• <span className="font-medium">Alt+P</span>: 播放音频</li>
                  <li>• <span className="font-medium">Alt+Enter</span>: 检查答案</li>
                  <li>• <span className="font-medium">Alt+N</span>: 进入下一题</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setHelpDialogOpen(false)}>
                关闭
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="container max-w-4xl py-8">
        {/* 模式选择和难度选择 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Tabs defaultValue="practice" value={mode} onValueChange={(value) => changeMode(value as 'practice' | 'challenge')} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="practice">练习模式</TabsTrigger>
              <TabsTrigger value="challenge">挑战模式</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              variant={difficulty === 'easy' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeDifficulty('easy')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              初级
            </Button>
            <Button 
              variant={difficulty === 'medium' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeDifficulty('medium')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              中级
            </Button>
            <Button 
              variant={difficulty === 'hard' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeDifficulty('hard')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              高级
            </Button>
          </div>
        </div>
        
        {/* 进度和分数 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">进度: {currentIndex + 1}/{currentDictationSet.length}</span>
            {mode === 'challenge' && (
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">连续: {streakCount}</Badge>
                <Badge variant="secondary">得分: {score}</Badge>
              </div>
            )}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <Card className="mb-6 overflow-hidden">
          <CardHeader className={`${
            difficulty === 'easy' ? 'bg-green-50 border-b border-green-100' :
            difficulty === 'medium' ? 'bg-blue-50 border-b border-blue-100' :
            'bg-purple-50 border-b border-purple-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>听写练习 {currentIndex + 1}/{currentDictationSet.length}</CardTitle>
                <CardDescription>仔细聆听并输入你听到的日语</CardDescription>
              </div>
              <Badge variant={
                difficulty === 'easy' ? 'success' : 
                difficulty === 'medium' ? 'secondary' : 
                'default'
              }>
                {currentDictation.level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* 音频播放器（隐藏） */}
            <audio ref={audioRef} src={currentDictation.audioUrl} className="hidden" />
            
            <div className="flex flex-col items-center py-4">
              <Button 
                onClick={playAudio} 
                className="bg-indigo-600 hover:bg-indigo-700 mb-4 h-16 w-16 rounded-full"
                size="icon"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </Button>
              
              <div className="flex space-x-2 mb-2">
                <Button 
                  size="sm" 
                  variant={playbackRate === 0.8 ? "default" : "outline"}
                  onClick={() => setPlaybackRate(0.8)}
                >
                  0.8x
                </Button>
                <Button 
                  size="sm" 
                  variant={playbackRate === 1.0 ? "default" : "outline"}
                  onClick={() => setPlaybackRate(1.0)}
                >
                  1.0x
                </Button>
                <Button 
                  size="sm" 
                  variant={playbackRate === 1.2 ? "default" : "outline"}
                  onClick={() => setPlaybackRate(1.2)}
                >
                  1.2x
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                已播放: {playCount} 次 (Alt+P 快速播放)
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <label htmlFor="dictation-input" className="block text-sm font-medium">
                输入你听到的内容:
              </label>
              <Input
                id="dictation-input"
                placeholder="在此输入日语..."
                value={userInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                ref={inputRef}
                className={`text-lg ${
                  isCorrect === true 
                    ? 'border-green-500 focus-visible:ring-green-500' 
                    : isCorrect === false 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : ''
                }`}
              />
              
              {showHint && !isRevealed && (
                <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
                  <p className="text-sm text-blue-700">
                    {hints[showHint]}
                  </p>
                </div>
              )}
              
              {isRevealed && (
                <div className="rounded-md bg-muted p-4">
                  <div className="flex">
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      {comparisonResult}
                    </div>
                  </div>
                </div>
              )}
              
              {isCorrect === false && !isRevealed && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => showHintHandler('firstChar')}>
                    首字提示
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => showHintHandler('lastChar')}>
                    尾字提示
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => showHintHandler('length')}>
                    长度提示
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => showHintHandler('masked')}>
                    部分显示
                  </Button>
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground italic">
              提示: 使用 Alt+Enter 快速检查答案，Alt+N 进入下一题
            </p>
          </CardContent>
          <CardFooter className="flex justify-between bg-slate-50 border-t">
            <div className="flex space-x-2">
              <Button 
                onClick={checkAnswer} 
                disabled={!userInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                检查答案
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button onClick={resetCurrent} variant="ghost">
                重置
              </Button>
              <Button 
                onClick={nextDictation} 
                disabled={!isCorrect && !isRevealed}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                下一题
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* 学习技巧和统计信息 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/50">
            <CardHeader>
              <CardTitle>学习技巧</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 多次播放音频，仔细辨别每个音节</li>
                <li>• 听不清时，尝试分解单词，逐个音节听</li>
                <li>• 注意长音、促音和拨音的区别</li>
                <li>• 记笔记并总结自己常犯的错误</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white/50">
            <CardHeader>
              <CardTitle>快捷键</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Alt+P</Badge>
                  <span>播放音频</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Alt+Enter</Badge>
                  <span>检查答案</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Alt+N</Badge>
                  <span>下一题</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Toast通知组件 */}
      <Toaster />
    </div>
  );
} 