import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import logoSvg from "../../assets/images/logo.svg";

// 阅读文章的分类
type ArticleCategory = '全部' | '日常会话' | '旅游' | '商务' | '文化' | '新闻';

// 定义阅读理解问题接口
interface ComprehensionQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 正确选项的索引
  explanation: string;
}

// 定义阅读文章接口
interface ReadingArticle {
  id: number;
  title: string;
  content: string;
  contentWithFurigana: string;
  translationCn: string;
  level: string;
  category: ArticleCategory;
  vocabularyList: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  estimatedReadTime: number;
  isCompleted?: boolean;
  isFavorite?: boolean; // 新增收藏状态
  comprehensionQuestions?: ComprehensionQuestion[]; // 新增阅读理解题
}

// 所有文章分类
const allCategories: ArticleCategory[] = ['全部', '日常会话', '旅游', '商务', '文化', '新闻'];

// 添加缺失的mockArticles定义
const mockArticles: ReadingArticle[] = [
  {
    id: 1,
    title: '私の一日',
    content: '毎朝、6時に起きます。朝ごはんを食べて、8時に家を出ます。電車で会社に行きます。会社は9時から5時までです。仕事の後で、友達と時々食事をします。家に帰って、テレビを見ます。11時に寝ます。',
    contentWithFurigana: '毎朝[まいあさ]、6[ろく]時[じ]に起[お]きます。朝[あさ]ごはんを食[た]べて、8[はち]時[じ]に家[いえ]を出[で]ます。電車[でんしゃ]で会社[かいしゃ]に行[い]きます。会社[かいしゃ]は9[く]時[じ]から5[ご]時[じ]までです。仕事[しごと]の後[あと]で、友達[ともだち]と時々[ときどき]食事[しょくじ]をします。家[いえ]に帰[かえ]って、テレビを見[み]ます。11[じゅういち]時[じ]に寝[ね]ます。',
    translationCn: '每天早上6点起床。吃过早饭后，8点出门。坐电车去公司。公司的工作时间是9点到5点。下班后，有时和朋友一起吃饭。回到家后，看电视。11点睡觉。',
    level: 'N5',
    category: '日常会话',
    vocabularyList: [
      { word: '起きます', reading: 'おきます', meaning: '起床' },
      { word: '食べます', reading: 'たべます', meaning: '吃' },
      { word: '電車', reading: 'でんしゃ', meaning: '电车' },
      { word: '会社', reading: 'かいしゃ', meaning: '公司' },
      { word: '友達', reading: 'ともだち', meaning: '朋友' },
      { word: '時々', reading: 'ときどき', meaning: '有时' }
    ],
    estimatedReadTime: 2,
    comprehensionQuestions: [
      {
        id: 101,
        question: '筆者は何時に起きますか？',
        options: ['5時', '6時', '7時', '8時'],
        correctAnswer: 1,
        explanation: '文章の最初に「毎朝、6時に起きます」と書いてあります。'
      },
      {
        id: 102,
        question: '筆者は会社の後で何をしますか？',
        options: ['テレビを見ます', '食事をします', '寝ます', '勉強します'],
        correctAnswer: 1,
        explanation: '「仕事の後で、友達と時々食事をします」と書いてあります。'
      }
    ]
  },
  {
    id: 2,
    title: '東京旅行',
    content: '先週、東京に行きました。新幹線で行って、3日間滞在しました。東京タワーと浅草寺に行きました。美味しい寿司を食べました。東京はとても賑やかな街です。また行きたいです。',
    contentWithFurigana: '先週[せんしゅう]、東京[とうきょう]に行[い]きました。新幹線[しんかんせん]で行[い]って、3[さん]日間[にちかん]滞在[たいざい]しました。東京[とうきょう]タワーと浅草寺[せんそうじ]に行[い]きました。美味[おい]しい寿司[すし]を食[た]べました。東京[とうきょう]はとても賑[にぎ]やかな街[まち]です。また行[い]きたいです。',
    translationCn: '上周，我去了东京。乘坐新干线去的，在那里停留了3天。参观了东京塔和浅草寺。吃了美味的寿司。东京是一个非常热闹的城市。我想再去一次。',
    level: 'N5',
    category: '旅游',
    vocabularyList: [
      { word: '先週', reading: 'せんしゅう', meaning: '上周' },
      { word: '新幹線', reading: 'しんかんせん', meaning: '新干线' },
      { word: '滞在', reading: 'たいざい', meaning: '停留' },
      { word: '浅草寺', reading: 'せんそうじ', meaning: '浅草寺' },
      { word: '美味しい', reading: 'おいしい', meaning: '美味的' },
      { word: '賑やか', reading: 'にぎやか', meaning: '热闹的' }
    ],
    estimatedReadTime: 3,
    comprehensionQuestions: [
      {
        id: 201,
        question: '筆者はどこに行きましたか？',
        options: ['京都', '大阪', '東京', '北海道'],
        correctAnswer: 2,
        explanation: '「先週、東京に行きました」と書いてあります。'
      },
      {
        id: 202,
        question: '筆者は何で東京に行きましたか？',
        options: ['飛行機', '新幹線', 'バス', '車'],
        correctAnswer: 1,
        explanation: '「新幹線で行って」と書いてあります。'
      }
    ]
  },
  {
    id: 3,
    title: '日本の四季',
    content: '日本には四季があります。春には桜が咲きます。夏は暑くて、海に行きます。秋には紅葉が美しいです。冬は雪が降ります。私は秋が一番好きです。',
    contentWithFurigana: '日本[にほん]には四季[しき]があります。春[はる]には桜[さくら]が咲[さ]きます。夏[なつ]は暑[あつ]くて、海[うみ]に行[い]きます。秋[あき]には紅葉[こうよう]が美[うつく]しいです。冬[ふゆ]は雪[ゆき]が降[ふ]ります。私[わたし]は秋[あき]が一番[いちばん]好[す]きです。',
    translationCn: '日本有四季。春天樱花盛开。夏天很热，人们去海边。秋天红叶很美。冬天下雪。我最喜欢秋天。',
    level: 'N5',
    category: '文化',
    vocabularyList: [
      { word: '四季', reading: 'しき', meaning: '四季' },
      { word: '桜', reading: 'さくら', meaning: '樱花' },
      { word: '咲きます', reading: 'さきます', meaning: '开花' },
      { word: '紅葉', reading: 'こうよう', meaning: '红叶' },
      { word: '雪', reading: 'ゆき', meaning: '雪' },
      { word: '一番', reading: 'いちばん', meaning: '最' }
    ],
    estimatedReadTime: 2
  },
  {
    id: 4,
    title: '会社の面接',
    content: '昨日、会社の面接がありました。緊張しましたが、上手く話せたと思います。面接官は三人いました。自己紹介と経験について話しました。来週、結果が分かります。',
    contentWithFurigana: '昨日[きのう]、会社[かいしゃ]の面接[めんせつ]がありました。緊張[きんちょう]しましたが、上手[じょうず]く話[はな]せたと思[おも]います。面接官[めんせつかん]は三人[さんにん]いました。自己紹介[じこしょうかい]と経験[けいけん]について話[はな]しました。来週[らいしゅう]、結果[けっか]が分[わ]かります。',
    translationCn: '昨天，我参加了公司面试。虽然很紧张，但我认为自己表达得很好。面试官有三人。我谈了自我介绍和经验。下周会知道结果。',
    level: 'N4',
    category: '商务',
    vocabularyList: [
      { word: '面接', reading: 'めんせつ', meaning: '面试' },
      { word: '緊張', reading: 'きんちょう', meaning: '紧张' },
      { word: '上手く', reading: 'じょうずく', meaning: '好地，巧妙地' },
      { word: '面接官', reading: 'めんせつかん', meaning: '面试官' },
      { word: '自己紹介', reading: 'じこしょうかい', meaning: '自我介绍' },
      { word: '経験', reading: 'けいけん', meaning: '经验' }
    ],
    estimatedReadTime: 3
  },
  {
    id: 5,
    title: '日本の新技術',
    content: '日本の企業が新しいロボット技術を発表しました。このロボットは家事を手伝うことができます。価格はまだ高いですが、将来は多くの家庭で使われるでしょう。技術の進歩は速いです。',
    contentWithFurigana: '日本[にほん]の企業[きぎょう]が新[あたら]しいロボット技術[ぎじゅつ]を発表[はっぴょう]しました。このロボットは家事[かじ]を手伝[てつだ]うことができます。価格[かかく]はまだ高[たか]いですが、将来[しょうらい]は多[おお]くの家庭[かてい]で使[つか]われるでしょう。技術[ぎじゅつ]の進歩[しんぽ]は速[はや]いです。',
    translationCn: '日本企业发布了新的机器人技术。这种机器人可以帮助做家务。尽管价格仍然很高，但将来可能会在许多家庭中使用。科技进步的速度很快。',
    level: 'N3',
    category: '新闻',
    vocabularyList: [
      { word: '企業', reading: 'きぎょう', meaning: '企业' },
      { word: '技術', reading: 'ぎじゅつ', meaning: '技术' },
      { word: '発表', reading: 'はっぴょう', meaning: '发表' },
      { word: '家事', reading: 'かじ', meaning: '家务' },
      { word: '価格', reading: 'かかく', meaning: '价格' },
      { word: '将来', reading: 'しょうらい', meaning: '将来' }
    ],
    estimatedReadTime: 4
  }
];

