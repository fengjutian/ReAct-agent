import { PrismaClient } from '../generated/prisma';
import { config } from 'dotenv';

// 加载环境变量
config();

// 单例模式管理PrismaClient实例
class PrismaConnection {
  private static instance: PrismaClient;

  private constructor() {}

  public static getClient(): PrismaClient {
    if (!PrismaConnection.instance) {
      // 在Prisma v7中，直接在PrismaClient构造函数中配置连接
      PrismaConnection.instance = new PrismaClient({
        // 启用日志记录
        log: ['query', 'info', 'warn', 'error']
      });
    }

    return PrismaConnection.instance;
  }

  // 关闭数据库连接
  public static async closeConnection(): Promise<void> {
    if (PrismaConnection.instance) {
      await PrismaConnection.instance.$disconnect();
      PrismaConnection.instance = undefined as any;
    }
  }

  // 测试数据库连接
  public static async testConnection(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

// 导出Prisma客户端实例
export const prisma = PrismaConnection.getClient();

export default PrismaConnection;
