import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import girlImage from "../assets/images/topgirl_tou.png";
import logoImage from "../assets/images/logo.svg";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      {/* 曲线背景区域 */}
      <div 
        className="absolute top-0 right-0 bg-[#f3f4ff] w-[60%] h-[92%] z-0"
        style={{
          borderBottomLeftRadius: '85% 80%',
          transform: 'translateX(3%)'
        }}
      ></div>
      
      {/* 右侧圆圈装饰 */}
      <div className="absolute top-20 right-20 w-44 h-44 bg-pink-200 rounded-full opacity-20 z-0"></div>
      
      <div className="relative z-10 h-full">
        {/* 导航栏 */}
        <header className="flex justify-between items-center" style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "6vh", paddingBottom: "6vh" }}>
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Echokana Logo" className="h-12 w-auto" />
            <div className="font-bold text-xl text-gray-900">Echokana</div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                课程
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link to="#why-us" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              为什么选择我们
            </Link>
            <Link to="#support" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              支持
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 px-4">
                开始学习
              </Button>
            </Link>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </header>
        
        {/* 主要内容区域 */}
        <div className="grid md:grid-cols-2 items-center" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          {/* 左侧文本区域 */}
          <div className="py-8 md:py-12 text-left">
            <div className="text-left mb-4">
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 inline-block mb-2">学习</span>
              <br/>
              <span className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 inline-block">日语</span>
            </div>
            <p className="text-gray-600 mb-8 max-w-md text-sm leading-relaxed">
              无论是参观京都的寺庙，获得一份新工作，还是建立个人联系 —— 不管你为什么想学习日语，我们都有适合你的课程。
            </p>
            <Link to="/register">
              <Button className="rounded-full bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-2">
                开始学习
              </Button>
            </Link>
          </div>
          
          {/* 右侧图像区域 */}
          <div className="relative flex justify-center">
            {/* 日语汉字气泡 - 仅保留气泡 */}
            <div className="absolute top-10 left-1/4 bg-pink-200 rounded-full w-16 h-16 flex items-center justify-center z-10">
            </div>
            
            {/* 涂鸦背景元素 */}
            <div className="absolute top-1/4 right-1/4 text-pink-200/30 z-0">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 10C60 40 100 60 110 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M60 20C60 40 90 60 110 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M60 30C60 45 80 60 110 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            
            {/* 主要插图 */}
            <div className="relative z-10">
              <img 
                src={girlImage} 
                alt="女孩学习日语" 
                className="max-w-sm md:max-w-md h-auto"
              />
            </div>
          </div>
        </div>
        
        {/* 底部特性图标 */}
        <div className="py-6 grid grid-cols-3 gap-4 border-t border-gray-200" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <svg className="w-12 h-12 text-gray-800" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" x="6" y="18" fill="#f9d6d3" rx="2" />
                <rect width="28" height="28" x="30" y="18" fill="#f9d6d3" rx="2" />
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 20v24M44 20v24M8 32h24M32 32h24" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">详细课程</h3>
              <p className="text-xs text-gray-500">包含丰富的词汇和文化知识</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <svg className="w-12 h-12 text-gray-800" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#f9d6d3" d="M12 24a20 20 0 0140 0v16a20 20 0 01-40 0V24z" />
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M18 24s0-12 14-12 14 12 14 12" />
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M46 24v16a14 14 0 01-14 14m-14-14v-16a14 14 0 0114-14" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">生动的音频</h3>
              <p className="text-xs text-gray-500">由母语者录制</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              <svg className="w-12 h-12 text-gray-800" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="20" fill="#f9d6d3" />
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M32 18v14l8 8" />
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 32h8m24 0h8M32 12v8m0 24v8" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">灵活的订阅选项</h3>
              <p className="text-xs text-gray-500">满足您的不同需求</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 