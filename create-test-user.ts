import { prisma } from './src/db';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    // 生成密码哈希
    const hashedPassword = await bcrypt.hash('test123', 10);

    // 创建测试用户
    const user = await prisma.user.create({
      data: {
        username: 'test',
        password: hashedPassword,
        email: 'test@example.com',
      },
    });

    console.log('测试用户创建成功:', user);
  } catch (error) {
    console.error('创建测试用户失败:', error);
  } finally {
    // 断开数据库连接
    await prisma.$disconnect();
  }
}

// 执行函数
createTestUser();
