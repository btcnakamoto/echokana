import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from "../../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import logoSvg from "../../assets/images/logo.svg";

// 课程分类
type CourseCategory = '常用' | '会话' | '旅游' | '商务' | '文化' | '考试';

// 模拟课程数据 - 增加了更多课程和分类信息
const mockCourses = [
  {
    id: 1,
    title: '日常会话基础',
    description: '基础日常用语和简短对话',
    level: '初级',
    icon: '💬',
    category: '会话' as CourseCategory,
    isPopular: true,
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
    icon: '🧳',
    category: '旅游' as CourseCategory,
    isPopular: true,
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
    icon: '💼',
    category: '商务' as CourseCategory,
    isPopular: true,
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
    icon: '🔄',
    category: '常用' as CourseCategory,
    isPopular: true,
    dictationIds: {
      easy: [1, 2, 3],
      medium: [4, 5, 6],
      hard: [7, 8, 9]
    }
  },
  // 添加更多课程
  {
    id: 5,
    title: '餐厅用语',
    description: '在餐厅点餐和用餐的相关用语',
    level: '初级',
    icon: '🍽️',
    category: '旅游' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [1, 2],
      medium: [4],
      hard: [7]
    }
  },
  {
    id: 6,
    title: '交通出行',
    description: '乘坐公共交通工具的相关用语',
    level: '初级',
    icon: '🚆',
    category: '旅游' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [3],
      medium: [5],
      hard: [9]
    }
  },
  {
    id: 7,
    title: '商务电话',
    description: '商务电话沟通中的常用表达',
    level: '高级',
    icon: '📞',
    category: '商务' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [2],
      medium: [6],
      hard: [8]
    }
  },
  {
    id: 8,
    title: '面试准备',
    description: '求职面试中的常用表达',
    level: '高级',
    icon: '👔',
    category: '商务' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [1],
      medium: [4],
      hard: [7]
    }
  },
  {
    id: 9,
    title: '日本文化',
    description: '与日本文化相关的常用表达',
    level: '中级',
    icon: '🏮',
    category: '文化' as CourseCategory,
    isPopular: true,
    dictationIds: {
      easy: [3],
      medium: [5],
      hard: [9]
    }
  },
  {
    id: 10,
    title: 'JLPT N5词汇',
    description: '日语能力测试N5级别的词汇',
    level: '初级',
    icon: '📝',
    category: '考试' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [1, 2, 3],
      medium: [4],
      hard: [7]
    }
  },
  {
    id: 11,
    title: 'JLPT N4词汇',
    description: '日语能力测试N4级别的词汇',
    level: '中级',
    icon: '📚',
    category: '考试' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [2],
      medium: [5, 6],
      hard: [8]
    }
  },
  {
    id: 12,
    title: 'JLPT N3词汇',
    description: '日语能力测试N3级别的词汇',
    level: '中级',
    icon: '🎓',
    category: '考试' as CourseCategory,
    isPopular: false,
    dictationIds: {
      easy: [3],
      medium: [4, 5],
      hard: [9]
    }
  }
];

