import { prisma } from '../../db';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  JwtPayload,
} from './types';
import { generateToken } from './token-utils';
import bcrypt from 'bcryptjs';

/**
 * 用户认证服务类
 */
export class AuthService {
  /**
   * 用户登录
   * @param loginData 登录请求数据
   * @returns 认证响应（包含token和用户信息）
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    const { username, password } = loginData;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成JWT token
    const jwtPayload: Omit<JwtPayload, 'exp' | 'iat'> = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = generateToken(jwtPayload);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * 用户注册
   * @param registerData 注册请求数据
   * @returns 认证响应（包含token和用户信息）
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    const { username, password, email } = registerData;

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new Error('邮箱已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    // 生成JWT token
    const jwtPayload: Omit<JwtPayload, 'exp' | 'iat'> = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    const token = generateToken(jwtPayload);

    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    };
  }

  /**
   * 根据用户ID获取用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        userPermissions: {
          select: {
            permission: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  }
}

// 导出认证服务实例
export const authService = new AuthService();
