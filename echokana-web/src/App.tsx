import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import DictationPage from './pages/dictation/DictationPage';
import ImmersiveDictationPage from './pages/dictation/ImmersiveDictationPage';
import { SakuraEffect } from './components/common/SakuraEffect';
import './App.css';

// 添加阅读页面导入
import ReadingPage from './pages/reading/ReadingPage';
// 添加听力练习页面导入
import ListeningPage from './pages/listening/ListeningPage';

function App() {
  const auth = useAuthStore();

  useEffect(() => {
    auth.fetchUser();
  }, []);

  return (
    <div className="app-container min-h-screen w-screen overflow-hidden">
      {/* 樱花飘落效果 */}
      <SakuraEffect count={20} />
      
      {/* 纯白色背景 */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-white"></div>
      
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dictation"
            element={
              <ProtectedRoute>
                <DictationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/immersive-dictation"
            element={
              <ProtectedRoute>
                <ImmersiveDictationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reading"
            element={
              <ProtectedRoute>
                <ReadingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listening"
            element={
              <ProtectedRoute>
                <ListeningPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
