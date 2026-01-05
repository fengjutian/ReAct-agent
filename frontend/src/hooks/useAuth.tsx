import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, AuthResponse, LoginRequest } from '../lib/api';

// 定义认证上下文类型
interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证上下文提供者组件的props类型
interface AuthProviderProps {
  children: ReactNode;
}

// 认证上下文提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 从localStorage加载认证信息
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }

    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (loginData: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(loginData);
      setToken(response.token);
      setUser(response.user);

      // 保存认证信息到localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      // 登录成功后重定向到仪表盘
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    // 清除认证状态
    setToken(null);
    setUser(null);

    // 从localStorage移除认证信息
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // 重定向到登录页面
    navigate('/login', { replace: true });
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// 自定义Hook：使用认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
