import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuthStore();
  const location = useLocation();

  // 开发环境下临时跳过认证检查，方便测试
  // 注意：生产环境应移除此代码
  // 判断是否为开发环境
  const isDev = import.meta.env.MODE === 'development';
  
  if (!auth.token && !isDev) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 