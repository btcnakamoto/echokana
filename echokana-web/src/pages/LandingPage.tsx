import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import girlImage from "../assets/images/topgirl_tou.png";
import logoImage from "../assets/images/logo.svg";

export default function LandingPage() {
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
      
      {/* 右侧圆圈装饰已移除 */}
      
      {/* 右侧圆形区域装饰 */}
      <div className="absolute z-10" style={{ 
        top: '6vh',
        right: '-108px',  
        width: '216px', 
        height: '216px', 
        background: '#ffccc3',
        borderRadius: '50%'
      }}></div>
      
      {/* 左侧圆形区域装饰 */}
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
            {/* 日语汉字气泡已移除 */}
            
            {/* 涂鸦背景元素已移除 */}
            
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
                {/* 左侧书本 */}
                <path fill="#f9d6d3" d="M12 16h20v30H12a2 2 0 01-2-2V18a2 2 0 012-2z" />
                <rect x="12" y="16" width="20" height="30" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M12 16h20M12 46h20" />
                
                {/* 右侧书本 */}
                <path fill="#ffaea3" d="M32 16h20a2 2 0 012 2v26a2 2 0 01-2 2H32V16z" />
                <rect x="32" y="16" width="20" height="30" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M32 16h20M32 46h20" />
                
                {/* 书籍装订线 */}
                <path stroke="currentColor" strokeWidth="2" d="M32 16v30" />
                
                {/* 书脊阴影 */}
                <path fill="#e0c0c0" opacity="0.3" d="M30 16h4v30h-4z" />
                
                {/* 日本字样 - 左边"日" */}
                <path fill="currentColor" d="M20 24h4v2h-4v4h-2v-4h-4v-2h4v-4h2v4z" />
                
                {/* 日本字样 - 右边"本" */}
                <path fill="currentColor" d="M42 22h-4v-2h10v2h-4v10h-2v-10z" />
                <path fill="currentColor" d="M40 26h6v2h-6z" />
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
                <circle cx="32" cy="32" r="20" fill="#f9d6d3" />
                <path d="M20 32h-4a2 2 0 00-2 2v8a2 2 0 002 2h4a2 2 0 002-2v-8a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M48 32h-4a2 2 0 00-2 2v8a2 2 0 002 2h4a2 2 0 002-2v-8a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 34v-6a16 16 0 1132 0v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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