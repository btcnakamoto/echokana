import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import logoSvg from "../../assets/images/logo.svg";

// 定义听力练习类型
type ListeningCategory = '全部' | '日常会话' | '新闻' | '讲座' | '电影片段' | '情景对话';

// 定义练习难度
type DifficultyLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

// 定义练习模式
type ExerciseType = '内容理解' | '关键词填空' | '句子排序' | '摘要写作';

// 定义听力练习接口
interface ListeningExercise {
  id: number;
  title: string;
  audioUrl: string;
  transcript: string;
  translation: string;
  level: DifficultyLevel;
  category: ListeningCategory;
  exerciseType: ExerciseType;
  questions?: {
    id: number;
    question: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  }[];
  missingWords?: {
    index: number;
    word: string;
    hint?: string;
  }[];
  duration: number; // 音频时长（秒）
}

// 所有练习分类
const allCategories: ListeningCategory[] = ['全部', '日常会话', '新闻', '讲座', '电影片段', '情景对话'];

// 模拟听力练习数据
const mockExercises: ListeningExercise[] = [
  {
    id: 1,
    title: '自己紹介 - 初次见面',
    audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=じこしょうかい&kanji=自己紹介',
    transcript: 'はじめまして。田中と申します。東京から来ました。大学で日本語を教えています。どうぞよろしくお願いします。',
    translation: '初次见面。我叫田中。我来自东京。我在大学教日语。请多关照。',
    level: 'N5',
    category: '日常会话',
    exerciseType: '内容理解',
    questions: [
      {
        id: 101,
        question: '田中さんの仕事は何ですか？',
        options: ['学生', '先生', '会社員', '医者'],
        correctAnswer: 1,
        explanation: '田中さんは「大学で日本語を教えています」と言いました。つまり、先生です。'
      },
      {
        id: 102,
        question: '田中さんはどこから来ましたか？',
        options: ['大阪', '京都', '東京', '北海道'],
        correctAnswer: 2,
        explanation: '田中さんは「東京から来ました」と言いました。'
      }
    ],
    duration: 8
  },
  {
    id: 2,
    title: '天気予報 - 明日の天気',
    audioUrl: 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=てんきよほう&kanji=天気予報',
    transcript: '明日の天気予報です。東京は晴れ、最高気温は25度、最低気温は18度の見込みです。午後から雲が増え、夕方には雨が降るでしょう。傘をお持ちください。',
    translation: '这是明天的天气预报。东京晴朗，预计最高气温25度，最低气温18度。从下午开始云量增加，傍晚可能会下雨。请携带雨伞。',
    level: 'N4',
    category: '新闻',
    exerciseType: '关键词填空',
    missingWords: [
      { index: 2, word: '天気予報', hint: '天気に関する情報' },
      { index: 12, word: '最高気温', hint: '一番高い温度' },
      { index: 23, word: '雲', hint: '空にある白いもの' },
      { index: 32, word: '傘', hint: '雨から身を守るもの' }
    ],
    duration: 15
  }
];

