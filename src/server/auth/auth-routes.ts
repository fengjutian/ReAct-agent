import express from 'express';
import { authService } from './auth-service';
import { LoginRequest, RegisterRequest } from './types';

// 创建认证路由实例
const router = express.Router();

/**
 * 用户登录接口
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const loginData: LoginRequest = req.body;
    const result = await authService.login(loginData);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      message: error instanceof Error ? error.message : '登录失败',
    });
  }
});

/**
 * 用户注册接口
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const registerData: RegisterRequest = req.body;
    const result = await authService.register(registerData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      message: error instanceof Error ? error.message : '注册失败',
    });
  }
});

// 导出认证路由
export default router;
