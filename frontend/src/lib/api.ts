// API调用工具函数

/**
 * 登录请求参数
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
  };
}

/**
 * API错误响应
 */
export interface ApiErrorResponse {
  message: string;
}

/**
 * 基础API调用函数
 */
async function apiCall<T>(
  url: string,
  method: string = 'GET',
  data?: any,
  headers?: Record<string, string>
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const response = await fetch(`${baseUrl}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(errorData.message || '请求失败');
  }

  return response.json();
}

/**
 * 认证API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('/api/auth/login', 'POST', loginData);
  },

  /**
   * 用户注册
   */
  register: async (registerData: {
    username: string;
    password: string;
    email: string;
  }): Promise<AuthResponse> => {
    return apiCall<AuthResponse>('/api/auth/register', 'POST', registerData);
  },
};