export default function ListeningPage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 状态管理
  const [exercises, setExercises] = useState<ListeningExercise[]>(mockExercises);
  const [selectedCategory, setSelectedCategory] = useState<ListeningCategory>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{[key: number]: boolean}>({});
  const [filledWords, setFilledWords] = useState<{[key: number]: string}>({});
  
  // 过滤练习
  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === '全部' || exercise.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // 打开练习详情
  const openExercise = (exercise: ListeningExercise) => {
    setSelectedExercise(exercise);
    setShowExerciseModal(true);
    setUserAnswers({});
    setSubmittedAnswers({});
    setFilledWords({});
    
    // 重置音频
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  // 播放/暂停音频
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // 更改播放速度
  const changePlaybackRate = (rate: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };
  
  // 选择答案
  const selectAnswer = (questionId: number, optionIndex: number) => {
    if (submittedAnswers[questionId]) return; // 如果已提交，不允许更改
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  // 提交答案
  const submitAnswer = (questionId: number) => {
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionId]: true
    }));
  };
  
  // 检查答案是否正确
  const isAnswerCorrect = (questionId: number) => {
    if (!selectedExercise?.questions) return false;
    
    const question = selectedExercise.questions.find(q => q.id === questionId);
    if (!question) return false;
    
    return userAnswers[questionId] === question.correctAnswer;
  };
  
  // 填写关键词
  const fillWord = (index: number, word: string) => {
    setFilledWords(prev => ({
      ...prev,
      [index]: word
    }));
  };
  
  // 检查填写的词是否正确
  const isWordCorrect = (index: number) => {
    if (!selectedExercise?.missingWords) return false;
    
    const wordObj = selectedExercise.missingWords.find(w => w.index === index);
    if (!wordObj) return false;
    
    return filledWords[index]?.trim().toLowerCase() === wordObj.word.toLowerCase();
  };
  
  // 音频结束时的处理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
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
          <div className="flex-1 text-center text-lg font-medium tracking-wide text-gray-900">长句听力练习</div>
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
        
        {/* 主内容区 */}
        <main className="py-8" style={{ paddingLeft: "14%", paddingRight: "14%" }}>
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">长句听力练习</h1>
              <p className="text-gray-600">
                通过长句听力练习提高你的日语听力理解能力
              </p>
            </div>
            
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input 
                placeholder="搜索练习..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              
              <Tabs 
                defaultValue="全部" 
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as ListeningCategory)}
                className="w-full"
              >
                <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
                  {allCategories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="flex-shrink-0"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            {/* 练习列表 */}
            <div className="grid grid-cols-1 gap-4">
              {filteredExercises.length > 0 ? (
                filteredExercises.map(exercise => (
                  <Card 
                    key={exercise.id} 
                    className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => openExercise(exercise)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                          <span>{exercise.title}</span>
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 mr-2">
                            {exercise.level}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2">
                            {exercise.exerciseType}
                          </Badge>
                          <span className="mr-4">{exercise.category}</span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            {exercise.duration} 秒
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                      >
                        开始练习
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2">
                        {exercise.transcript.substring(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  未找到符合条件的练习
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* 练习对话框 */}
      {selectedExercise && (
        <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
          <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {selectedExercise.title}
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {selectedExercise.level}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedExercise.exerciseType}
                  </Badge>
                </div>
              </div>
              <DialogDescription className="text-gray-600">
                {selectedExercise.category} · {selectedExercise.duration} 秒
              </DialogDescription>
            </DialogHeader>
            
            {/* 音频控制区 */}
            <div className="border-b border-gray-100 p-4">
              <audio ref={audioRef} src={selectedExercise.audioUrl} className="hidden" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={togglePlayPause}
                    className="h-12 w-12 rounded-full bg-indigo-800 hover:bg-indigo-700 flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    )}
                  </Button>
                  <div className="text-sm font-medium text-gray-700">
                    {isPlaying ? '暂停' : '播放'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">播放速度:</span>
                  <div className="flex gap-1">
                    {[0.75, 1.0, 1.25, 1.5].map(rate => (
                      <Button 
                        key={rate}
                        variant="outline"
                        size="sm"
                        onClick={() => changePlaybackRate(rate)}
                        className={`min-w-0 h-8 px-2 rounded-full ${
                          playbackRate === rate 
                            ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
                            : 'border-gray-200'
                        }`}
                      >
                        {rate}x
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 练习内容区 */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                {/* 根据练习类型显示不同内容 */}
                {selectedExercise.exerciseType === '内容理解' && selectedExercise.questions && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">听完音频后回答以下问题:</h3>
                    
                    {selectedExercise.questions.map((question, qIndex) => (
                      <div 
                        key={question.id}
                        className={`p-5 rounded-lg border ${
                          submittedAnswers[question.id]
                            ? isAnswerCorrect(question.id) 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                          {qIndex + 1}. {question.question}
                        </h4>
                        
                        {question.options && (
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, oIndex) => (
                              <div 
                                key={oIndex}
                                onClick={() => selectAnswer(question.id, oIndex)}
                                className={`p-3 rounded-md border cursor-pointer transition-all ${
                                  userAnswers[question.id] === oIndex
                                    ? submittedAnswers[question.id]
                                      ? isAnswerCorrect(question.id)
                                        ? 'bg-green-100 border-green-300 text-green-800'
                                        : oIndex === question.correctAnswer
                                          ? 'bg-green-100 border-green-300 text-green-800'
                                          : 'bg-red-100 border-red-300 text-red-800'
                                      : 'bg-indigo-100 border-indigo-300 text-indigo-800'
                                    : submittedAnswers[question.id] && oIndex === question.correctAnswer
                                      ? 'bg-green-100 border-green-300 text-green-800'
                                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                    userAnswers[question.id] === oIndex
                                      ? submittedAnswers[question.id]
                                        ? isAnswerCorrect(question.id)
                                          ? 'bg-green-500 text-white'
                                          : oIndex === question.correctAnswer
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                        : 'bg-indigo-500 text-white'
                                      : submittedAnswers[question.id] && oIndex === question.correctAnswer
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                  }`}>
                                    {String.fromCharCode(65 + oIndex)}
                                  </div>
                                  <span>{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {!submittedAnswers[question.id] ? (
                          <Button
                            onClick={() => submitAnswer(question.id)}
                            disabled={userAnswers[question.id] === undefined}
                            className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                          >
                            提交答案
                          </Button>
                        ) : (
                          <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-100">
                            <h5 className="font-medium text-blue-800 mb-2">解析</h5>
                            <p className="text-blue-700">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedExercise.exerciseType === '关键词填空' && selectedExercise.missingWords && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">在下面的文本中填写缺失的关键词:</h3>
                    
                    <div className="p-5 rounded-lg border border-gray-200 bg-white">
                      <div className="leading-relaxed text-lg">
                        {selectedExercise.transcript.split(' ').map((word, index) => {
                          const isMissingWord = selectedExercise.missingWords?.some(w => w.index === index);
                          const missingWord = selectedExercise.missingWords?.find(w => w.index === index);
                          
                          if (isMissingWord) {
                            return (
                              <span key={index} className="inline-block mx-1 mb-2">
                                <Input
                                  value={filledWords[index] || ''}
                                  onChange={(e) => fillWord(index, e.target.value)}
                                  className={`w-28 inline-block ${
                                    filledWords[index]
                                      ? isWordCorrect(index)
                                        ? 'border-green-300 focus:ring-green-300'
                                        : 'border-red-300 focus:ring-red-300'
                                      : ''
                                  }`}
                                  placeholder={missingWord?.hint || '...'}
                                />
                              </span>
                            );
                          }
                          
                          return <span key={index} className="inline-block mr-1">{word}</span>;
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // 显示提示
                          selectedExercise.missingWords?.forEach(word => {
                            if (!filledWords[word.index]) {
                              fillWord(word.index, word.hint || '');
                            }
                          });
                        }}
                        className="rounded-full"
                      >
                        显示提示
                      </Button>
                      
                      <Button
                        onClick={() => {
                          // 显示答案
                          selectedExercise.missingWords?.forEach(word => {
                            fillWord(word.index, word.word);
                          });
                        }}
                        className="rounded-full bg-indigo-800 hover:bg-indigo-700 text-white"
                      >
                        显示答案
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* 文本和翻译区域 */}
                <div className="mt-8 space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('transcript-section')?.classList.toggle('hidden')}
                    className="w-full rounded-full"
                  >
                    显示/隐藏文本
                  </Button>
                  
                  <div id="transcript-section" className="hidden space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">日语文本</h3>
                      <div className="text-gray-900">{selectedExercise.transcript}</div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">中文翻译</h3>
                      <div className="text-gray-700">{selectedExercise.translation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="border-t border-gray-100 pt-4">
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline"
                  onClick={() => setShowExerciseModal(false)}
                  className="rounded-full"
                >
                  返回列表
                </Button>
                <Button 
                  onClick={() => {
                    // 重新播放音频
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      audioRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                >
                  重新播放
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* 帮助对话框 */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">长句听力练习帮助</DialogTitle>
            <DialogDescription className="text-gray-600">
              如何使用长句听力练习功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">练习类型</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">内容理解</span>: 听完音频回答相关问题</li>
                <li><span className="font-medium">关键词填空</span>: 在文本中填写缺失的关键词</li>
                <li><span className="font-medium">句子排序</span>: 听完后将混乱的句子排列成正确顺序</li>
                <li><span className="font-medium">摘要写作</span>: 听完内容后用自己的话总结</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">如何使用</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>选择合适的练习类型和难度</li>
                <li>点击播放按钮聆听音频内容</li>
                <li>可以调整播放速度以适应自己的水平</li>
                <li>根据练习类型完成相应任务</li>
                <li>提交答案后查看正确答案和解析</li>
                <li>需要时可以显示文本和翻译辅助学习</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">学习建议</h3>
              <p>建议先尝试不看文本完成练习，如果有困难再查看文本和翻译。定期练习不同类型和难度的听力材料，可以有效提高日语听力理解能力。</p>
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
    </div>
  );
} 