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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <div className="hidden md:flex items-center space-x-4">
              <img src={logoSvg} alt="Echokana Logo" className="h-16 w-auto" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Echokana
              </h1>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* 占位，可放搜索栏等 */}
                      </div>
            <nav className="flex items-center space-x-2">
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
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {user?.name?.charAt(0) || 'E'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex items-center text-sm">
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
                登出
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="container py-8 md:py-10">
        {/* 欢迎横幅 */}
        <div className={`mb-8 transition-all duration-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Card className="relative overflow-hidden border-none shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <CardTitle className="text-2xl md:text-3xl mb-2">
                    欢迎回来，{user?.name || '同学'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    今天是您连续学习的第 <Badge variant="success" className="mx-1">{learningData.streak}</Badge> 天
                  </CardDescription>
                  <div className="mt-4 flex gap-2">
                    <Button>开始今日学习</Button>
                    <Button variant="outline">查看学习计划</Button>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-end">
                  <div className="aspect-square w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400/25 to-purple-400/25 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
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
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview">学习概览</TabsTrigger>
              <TabsTrigger value="activities">学习活动</TabsTrigger>
              <TabsTrigger value="progress">学习进度</TabsTrigger>
            </TabsList>
            
            {/* 概览面板 */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 词汇量卡片 */}
                <Card>
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
                <Card>
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
                <Card>
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
                <Card>
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
                  className="overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                  onClick={() => navigate('/immersive-dictation')}
                >
                  <CardHeader className="pb-2">
                    <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
                    <CardTitle>听写练习</CardTitle>
                    <CardDescription>提升听力和书写能力</CardDescription>
                  </CardHeader>
                  <CardFooter className="pb-4">
                    <div className="text-indigo-600 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      开始练习
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </CardFooter>
                </Card>

                {/* 阅读练习卡片 */}
                <Card 
                  className="overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                  onClick={() => {/* 未来可以添加导航到阅读页面的函数 */}}
                >
                  <CardHeader className="pb-2">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <CardTitle>阅读练习</CardTitle>
                    <CardDescription>浏览文章扩展词汇量</CardDescription>
                  </CardHeader>
                  <CardFooter className="pb-4">
                    <div className="text-purple-600 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      开始阅读
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </CardFooter>
                </Card>

                {/* 词汇复习卡片 */}
                <Card 
                  className="overflow-hidden transition-transform hover:scale-[1.02] duration-300 cursor-pointer group"
                  onClick={() => {/* 未来可以添加导航到词汇复习页面的函数 */}}
                >
                  <CardHeader className="pb-2">
                    <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <CardTitle>词汇复习</CardTitle>
                    <CardDescription>使用SRS高效记忆</CardDescription>
                  </CardHeader>
                  <CardFooter className="pb-4">
                    <div className="text-pink-600 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      开始复习
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
              <Card>
                <CardHeader>
                  <CardTitle>最近学习活动</CardTitle>
                  <CardDescription>查看您最近的学习记录和活动</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 活动列表 */}
                  <div className="flex items-start space-x-4">
                    <div className="min-w-8 min-h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
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
                    <div className="min-w-8 min-h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
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
                    <div className="min-w-8 min-h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
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
                  <Button variant="outline" className="w-full">查看全部活动</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* 进度面板 */}
            <TabsContent value="progress" className="mt-6">
              <Card>
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
                          <Badge variant="outline">进行中</Badge>
            </div>
          </div>
                      <div className="mt-4 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: '65%' }}></div>
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
                          <Badge variant="outline">未开始</Badge>
                        </div>
                      </div>
                      <div className="mt-4 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: '0%' }}></div>
                      </div>
                      <div className="mt-2 text-right text-xs text-muted-foreground">
                        0% 完成
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">查看详细进度</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 