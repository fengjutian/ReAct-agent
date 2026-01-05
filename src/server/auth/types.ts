// 用户认证相关类型定义

/**
 * 用户登录请求
 */
export type LoginRequest = {
  username: string;
  password: string;
};

/**
 * 用户注册请求
 */
export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
};

/**
 * 认证响应
 */
export type AuthResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
  };
};

/**
 * JWT Payload类型
 */
export type JwtPayload = {
  userId: number;
  username: string;
  email: string;
  // 过期时间
  exp?: number;
  // 签发时间
  iat?: number;
};

/**
 * 认证中间件返回的请求扩展
 */
export type AuthRequest = {
  user?: {
    userId: number;
    username: string;
    email: string;
  };
};
