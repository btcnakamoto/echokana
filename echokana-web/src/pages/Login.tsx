import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import logoImage from "../assets/images/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.login(formData);
      navigate('/dashboard');
    } catch (error) {
      // 错误已经在 store 中处理
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        {/* 导航栏 */}
        <header className="flex justify-between items-center" style={{ paddingLeft: "14%", paddingRight: "14%", paddingTop: "6vh", paddingBottom: "6vh" }}>
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Echokana Logo" className="h-12 w-auto" />
            <div className="font-bold text-xl text-gray-900">Echokana</div>
          </div>
        </header>
        
        <div className="flex items-center justify-center" style={{ paddingLeft: "14%", paddingRight: "14%" }}>
          <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-center">
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                欢迎回来
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                还没有账号？{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  立即注册
                </Link>
              </p>
            </div>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    电子邮箱
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {auth.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{auth.error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={auth.loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {auth.loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {auth.loading ? '登录中...' : '登录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 