// 获取所有课程分类
const allCategories: CourseCategory[] = ['常用', '会话', '旅游', '商务', '文化', '考试'];

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
            className="bg-gradient-to-t from-indigo-300 to-indigo-500 rounded-full w-[2px] mx-[1px] transition-all duration-200 opacity-80"
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
  const [attemptCount, setAttemptCount] = useState(0); // 记录尝试次数
  const [selectedCourse, setSelectedCourse] = useState(4); // 默认选择"全部内容"课程
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | '全部'>('全部');
  
  // 卡片标记状态
  const [cardMarks, setCardMarks] = useState<Record<string, 'easy' | 'medium' | 'hard' | null>>({});
  const [showMarkDialog, setShowMarkDialog] = useState(false);

  // 过滤显示在左侧的课程（只显示热门或常用的有限数量）
  const sidebarCourses = mockCourses
    .filter(course => course.isPopular)
    .slice(0, 4); // 最多显示4个常用课程
  
  // 过滤课程选择对话框中显示的课程
  const getFilteredCourses = () => {
    return mockCourses.filter(course => {
      // 搜索词过滤
      const matchesSearch = courseSearchTerm === '' || 
        course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(courseSearchTerm.toLowerCase());
      
      // 分类过滤
      const matchesCategory = selectedCategory === '全部' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  // 获取当前选择的课程
  const currentCourse = mockCourses.find(course => course.id === selectedCourse) || mockCourses[3];
  
  // 获取当前难度下的听写题目IDs
  const filteredDictationIds = currentCourse.dictationIds[difficulty];
  
  // 基于课程筛选听写题目
  const filteredDictations = filteredDictationIds.map(
    id => mockDictations[difficulty].find(dictation => dictation.id === id)
  ).filter(Boolean) as (typeof mockDictations)[Difficulty];
  
  // 检查是否有可用的题目，如果没有则使用默认内容
  const currentDictationSet = filteredDictations.length > 0 
    ? filteredDictations 
    : mockDictations[difficulty];
  
  const currentDictation = currentDictationSet[currentIndex];
  const progressPercentage = ((currentIndex + 1) / currentDictationSet.length) * 100;
  
  // 课程选择逻辑
  const changeCourse = (courseId: number) => {
    setSelectedCourse(courseId);
    setCurrentIndex(0);
    resetCurrent();
    setShowCourseModal(false);
  };
  
  // 获取当前卡片的唯一标识符
  const getCurrentCardKey = () => `${difficulty}-${currentDictation.id}`;
  
  // 获取当前卡片的标记
  const getCurrentCardMark = () => cardMarks[getCurrentCardKey()] || null;
  
  // 标记当前卡片
  const markCurrentCard = (mark: 'easy' | 'medium' | 'hard' | null) => {
    const cardKey = getCurrentCardKey();
    setCardMarks(prev => ({
      ...prev,
      [cardKey]: mark
    }));
    setShowMarkDialog(false);
  };
  
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
  
  // 自动聚焦到输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);
  
  // 自动标记卡片难度
  const autoMarkDifficulty = (isCorrect: boolean) => {
    if (!isCorrect) {
      // 答错时增加尝试次数
      setAttemptCount(prev => prev + 1);
      return;
    }
    
    // 答对时，根据尝试次数和播放次数自动标记
    const cardKey = getCurrentCardKey();
    // 如果已经标记过，不再自动标记
    if (cardMarks[cardKey]) return;
    
    let autoMark: 'easy' | 'medium' | 'hard' = 'easy';
    
    // 条件逻辑：根据尝试次数和播放次数确定难度
    if (attemptCount === 0 && playCount <= 1) {
      // 第一次就答对，且听音频次数不超过1次
      autoMark = 'easy';
    } else if (attemptCount <= 1 && playCount <= 3) {
      // 尝试不超过1次，且听音频次数不超过3次
      autoMark = 'medium';
    } else {
      // 多次尝试或听音频超过3次才答对
      autoMark = 'hard';
    }
    
    // 自动标记
    setCardMarks(prev => ({
      ...prev,
      [cardKey]: autoMark
    }));
    
    // 仍然弹出标记对话框，让用户可以修改自动标记
    setTimeout(() => {
      setShowMarkDialog(true);
    }, 1000);
  };
  
  // 检查答案
  const checkAnswer = () => {
    if (!userInput.trim()) return;
    
    const isAnswerCorrect = userInput.trim() === currentDictation.text;
    setIsCorrect(isAnswerCorrect);
    
    // 创建比较结果
    const correctText = currentDictation.text;
    const userText = userInput.trim();
    
    // 比较文本
    compareTexts();
    
    if (isAnswerCorrect) {
      // 答对时自动标记难度
      autoMarkDifficulty(true);
    } else {
      // 答错时记录尝试
      autoMarkDifficulty(false);
    }
  };
  
  // 比较用户输入和正确答案，高亮显示差异
  const compareTexts = () => {
    const correctText = currentDictation.text;
    const userText = userInput.trim();
    
    // 如果完全正确，显示完整的正确答案
    if (userText === correctText) {
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
  
  // 显示提示
  const showHintHandler = (hintType: HintType) => {
    const hints = generateHints(currentDictation.text);
    setHintText(hints[hintType]);
    setShowHint(true);
  };
  
  // 重置当前题目
  const resetCurrent = () => {
    setUserInput('');
    setIsCorrect(null);
    setIsRevealed(false);
    setComparisonResult(null);
    setShowHint(false);
    setPlayCount(0);
    setAttemptCount(0); // 重置尝试次数
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // 下一题
  const nextDictation = () => {
    const newIndex = (currentIndex + 1) % currentDictationSet.length;
    
    // 如果答对了但没有标记，则显示标记对话框
    if (isCorrect && !showMarkDialog && getCurrentCardMark() === null) {
      setShowMarkDialog(true);
      return;
    }
    
    setCurrentIndex(newIndex);
    resetCurrent();
  };
  
  // 显示答案
  const revealAnswer = () => {
    setIsRevealed(true);
    setUserInput(currentDictation.text);
    setComparisonResult(
      <div className="space-y-3">
        <p className="text-base">
          <span className="text-gray-600 mr-2">正确答案:</span>
          <span className="font-bold text-indigo-600 text-lg">{currentDictation.text}</span>
        </p>
        <p className="text-base text-gray-600">
          <span className="font-medium">含义:</span> <span className="text-indigo-700">{currentDictation.meaning}</span>
        </p>
        <p className="text-base text-gray-600">
          <span className="font-medium">分类:</span> <span className="text-indigo-700">{currentDictation.type}</span>
        </p>
      </div>
    );
    
    // 回答错误时自动显示标记对话框
    if (!isCorrect) {
      setTimeout(() => {
        setShowMarkDialog(true);
      }, 1000);
    }
  };
  
  // 切换难度
  const changeDifficulty = (newDifficulty: Difficulty) => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty);
      setCurrentIndex(0);
      resetCurrent();
    }
  };
  
  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果帮助对话框打开，不处理其他快捷键
      if (helpDialogOpen) return;
      
      // 空格: 播放音频
      if (e.code === 'Space' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        playAudio();
      }
      // Alt+R: 重置当前题目
      else if (e.altKey && e.key === 'r') {
        e.preventDefault();
        resetCurrent();
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
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      {/* 曲线背景区域 */}
      <div className="absolute top-0 right-0 z-0 overflow-hidden h-full w-full pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M40,0 L100,0 L100,85 Q60,75 40,0"
            fill="#f3f4ff"
          />
        </svg>
      </div>
      
      {/* 右上方圆形装饰 */}
      <div className="absolute z-10" style={{ 
        top: '6vh',
        right: '-108px',  
        width: '216px', 
        height: '216px', 
        background: '#ffccc3',
        borderRadius: '50%'
      }}></div>
      
      {/* 左下方圆形装饰 */}
      <div className="absolute z-10" style={{ 
        bottom: '12%',
        left: '-45px',  
        width: '130px', 
        height: '130px', 
        background: '#ffccc3',
        borderRadius: '50%'
      }}></div>
      
      {/* 中间偏右上方圆形装饰 */}
      <div className="absolute z-10" style={{ 
        top: '30%',
        left: '60%',  
        width: '100px', 
        height: '100px', 
        background: '#ffccc3',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)'
      }}></div>
      
      <div className="relative z-10 h-full">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 h-16 flex items-center" style={{ paddingLeft: "14%", paddingRight: "14%" }}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              返回
            </Button>
            <img src={logoSvg} alt="Echokana Logo" className="h-8 w-auto" />
          </div>
          <div className="flex-1 text-center text-lg font-medium tracking-wide text-gray-900">沉浸式听写练习</div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setHelpDialogOpen(true)}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </Button>
        </header>
        
        {/* 课程选择器 - 固定在左侧 */}
        <div className="fixed left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40">
          {/* 显示热门/常用课程（有限数量） */}
          {sidebarCourses.map(course => (
            <Button
              key={course.id}
              variant={selectedCourse === course.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeCourse(course.id)}
              className={`rounded-full w-12 h-12 p-0 backdrop-blur-sm transition-all duration-300 ${
                selectedCourse === course.id
                ? 'bg-indigo-800 hover:bg-indigo-700 text-white shadow-lg'
                : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              title={course.title}
            >
              <span className="text-lg">{course.icon}</span>
            </Button>
          ))}
          
          {/* "更多课程"按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCourseModal(true)}
            className="rounded-full w-12 h-12 p-0 backdrop-blur-sm transition-all duration-300 bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-100"
            title="更多课程"
          >
            <span className="text-lg">⋯</span>
          </Button>
        </div>
        
        {/* 当前课程信息 - 添加在进度条下方 */}
        <div className="sticky top-16 left-0 right-0 z-40">
          <div className="h-1 bg-gray-100">
            <div 
              className="h-full bg-indigo-800"
              style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
            ></div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 py-2 text-sm text-center text-gray-700">
            当前课程: <span className="font-medium text-indigo-800">{currentCourse.title}</span> | 
            难度: <span className="font-medium text-indigo-800">{difficulty === 'easy' ? '初级' : difficulty === 'medium' ? '中级' : '高级'}</span> | 
            进度: <span className="font-medium text-indigo-800">{currentIndex + 1}/{currentDictationSet.length}</span>
          </div>
        </div>
        
        {/* 主要内容区域 - 使用padding确保内容完全显示 */}
        <main className="py-12 flex flex-col items-center" style={{ paddingLeft: "14%", paddingRight: "14%" }}>
          <div className="w-full max-w-2xl mx-auto">
            {/* 听写卡片 */}
            <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-sm text-white bg-indigo-800">
                      {currentIndex + 1}
                    </span>
                    听写练习
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getCurrentCardMark() && (
                      <Badge 
                        className={`px-3 rounded-full ${
                          getCurrentCardMark() === 'easy' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : getCurrentCardMark() === 'medium' 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {getCurrentCardMark() === 'easy' ? '容易' : getCurrentCardMark() === 'medium' ? '适中' : '困难'}
                      </Badge>
                    )}
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 rounded-full">
                      {currentDictation.level}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-5">
                {/* 音频播放器（隐藏） */}
                <audio ref={audioRef} src={currentDictation.audioUrl} className="hidden" />
                
                {/* 音频播放器中央区域 */}
                <div className="flex flex-col items-center py-6">
                  <Button 
                    onClick={playAudio} 
                    className="relative h-24 w-24 rounded-full shadow-lg bg-indigo-800 hover:bg-indigo-700 transition-all duration-300"
                    size="icon"
                  >
                    <div className="absolute inset-1 rounded-full bg-white/10 flex flex-col items-center justify-center">
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
                          ? 'bg-indigo-500'  
                          : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                    {playCount > 5 && <span className="text-xs ml-1 text-indigo-600">+{playCount - 5}</span>}
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
                      ? "bg-indigo-800 hover:bg-indigo-700 text-white border-transparent rounded-full px-4"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4"
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
                      ? "bg-indigo-800 hover:bg-indigo-700 text-white border-transparent rounded-full px-4"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4"
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
                      ? "bg-indigo-800 hover:bg-indigo-700 text-white border-transparent rounded-full px-4"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4"
                    }
                  >
                    1.25x
                  </Button>
                </div>
                
                {/* 输入区域 */}
                <div className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="user-input" className="block text-sm font-medium text-gray-700 mb-2">
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
                        ? 'bg-green-50 border-green-300 text-gray-900 focus:border-green-400 focus:ring-green-400 focus:ring-opacity-30' 
                        : isCorrect === false 
                        ? 'bg-red-50 border-red-300 text-gray-900 focus:border-red-400 focus:ring-red-400 focus:ring-opacity-30' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-400 focus:ring-indigo-400 focus:ring-opacity-30'
                      }`}
                      disabled={isRevealed}
                    />
                  </div>
                  
                  {/* 比较结果 */}
                  {comparisonResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      {comparisonResult}
                    </div>
                  )}
                  
                  {/* 提示显示 */}
                  {showHint && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-gray-700">
                      {hintText}
                    </div>
                  )}
                </div>
                
                {/* 操作按钮 */}
                <CardContent className="border-t border-gray-100 p-4">
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
                        onClick={() => showHintHandler('firstChar')}
                      >
                        提示
                      </Button>
                      {isCorrect === false && (
                        <Button 
                          variant="outline" 
                          className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
                          onClick={revealAnswer}
                        >
                          显示答案
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
                        onClick={() => setShowMarkDialog(true)}
                      >
                        标记
                      </Button>
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
                        onClick={resetCurrent}
                      >
                        重置
                      </Button>
                      {isCorrect === null ? (
                        <Button 
                          className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                          onClick={checkAnswer}
                        >
                          确认
                        </Button>
                      ) : (
                        <Button 
                          className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                          onClick={nextDictation}
                        >
                          下一题
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* 帮助对话框 */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">听写练习帮助</DialogTitle>
            <DialogDescription className="text-gray-600">
              如何使用听写练习功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">基本操作</h3>
              <p>点击中间的播放按钮听取音频，然后在输入框中输入你听到的内容。</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">快捷键</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-gray-800">空格</span> - 播放/重播音频</li>
                <li><span className="text-gray-800">Enter</span> - 提交答案</li>
                <li><span className="text-gray-800">Alt+R</span> - 重置当前题目</li>
                <li><span className="text-gray-800">Alt+N</span> - 下一题</li>
                <li><span className="text-gray-800">Alt+H</span> - 显示提示</li>
                <li><span className="text-gray-800">Alt+A</span> - 显示答案</li>
                <li><span className="text-gray-800">Alt+1/2/3</span> - 切换难度</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">提示功能</h3>
              <p>如果遇到困难，可以使用提示功能获取帮助。</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setHelpDialogOpen(false)}
              className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
            >
              明白了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 标记对话框 */}
      <Dialog open={showMarkDialog} onOpenChange={setShowMarkDialog}>
        <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">标记难度</DialogTitle>
            <DialogDescription className="text-gray-600">
              请标记此卡片对你的难度级别
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-6 h-auto flex flex-col gap-2"
              onClick={() => markCurrentCard('easy')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>容易</span>
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 py-6 h-auto flex flex-col gap-2"
              onClick={() => markCurrentCard('medium')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>适中</span>
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-6 h-auto flex flex-col gap-2"
              onClick={() => markCurrentCard('hard')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>困难</span>
            </Button>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowMarkDialog(false)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
            >
              跳过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 课程选择对话框 - 增强版 */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">选择课程</DialogTitle>
            <DialogDescription className="text-gray-600">
              请选择要练习的听写课程
            </DialogDescription>
          </DialogHeader>
          
          {/* 搜索和过滤区域 */}
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="搜索课程..."
              value={courseSearchTerm}
              onChange={(e) => setCourseSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <Tabs defaultValue="全部" value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CourseCategory | '全部')}>
              <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
                <TabsTrigger value="全部" className="flex-shrink-0">全部</TabsTrigger>
                {allCategories.map(category => (
                  <TabsTrigger key={category} value={category} className="flex-shrink-0">{category}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* 课程列表 - 带滚动条 */}
          <div className="overflow-y-auto flex-1 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getFilteredCourses().length > 0 ? (
                getFilteredCourses().map(course => (
                  <Button
                    key={course.id}
                    variant={selectedCourse === course.id ? "default" : "outline"}
                    className={`flex items-center justify-between p-4 h-auto ${
                      selectedCourse === course.id 
                      ? "bg-indigo-800 hover:bg-indigo-700 text-white" 
                      : "border-gray-200 hover:bg-gray-50"
                    } rounded-xl`}
                    onClick={() => changeCourse(course.id)}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{course.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{course.title}</div>
                        <div className={`text-xs ${selectedCourse === course.id ? "text-white/80" : "text-gray-500"}`}>
                          {course.description}
                        </div>
                      </div>
                    </div>
                    <Badge className={selectedCourse === course.id 
                      ? "bg-white/20 text-white"
                      : "bg-indigo-100 text-indigo-800"
                    }>
                      {course.level}
                    </Badge>
                  </Button>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-gray-500">
                  未找到符合条件的课程
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              onClick={() => setShowCourseModal(false)}
              className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 