import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { JapaneseCard } from "../../components/common/JapaneseCard";
import { JapaneseButton } from "../../components/common/JapaneseButton";
import logoSvg from "../../assets/images/logo.svg";

// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    title: '日常会话基础',
    description: '基础日常用语和简短对话',
    level: '初级',
    dictationIds: {
      easy: [1, 2, 3],
      medium: [4, 5],
      hard: [7]
    }
  },
  {
    id: 2,
    title: '旅游实用日语',
    description: '旅行中常用的表达和问路用语',
    level: '中级',
    dictationIds: {
      easy: [2, 3],
      medium: [5, 6],
      hard: [8, 9]
    }
  },
  {
    id: 3,
    title: '商务日语入门',
    description: '办公室和商务场合中的常用语',
    level: '高级',
    dictationIds: {
      easy: [1],
      medium: [4, 6],
      hard: [7, 8, 9]
    }
  },
  {
    id: 4,
    title: '全部内容',
    description: '所有听写练习题目',
    level: '全部',
    dictationIds: {
      easy: [1, 2, 3],
      medium: [4, 5, 6],
      hard: [7, 8, 9]
    }
  }
];

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
  // 添加课程选择状态
  const [selectedCourse, setSelectedCourse] = useState(4); // 默认选择"全部内容"课程
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 获取当前选择的课程
  const currentCourse = mockCourses.find(course => course.id === selectedCourse) || mockCourses[3];
  
  // 获取当前难度下的听写题目IDs
  const filteredDictationIds = currentCourse.dictationIds[difficulty];
  
  // 基于课程筛选听写题目
  const filteredDictations = filteredDictationIds.map(
    id => mockDictations[difficulty].find(dictation => dictation.id === id)
  ).filter(Boolean);
  
  // 检查是否有可用的题目，如果没有则使用默认内容
  const currentDictationSet = filteredDictations.length > 0 
    ? filteredDictations 
    : mockDictations[difficulty];
  
  // 确保currentIndex不超出范围
  const safeCurrentIndex = currentDictationSet.length > 0 
    ? Math.min(currentIndex, currentDictationSet.length - 1) 
    : 0;
  
  // 获取当前题目，确保一定有值
  const currentDictation = currentDictationSet[safeCurrentIndex] || mockDictations[difficulty][0];
  
  // 计算进度百分比
  const progressPercentage = currentDictationSet.length > 0 
    ? Math.round((safeCurrentIndex / currentDictationSet.length) * 100)
    : 0;
  
  // 生成当前题目的提示
  const hints = generateHints(currentDictation.text);
  
  // 播放音频
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
      setPlayCount(prev => prev + 1);
        })
        .catch(error => {
          console.error("播放失败:", error);
        });
    }
  };
  
  // 监听音频播放结束事件
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
    }
  };
  }, []);
  
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
          <div className="space-y-2">
            <p className="text-base">
              <span className="text-gray-600 mr-2">正确答案:</span> 
              <span className="font-bold text-green-600 text-lg">{correctText}</span>
            </p>
            <p className="text-base text-gray-600">
              <span className="font-medium">含义:</span> <span className="text-indigo-700">{currentDictation.meaning}</span>
            </p>
            <div className="mt-4 flex items-center bg-green-50 p-3 rounded-lg text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>太棒了！回答完全正确！</span>
            </div>
          </div>
        );
        setIsRevealed(true);
        return;
      }
      
      // 创建用户输入展示（错误部分为红色）
      const userInputDisplay: JSX.Element[] = [];
      
      for (let i = 0; i < userText.length; i++) {
        if (i < correctText.length && userText[i] === correctText[i]) {
          // 字符匹配
          userInputDisplay.push(<span key={`user-${i}`} className="text-green-600">{userText[i]}</span>);
        } else {
          // 字符不匹配或超出长度
          userInputDisplay.push(<span key={`user-${i}`} className="text-red-600 font-bold">{userText[i]}</span>);
        }
      }
      
      // 创建正确答案展示（只显示用户输入正确的部分，其他用星号替代）
      const correctAnswerDisplay: JSX.Element[] = [];
      
      for (let i = 0; i < correctText.length; i++) {
        if (i < userText.length && userText[i] === correctText[i]) {
          // 用户输入正确的字符
          correctAnswerDisplay.push(<span key={`correct-${i}`} className="text-green-600">{correctText[i]}</span>);
        } else {
          // 用户输入错误或缺失的字符
          correctAnswerDisplay.push(<span key={`correct-${i}`} className="text-indigo-600 font-semibold">*</span>);
        }
      }
      
      setComparisonResult(
        <div className="space-y-3">
          <p className="text-base">
            <span className="text-gray-600 mr-2">您写道:</span> 
            <span className="font-bold text-lg">{userInputDisplay}</span>
          </p>
          <p className="text-base">
            <span className="text-gray-600 mr-2">正确答案:</span> 
            <span className="font-bold text-lg">{correctAnswerDisplay}</span>
          </p>
          <p className="text-base text-gray-600">
            <span className="font-medium">含义:</span> <span className="text-indigo-700">{currentDictation.meaning}</span>
          </p>
          <div className="mt-2 bg-blue-50 p-3 rounded-lg text-blue-700 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <div>
              <p className="font-medium">继续努力！</p>
              <p className="text-sm mt-1">星号(*)表示正确答案中的字符，尝试再听一次。</p>
            </div>
          </div>
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
    } else {
      // 重置连续答对计数
      setStreakCount(0);
    }
  };
  
  // 显示提示
  const showHintHandler = (hintType: HintType) => {
    setShowHint(hintType);
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
    if (safeCurrentIndex < currentDictationSet.length - 1) {
      setCurrentIndex(safeCurrentIndex + 1);
      setUserInput('');
      setIsCorrect(null);
      setIsRevealed(false);
      setPlayCount(0);
      setShowHint(null);
      setComparisonResult(null);
      setProgress(Math.round(((safeCurrentIndex + 1) / currentDictationSet.length) * 100));
      
      // 设置焦点到输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
    }
  };
  
  // 切换课程
  const changeCourse = (courseId: number) => {
    setSelectedCourse(courseId);
    setCurrentIndex(0);
    setUserInput('');
    setIsCorrect(null);
    setIsRevealed(false);
    setPlayCount(0);
    setShowHint(null);
    setComparisonResult(null);
    setProgress(0);
    
    // 关闭课程选择对话框
    setShowCourseModal(false);
  };
  
  useEffect(() => {
    // 移除自动播放功能，避免浏览器安全限制
    // 用户需要手动点击播放按钮
    
    // 设置焦点到输入框
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    
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
    <div className="container py-8 px-4 max-w-5xl mx-auto min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img src={logoSvg} alt="EchoKana Logo" className="h-8 mr-3" />
          <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">EchoKana 听写练习</h1>
          </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setHelpDialogOpen(true)}
            className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
            帮助
          </Button>
              <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            返回
              </Button>
                </div>
                </div>
                
      {/* 课程信息 */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="relative flex items-center justify-between">
            <div>
            <h2 className="text-lg font-medium text-gray-800 mb-1">{currentCourse.title}</h2>
              <p className="text-sm text-gray-600 max-w-md">{currentCourse.description}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCourseModal(true)}
            className="rounded-md border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
            切换课程
            </Button>
          </div>
        <Separator className="my-3 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="text-xs font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">{currentCourse.level}</div>
          <div className="text-xs font-medium px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100">单词数量: {filteredDictationIds.length}个</div>
          </div>
        </div>
        
        {/* 模式选择和难度选择 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="bg-white p-1 rounded-md shadow-sm w-full md:w-auto border border-gray-100">
            <Tabs defaultValue="practice" value={mode} onValueChange={(value) => changeMode(value as 'practice' | 'challenge')} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-gray-50">
                <TabsTrigger 
                  value="practice" 
                className="data-[state=active]:shadow-sm rounded-md py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-transparent transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                  练习模式
                </TabsTrigger>
                <TabsTrigger 
                  value="challenge" 
                className="data-[state=active]:shadow-sm rounded-md py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:bg-transparent transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 inline-block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                  挑战模式
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            <Button 
              variant={difficulty === 'easy' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeDifficulty('easy')}
            className={`rounded-md transition-all duration-200 ${
                difficulty === 'easy' 
              ? 'bg-green-600 hover:bg-green-700 text-white border-0' 
              : 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300'
              }`}
            >
              <div className="flex items-center">
              <span className={`rounded-md w-5 h-5 flex items-center justify-center ${
                difficulty === 'easy' ? 'bg-white/20' : 'bg-green-50'
                } mr-2`}>
                  <span className={difficulty === 'easy' ? 'text-white' : 'text-green-700'}>初</span>
                </span>
                <span>初级</span>
              </div>
            </Button>
            <Button 
              variant={difficulty === 'medium' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeDifficulty('medium')}
            className={`rounded-md transition-all duration-200 ${
                difficulty === 'medium' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' 
              : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center">
              <span className={`rounded-md w-5 h-5 flex items-center justify-center ${
                difficulty === 'medium' ? 'bg-white/20' : 'bg-blue-50'
                } mr-2`}>
                  <span className={difficulty === 'medium' ? 'text-white' : 'text-blue-700'}>中</span>
                </span>
                <span>中级</span>
              </div>
            </Button>
            <Button 
              variant={difficulty === 'hard' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => changeDifficulty('hard')}
            className={`rounded-md transition-all duration-200 ${
                difficulty === 'hard' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white border-0' 
              : 'border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center">
              <span className={`rounded-md w-5 h-5 flex items-center justify-center ${
                difficulty === 'hard' ? 'bg-white/20' : 'bg-purple-50'
                } mr-2`}>
                  <span className={difficulty === 'hard' ? 'text-white' : 'text-purple-700'}>高</span>
                </span>
                <span>高级</span>
              </div>
            </Button>
          </div>
        </div>
        
        {/* 进度和分数 */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-2">
            <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            <span className="text-sm font-medium text-gray-700">进度: <span className="text-blue-700 font-semibold">{safeCurrentIndex + 1}/{currentDictationSet.length}</span></span>
            </div>
            {mode === 'challenge' && (
              <div className="flex items-center space-x-4">
              <div className="flex items-center bg-amber-50 px-3 py-1 rounded-md border border-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-amber-600 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                  </svg>
                <span className="text-xs font-semibold text-amber-700">连续: {streakCount}</span>
                </div>
              <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-600 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                <span className="text-xs font-semibold text-indigo-700">得分: {score}</span>
                </div>
              </div>
            )}
          </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-blue-50">
            <div 
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" 
              style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
          </div>
        </div>
        
        {/* 主听写卡片 */}
      <Card className="mb-8 border border-gray-100 shadow-md rounded-lg bg-white overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className={`px-6 pt-6 pb-4 border-b ${
          difficulty === 'easy' 
          ? 'border-green-100 bg-gradient-to-r from-green-50 to-white' : 
              difficulty === 'medium' 
          ? 'border-blue-100 bg-gradient-to-r from-blue-50 to-white' : 
          'border-purple-100 bg-gradient-to-r from-purple-50 to-white'
        }`}>
            <div className="flex items-center justify-between">
              <div>
              <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md mr-3 text-sm text-white ${
                    difficulty === 'easy' 
                  ? 'bg-green-600' : 
                    difficulty === 'medium' 
                  ? 'bg-blue-600' : 
                  'bg-purple-600'
                  }`}>
                    {safeCurrentIndex + 1}
                  </span>
                  听写练习
                </CardTitle>
              <CardDescription className="mt-1 ml-10 text-gray-600">仔细聆听并输入你听到的日语</CardDescription>
              </div>
              <Badge 
                variant="outline" 
              className={`px-2 py-1 rounded-md font-medium ${
                difficulty === 'easy' 
                ? 'bg-green-50 text-green-700 border-green-200' : 
                difficulty === 'medium' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                'bg-purple-50 text-purple-700 border-purple-200'
                }`}
              >
                {currentDictation.level}
              </Badge>
            </div>
          </CardHeader>
        <CardContent className="space-y-6 p-6">
            {/* 音频播放器（隐藏） */}
            <audio ref={audioRef} src={currentDictation.audioUrl} className="hidden" />
            
          <div className="flex flex-col items-center py-6">
            <div className="relative mb-4">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 rounded-full blur-md opacity-30"></div>
                <Button 
                  onClick={playAudio} 
                className={`relative z-10 bg-white hover:bg-gray-50 h-20 w-20 rounded-full shadow-md transition-all duration-300 ${
                  difficulty === 'easy' 
                  ? 'hover:text-green-600' : 
                  difficulty === 'medium' 
                  ? 'hover:text-blue-600' : 
                  'hover:text-purple-600'
                }`}
                  size="icon"
                >
                  <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                  <span className="text-xs text-gray-600 mt-1 font-medium">点击播放</span>
                  </div>
                </Button>
              </div>
            
            {/* 音频波形 */}
            <AudioWaveform isPlaying={isPlaying} difficulty={difficulty} />
              
              {/* 音频播放次数可视化 */}
            <div className="flex items-center justify-center space-x-1 mt-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i < Math.min(playCount, 5) 
                    ? difficulty === 'easy' 
                      ? 'bg-green-500' 
                      : difficulty === 'medium' 
                        ? 'bg-blue-500' 
                        : 'bg-purple-500' 
                    : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              {playCount > 5 && <span className={`text-xs ml-1 ${
                difficulty === 'easy' ? 'text-green-600' : 
                difficulty === 'medium' ? 'text-blue-600' : 
                'text-purple-600'
              }`}>+{playCount - 5}</span>}
            </div>
              </div>
              
          {/* 播放速度控制 */}
          <div className="flex justify-center items-center gap-2 py-1">
                <Button 
                  size="sm" 
              variant="outline" 
              onClick={() => setPlaybackRate(0.75)}
              className={`rounded-md px-3 py-1 border transition-colors ${
                playbackRate === 0.75 
                ? difficulty === 'easy'
                  ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                  : difficulty === 'medium'
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
              0.75x
                </Button>
                <Button 
                  size="sm" 
              variant="outline" 
              onClick={() => setPlaybackRate(1.0)}
              className={`rounded-md px-3 py-1 border transition-colors ${
                    playbackRate === 1.0 
                ? difficulty === 'easy'
                  ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                  : difficulty === 'medium'
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  1.0x
                </Button>
                <Button 
                  size="sm" 
              variant="outline" 
              onClick={() => setPlaybackRate(1.25)}
              className={`rounded-md px-3 py-1 border transition-colors ${
                playbackRate === 1.25 
                ? difficulty === 'easy'
                  ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                  : difficulty === 'medium'
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
              1.25x
                </Button>
              </div>
              
          {/* 输入区域 */}
          <div>
            <div className="mb-4">
              <label htmlFor="user-input" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                输入听到的内容
                </label>
              <div className="relative">
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
                  className={`h-12 text-lg rounded-md transition-colors ${
                      isCorrect === true 
                    ? 'border-green-300 focus:border-green-400 focus:ring-green-400 bg-green-50/30' 
                        : isCorrect === false 
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400 bg-red-50/30' 
                    : `border-gray-300 focus:border-${
                        difficulty === 'easy' ? 'green' : 
                        difficulty === 'medium' ? 'blue' : 
                        'purple'
                      }-400 focus:ring-${
                        difficulty === 'easy' ? 'green' : 
                        difficulty === 'medium' ? 'blue' : 
                        'purple'
                      }-400`
                  }`}
                  disabled={isRevealed}
                />
                      </div>
              {/* 比较结果 */}
              {comparisonResult && (
                <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-100">
                  {comparisonResult}
                    </div>
                  )}
              </div>
              
            {/* 提示系统 */}
            {mode === 'practice' && !isRevealed && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => showHintHandler('firstChar')}
                    className={`rounded-md border-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-200 text-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-700 hover:bg-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-50 transition-colors`}
                  >
                    首字提示
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => showHintHandler('lastChar')}
                    className={`rounded-md border-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-200 text-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-700 hover:bg-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-50 transition-colors`}
                  >
                    尾字提示
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => showHintHandler('length')}
                    className={`rounded-md border-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-200 text-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-700 hover:bg-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-50 transition-colors`}
                  >
                    长度提示
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => showHintHandler('masked')}
                    className={`rounded-md border-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-200 text-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-700 hover:bg-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-50 transition-colors`}
                  >
                    部分显示
                  </Button>
                </div>
                
                {/* 显示提示 */}
                {showHint && (
                  <div className={`mt-3 p-3 rounded-md border text-gray-700 bg-${
                    difficulty === 'easy' ? 'green' : 
                    difficulty === 'medium' ? 'blue' : 
                    'purple'
                  }-50 border-${
                    difficulty === 'easy' ? 'green' : 
                    difficulty === 'medium' ? 'blue' : 
                    'purple'
                  }-100`}>
                    {hints[showHint]}
                </div>
              )}
            </div>
            )}
            
            <div className="flex justify-between pt-2">
              <div>
                {!isRevealed && (
              <Button 
                    onClick={() => {
                      setIsRevealed(true);
                      setComparisonResult(
                        <div className="space-y-2">
                          <p className="text-base">
                            <span className="text-gray-600 mr-2">正确答案:</span> 
                            <span className="font-bold text-gray-900 text-lg">{currentDictation.text}</span>
                          </p>
                          <p className="text-base text-gray-600">
                            <span className="font-medium">含义:</span> <span className="text-gray-700">{currentDictation.meaning}</span>
                          </p>
                          <div className="mt-2 p-2 rounded-md bg-blue-50 text-blue-700 border border-blue-100 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                            <span>已显示答案</span>
                          </div>
                        </div>
                      );
                    }}
                    variant="outline"
                    className={`rounded-md border-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-200 text-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-700 hover:bg-${
                      difficulty === 'easy' ? 'green' : 
                      difficulty === 'medium' ? 'blue' : 
                      'purple'
                    }-50 transition-colors`}
                  >
                    显示答案
              </Button>
                )}
            </div>
              <div className="space-x-2">
              <Button 
                onClick={resetCurrent} 
                variant="outline" 
                  className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                重置
              </Button>
              <Button 
                  onClick={isCorrect === null ? checkAnswer : nextDictation}
                  className={`rounded-md ${
                    isCorrect === null 
                    ? `bg-${difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'blue' : 'purple'}-600 hover:bg-${difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'blue' : 'purple'}-700` 
                    : `bg-${difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'blue' : 'purple'}-600 hover:bg-${difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'blue' : 'purple'}-700`
                  } text-white transition-colors`}
                >
                  {isCorrect === null ? '检查' : '下一题'}
              </Button>
            </div>
            </div>
          </div>
            </CardContent>
        </Card>
        
      {/* 课程选择模态框 */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="sm:max-w-[500px] bg-white backdrop-blur-sm rounded-lg border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">选择课程</DialogTitle>
            <DialogDescription>
              选择一个课程来开始听写练习
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {mockCourses.map((course) => (
              <div
                key={course.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedCourse === course.id 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-200 shadow-md' 
                  : 'hover:bg-gray-50 border-gray-100'
                }`}
                onClick={() => changeCourse(course.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium ${selectedCourse === course.id ? 'text-indigo-700' : 'text-gray-800'}`}>{course.title}</h3>
                  <Badge variant="outline" className={`${
                    selectedCourse === course.id 
                    ? 'bg-white border-indigo-200 text-indigo-700' 
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>{course.level}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className={`text-xs ${selectedCourse === course.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>初级: {course.dictationIds.easy.length}题</Badge>
                  <Badge variant="secondary" className={`text-xs ${selectedCourse === course.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>中级: {course.dictationIds.medium.length}题</Badge>
                  <Badge variant="secondary" className={`text-xs ${selectedCourse === course.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>高级: {course.dictationIds.hard.length}题</Badge>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCourseModal(false)}
              className="rounded-md border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700"
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 帮助对话框 */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white backdrop-blur-sm rounded-lg border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">听写练习帮助</DialogTitle>
            <DialogDescription>
              学习如何有效使用听写练习功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                基本使用
              </h4>
              <ul className="text-sm space-y-2 text-gray-600 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  点击播放按钮聆听音频
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  在输入框中输入你听到的日语
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  点击"检查答案"验证你的听写
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  完成后进入下一题
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                </svg>
                模式说明
              </h4>
              <ul className="text-sm space-y-2 text-gray-600 ml-6">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="font-medium text-indigo-700">练习模式</span>: 自由练习，无计分
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span className="font-medium text-indigo-700">挑战模式</span>: 获得积分，跟踪连续答对
                </li>
              </ul>
                </div>
      
            <div>
              <h4 className="font-medium mb-2 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                快捷键
              </h4>
              <ul className="text-sm space-y-2 text-gray-600 ml-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="font-medium text-green-700">Alt+P</span>: 播放音频
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="font-medium text-green-700">Alt+Enter</span>: 检查答案
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="font-medium text-green-700">Alt+N</span>: 进入下一题
                </li>
              </ul>
                </div>
                </div>
          <div className="flex justify-end">
            <Button 
              onClick={() => setHelpDialogOpen(false)}
              className="rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              关闭
            </Button>
              </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 