import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Echokana
              </h1>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                功能特点
              </Link>
              <Link to="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                关于我们
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link to="/register">
                <Button>注册</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="px-3 py-1">
                  <span className="text-sm font-medium">全新体验</span>
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  高效实用的日语学习平台
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl">
                  使用 Echokana，通过科学的间隔重复系统提高您的日语词汇量和听力水平，让学习变得更加轻松有效。
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                    开始免费使用
                  </Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline">
                    了解更多
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-indigo-400/20 to-purple-400/20 object-cover shadow-xl flex items-center justify-center">
              <img 
                src="https://placehold.co/700x400/e2e8f0/475569?text=Echokana+Demo" 
                alt="Echokana应用演示"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 特点部分 */}
      <section id="features" className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-center mb-4">为什么选择 Echokana</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              我们提供多种功能，帮助您高效学习日语
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 特点卡片1 */}
            <div className="flex flex-col p-6 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">高效听写练习</h3>
              <p className="text-muted-foreground mb-4">通过听写练习提高您的听力理解能力和书写技能，加深对日语发音的认识。</p>
            </div>
            
            {/* 特点卡片2 */}
            <div className="flex flex-col p-6 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">情境阅读学习</h3>
              <p className="text-muted-foreground mb-4">通过阅读真实文章，在上下文中学习词汇和语法，提高阅读理解能力。</p>
            </div>
            
            {/* 特点卡片3 */}
            <div className="flex flex-col p-6 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">科学间隔重复</h3>
              <p className="text-muted-foreground mb-4">使用基于科学研究的间隔重复系统(SRS)，优化复习计划，最大化记忆保留率。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 用户见证部分 */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-10">用户反馈</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 见证卡片1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  LM
                </div>
                <div>
                  <h4 className="font-bold">李明</h4>
                  <p className="text-sm text-muted-foreground">日语学习者 · 3个月</p>
                </div>
              </div>
              <p className="text-muted-foreground">"Echokana的听写练习帮助我极大地提高了听力能力，现在听日语对话不再感到吃力。"</p>
            </div>
            
            {/* 见证卡片2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  ZW
                </div>
                <div>
                  <h4 className="font-bold">张薇</h4>
                  <p className="text-sm text-muted-foreground">日语爱好者 · 6个月</p>
                </div>
              </div>
              <p className="text-muted-foreground">"间隔重复系统太神奇了，我能明显感觉到自己的词汇量在稳步增长，而且记忆更加牢固。"</p>
            </div>
            
            {/* 见证卡片3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  WJ
                </div>
                <div>
                  <h4 className="font-bold">王杰</h4>
                  <p className="text-sm text-muted-foreground">JLPT备考生 · 1年</p>
                </div>
              </div>
              <p className="text-muted-foreground">"得益于Echokana的系统性学习路径，我顺利通过了N3考试，现在正在为N2努力。"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 行动召唤部分 */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">准备好开始您的日语学习之旅了吗？</h2>
            <p className="text-xl text-muted-foreground mb-8">
              加入数千名学习者的行列，体验Echokana带来的高效学习方式。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                  免费注册
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  登录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-10 bg-slate-50 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold mb-4">Echokana</h3>
              <p className="text-sm text-muted-foreground">
                高效实用的日语学习平台，帮助您轻松掌握日语。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">功能</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:underline">听写练习</Link></li>
                <li><Link to="#" className="hover:underline">阅读学习</Link></li>
                <li><Link to="#" className="hover:underline">词汇复习</Link></li>
                <li><Link to="#" className="hover:underline">学习路径</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">资源</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:underline">学习指南</Link></li>
                <li><Link to="#" className="hover:underline">常见问题</Link></li>
                <li><Link to="#" className="hover:underline">使用条款</Link></li>
                <li><Link to="#" className="hover:underline">隐私政策</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">联系我们</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contact@echokana.com</li>
                <li>中国·上海</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2023 Echokana. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 