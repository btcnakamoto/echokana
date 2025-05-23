import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import logoSvg from "../assets/images/logo.svg";

export default function HomePage() {
  const auth = useAuthStore();
  const user = auth.user;
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.logout();
      navigate('/');
    } catch (error) {
      console.error('登出失败', error);
    }
  };

  // 模拟学习数据
  const learningData = {
    streak: 5,
    vocabulary: 120,
    todayReview: 25,
    level: "初级",
    totalTime: 32,
    completedLessons: 18
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
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between" style={{ paddingLeft: "14%", paddingRight: "14%" }}>
            <div className="flex items-center gap-3">
              <img src={logoSvg} alt="Echokana Logo" className="h-12 w-auto" />
              <div className="font-bold text-xl text-gray-900">Echokana</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative" 
                title="通知"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                <Badge variant="success" className="absolute top-0 right-0 h-2 w-2 p-0" />
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="bg-indigo-800 text-white">
                  {user?.name?.charAt(0) || 'E'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex items-center text-sm">
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                登出
              </Button>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <div className="py-8" style={{ paddingLeft: "14%", paddingRight: "14%" }}>
          {/* 欢迎横幅 */}
          <div className={`mb-8 transition-all duration-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Card className="border-none shadow-lg rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl mb-2">
                      欢迎回来，{user?.name || '同学'}
                    </CardTitle>
                    <div className="text-base text-muted-foreground">
                      今天是您连续学习的第 <Badge className="mx-1 bg-indigo-800">{learningData.streak}</Badge> 天
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="rounded-full bg-indigo-800 hover:bg-indigo-900">开始今日学习</Button>
                      <Button variant="outline" className="rounded-full border border-gray-300">查看学习计划</Button>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-end">
                    <div className="aspect-square w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                      <span className="text-4xl font-bold text-indigo-800">
                        {learningData.streak}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 选项卡区域 */}
          <div className={`transition-all duration-700 delay-200 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-100 p-1 rounded-full">
                <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-900">学习概览</TabsTrigger>
                <TabsTrigger value="activities" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-900">学习活动</TabsTrigger>
                <TabsTrigger value="progress" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-gray-900">学习进度</TabsTrigger>
              </TabsList>
              
              {/* 概览面板 */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* 词汇量卡片 */}
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        掌握词汇
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{learningData.vocabulary}</div>
                      <p className="text-xs text-muted-foreground">
                        +8 比上周
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* 今日复习卡片 */}
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        今日复习
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{learningData.todayReview}</div>
                      <p className="text-xs text-muted-foreground">
                        已完成 15/25
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* 等级卡片 */}
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        当前等级
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{learningData.level}</div>
                      <p className="text-xs text-muted-foreground">
                        N5 水平
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* 学习时间卡片 */}
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        学习时长
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{learningData.totalTime}小时</div>
                      <p className="text-xs text-muted-foreground">
                        本周 +2.5 小时
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 学习功能区 */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {/* 听写练习卡片 */}
                  <Card 
                    className="rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                    onClick={() => navigate('/immersive-dictation')}
                  >
                    <CardHeader className="pb-2">
                      <div className="bg-indigo-800 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg>
                      </div>
                      <CardTitle>听写练习</CardTitle>
                      <CardDescription>提升听力和书写能力</CardDescription>
                    </CardHeader>
                    <CardFooter className="pb-4">
                      <div className="text-indigo-800 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        开始练习
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* 阅读练习卡片 */}
                  <Card 
                    className="rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                    onClick={() => navigate('/reading')}
                  >
                    <CardHeader className="pb-2">
                      <div className="bg-indigo-800 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <CardTitle>阅读练习</CardTitle>
                      <CardDescription>浏览文章扩展词汇量</CardDescription>
                    </CardHeader>
                    <CardFooter className="pb-4">
                      <div className="text-indigo-800 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        开始阅读
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* 词汇复习卡片 */}
                  <Card 
                    className="rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                    onClick={() => {/* 未来可以添加导航到词汇复习页面的函数 */}}
                  >
                    <CardHeader className="pb-2">
                      <div className="bg-indigo-800 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <CardTitle>词汇复习</CardTitle>
                      <CardDescription>使用SRS高效记忆</CardDescription>
                    </CardHeader>
                    <CardFooter className="pb-4">
                      <div className="text-indigo-800 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        开始复习
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* 长句听力练习卡片 */}
                  <Card 
                    className="rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                    onClick={() => navigate('/listening')}
                  >
                    <CardHeader className="pb-2">
                      <div className="bg-indigo-800 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                      </div>
                      <CardTitle>长句听力练习</CardTitle>
                      <CardDescription>提高长句听力理解能力</CardDescription>
                    </CardHeader>
                    <CardFooter className="pb-4">
                      <div className="text-indigo-800 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        开始练习
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              {/* 活动面板 */}
              <TabsContent value="activities" className="mt-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle>最近学习活动</CardTitle>
                    <CardDescription>查看您最近的学习记录和活动</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 活动列表 */}
                    <div className="flex items-start space-x-4">
                      <div className="min-w-8 min-h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">完成了阅读练习：《日本の四季》</p>
                        <p className="text-sm text-muted-foreground mt-1">今天 09:45</p>
                      </div>
                    </div>
                    <Separator />
                    
                    <div className="flex items-start space-x-4">
                      <div className="min-w-8 min-h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">复习了15个词汇</p>
                        <p className="text-sm text-muted-foreground mt-1">昨天 18:30</p>
                      </div>
                    </div>
                    <Separator />
                    
                    <div className="flex items-start space-x-4">
                      <div className="min-w-8 min-h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">完成了听写练习：基础假名50音</p>
                        <p className="text-sm text-muted-foreground mt-1">昨天 16:20</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full rounded-full">查看全部活动</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* 进度面板 */}
              <TabsContent value="progress" className="mt-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle>学习进度</CardTitle>
                    <CardDescription>您的学习路径进度</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              初级日语(N5)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              基础学习阶段
                            </p>
                          </div>
                          <div>
                            <Badge variant="outline" className="rounded-full">进行中</Badge>
                          </div>
                        </div>
                        <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-indigo-800" style={{ width: '65%' }}></div>
                        </div>
                        <div className="mt-2 text-right text-xs text-muted-foreground">
                          65% 完成
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              初中级日语(N4)
                            </p>
                            <p className="text-sm text-muted-foreground">
                              进阶学习阶段
                            </p>
                          </div>
                          <div>
                            <Badge variant="outline" className="rounded-full">未开始</Badge>
                          </div>
                        </div>
                        <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-indigo-800" style={{ width: '0%' }}></div>
                        </div>
                        <div className="mt-2 text-right text-xs text-muted-foreground">
                          0% 完成
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full rounded-full">查看详细进度</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 