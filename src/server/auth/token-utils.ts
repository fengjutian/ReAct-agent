import jwt from 'jsonwebtoken';
import { JwtPayload } from './types';

// JWT密钥，从环境变量获取或使用默认值
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 默认7天过期

/**
 * 生成JWT token
 * @param payload JWT负载数据
 * @returns 生成的token字符串
 */
export const generateToken = (
  payload: Omit<JwtPayload, 'exp' | 'iat'>
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * 验证JWT token
 * @param token 要验证的token字符串
 * @returns 验证成功返回解码后的payload，失败返回null
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
