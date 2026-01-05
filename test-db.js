// 测试数据库连接和表结构
const { PrismaClient } = require('./src/generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

async function testDatabase() {
  try {
    // 创建Prisma适配器
    const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });

    // 创建Prisma客户端
    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      adapter,
    });

    // 测试连接
    await prisma.$connect();
    console.log('数据库连接成功');

    // 检查是否可以创建用户
    console.log('尝试创建用户...');
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
      },
    });
    console.log('用户创建成功:', user);

    // 删除测试用户
    await prisma.user.delete({ where: { id: user.id } });
    console.log('测试用户已删除');

    // 断开连接
    await prisma.$disconnect();
    console.log('数据库连接已断开');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testDatabase();