export default function ReadingPage() {
  const navigate = useNavigate();
  
  // 状态管理
  const [articles, setArticles] = useState<ReadingArticle[]>(mockArticles);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ReadingArticle | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  // 新增状态
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{[key: number]: boolean}>({});
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // 过滤文章
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorite = !showOnlyFavorites || article.isFavorite;
    
    return matchesCategory && matchesSearch && matchesFavorite;
  });
  
  // 打开文章详情
  const openArticle = (article: ReadingArticle) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
    setShowQuestions(false);
    setSelectedAnswers({});
    setSubmittedAnswers({});
  };
  
  // 将单词添加到生词本
  const addToVocabulary = (word: { word: string, reading: string, meaning: string }) => {
    // 这里将来会调用API添加到用户的生词本
    console.log('添加到生词本:', word);
  };
  
  // 标记文章为已读
  const markAsCompleted = (articleId: number) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isCompleted: true } 
          : article
      )
    );
    // 这里将来会调用API更新阅读状态
  };
  
  // 切换收藏状态
  const toggleFavorite = (articleId: number) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isFavorite: !article.isFavorite } 
          : article
      )
    );
    // 这里将来会调用API更新收藏状态
  };
  
  // 选择答案
  const selectAnswer = (questionId: number, optionIndex: number) => {
    if (submittedAnswers[questionId]) return; // 如果已提交，不允许更改
    
    setSelectedAnswers(prev => ({
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
    if (!selectedArticle?.comprehensionQuestions) return false;
    
    const question = selectedArticle.comprehensionQuestions.find(q => q.id === questionId);
    if (!question) return false;
    
    return selectedAnswers[questionId] === question.correctAnswer;
  };
  
  // 获取正确的答案选项
  const getCorrectAnswerText = (questionId: number) => {
    if (!selectedArticle?.comprehensionQuestions) return '';
    
    const question = selectedArticle.comprehensionQuestions.find(q => q.id === questionId);
    if (!question) return '';
    
    return question.options[question.correctAnswer];
  };
  
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
          <div className="flex-1 text-center text-lg font-medium tracking-wide text-gray-900">阅读练习</div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">阅读练习</h1>
              <p className="text-gray-600">
                浏览各种日语文章，提高阅读理解能力
              </p>
            </div>
            
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Input 
                  placeholder="搜索文章..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`h-10 px-3 rounded-full ${
                    showOnlyFavorites ? 'bg-pink-100 text-pink-800 border-pink-200' : ''
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={showOnlyFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  {showOnlyFavorites ? '所有文章' : '收藏'}
                </Button>
              </div>
              
              <Tabs 
                defaultValue="全部" 
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as ArticleCategory)}
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
            
            {/* 文章列表 */}
            <div className="grid grid-cols-1 gap-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <Card 
                    key={article.id} 
                    className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                      article.isCompleted ? 'border-green-200' : 'border-gray-200'
                    }`}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                          <span>{article.title}</span>
                          {article.isCompleted && (
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                              已读
                            </Badge>
                          )}
                          {article.comprehensionQuestions && article.comprehensionQuestions.length > 0 && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                              有练习题
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 mr-2">
                            {article.level}
                          </Badge>
                          <span className="mr-4">{article.category}</span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            {article.estimatedReadTime} 分钟
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(article.id);
                          }}
                          className="h-9 w-9 p-0 rounded-full"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill={article.isFavorite ? "currentColor" : "none"} 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className={`w-5 h-5 ${article.isFavorite ? 'text-pink-500' : 'text-gray-500'}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                          </svg>
                        </Button>
                        <Button 
                          onClick={() => openArticle(article)}
                          className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                        >
                          阅读
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2">
                        {article.content.substring(0, 100)}...
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.vocabularyList.slice(0, 3).map((word, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className="bg-gray-50 text-gray-700 hover:bg-gray-100"
                          >
                            {word.word}
                          </Badge>
                        ))}
                        {article.vocabularyList.length > 3 && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500">
                            +{article.vocabularyList.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  未找到符合条件的文章
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* 文章阅读对话框 */}
      {selectedArticle && (
        <Dialog open={showArticleModal} onOpenChange={setShowArticleModal}>
          <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {selectedArticle.title}
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-indigo-100 text-indigo-800">
                    {selectedArticle.level}
                  </Badge>
                  <Badge variant="outline">
                    {selectedArticle.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <DialogDescription className="text-gray-600">
                  预计阅读时间: {selectedArticle.estimatedReadTime} 分钟
                </DialogDescription>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFurigana(!showFurigana)}
                    className={`rounded-full px-3 ${
                      showFurigana 
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    假名标注
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTranslation(!showTranslation)}
                    className={`rounded-full px-3 ${
                      showTranslation 
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    中文翻译
                  </Button>
                  {selectedArticle.comprehensionQuestions && selectedArticle.comprehensionQuestions.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowQuestions(!showQuestions)}
                      className={`rounded-full px-3 ${
                        showQuestions 
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-200' 
                          : 'border-gray-200'
                      }`}
                    >
                      理解练习
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>
            
            {/* 文章内容 */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="prose max-w-none">
                {!showQuestions ? (
                  <>
                    <div className="text-xl leading-relaxed mb-8">
                      {showFurigana ? selectedArticle.contentWithFurigana : selectedArticle.content}
                    </div>
                    
                    {showTranslation && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">中文翻译</h3>
                        <p className="text-gray-700">{selectedArticle.translationCn}</p>
                      </div>
                    )}
                    
                    {/* 词汇列表 */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">重要词汇</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedArticle.vocabularyList.map((word, index) => (
                          <div 
                            key={index}
                            className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{word.word}</p>
                              <p className="text-sm text-gray-500">{word.reading} - {word.meaning}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => addToVocabulary(word)}
                              className="rounded-full h-8 w-8 p-0"
                              title="添加到生词本"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">阅读理解练习</h3>
                    
                    {selectedArticle.comprehensionQuestions?.map((question, qIndex) => (
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
                        
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, oIndex) => (
                            <div 
                              key={oIndex}
                              onClick={() => selectAnswer(question.id, oIndex)}
                              className={`p-3 rounded-md border cursor-pointer transition-all ${
                                selectedAnswers[question.id] === oIndex
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
                                  selectedAnswers[question.id] === oIndex
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
                        
                        {!submittedAnswers[question.id] ? (
                          <Button
                            onClick={() => submitAnswer(question.id)}
                            disabled={selectedAnswers[question.id] === undefined}
                            className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                          >
                            提交答案
                          </Button>
                        ) : (
                          <div className="mt-4 p-4 rounded-md bg-blue-50 border border-blue-100">
                            <h5 className="font-medium text-blue-800 mb-2">解析</h5>
                            <p className="text-blue-700">{question.explanation}</p>
                            {!isAnswerCorrect(question.id) && (
                              <p className="mt-2 font-medium text-blue-800">
                                正确答案: {getCorrectAnswerText(question.id)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuestions(false)}
                      className="mt-4 rounded-full"
                    >
                      返回文章
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="border-t border-gray-100 pt-4">
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline"
                  onClick={() => setShowArticleModal(false)}
                  className="rounded-full"
                >
                  返回列表
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(selectedArticle.id)}
                    className={`rounded-full ${
                      selectedArticle.isFavorite ? 'bg-pink-50 text-pink-700 border-pink-200' : ''
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill={selectedArticle.isFavorite ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-5 h-5 mr-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    {selectedArticle.isFavorite ? '取消收藏' : '收藏'}
                  </Button>
                  <Button 
                    onClick={() => {
                      markAsCompleted(selectedArticle.id);
                      setShowArticleModal(false);
                    }}
                    className="bg-indigo-800 hover:bg-indigo-700 text-white rounded-full"
                  >
                    {selectedArticle.isCompleted ? '已完成阅读' : '标记为已读'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* 帮助对话框 */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">阅读练习帮助</DialogTitle>
            <DialogDescription className="text-gray-600">
              如何使用阅读练习功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">基本功能</h3>
              <p>您可以浏览和阅读各种日语文章，每篇文章都配有假名标注和中文翻译。</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">如何使用</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>点击"阅读"按钮打开文章</li>
                <li>使用"假名标注"和"中文翻译"按钮控制内容显示</li>
                <li>点击"理解练习"参与阅读理解问题</li>
                <li>您可以将重要词汇添加到生词本</li>
                <li>点击收藏按钮将文章加入收藏</li>
                <li>阅读完成后点击"标记为已读"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">学习建议</h3>
              <p>建议先尝试不看翻译阅读，遇到不理解的内容再查看翻译。完成阅读后尝试回答理解问题，检验理解程度。定期复习生词本中的词汇。</p>
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