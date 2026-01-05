/**
 * LLM网关核心实现，包含token统计和限流功能
 */
import { LLMClient } from '../core/types';
import {
  LLMGateway,
  TokenStats,
  LLMRequestOptions,
  RateLimitConfig,
} from './types';
import { TokenBucket } from './token-bucket';
import { encoding_for_model } from 'tiktoken';

/**
 * LLM网关实现类
 */
export class LLMGatewayImpl implements LLMGateway {
  private llmClient: LLMClient;
  private tokenBucket: TokenBucket;
  private tokenStats: TokenStats[] = [];
  private rateLimitConfig: RateLimitConfig;

  /**
   * 创建LLM网关实例
   * @param llmClient 实际的LLM客户端
   * @param rateLimitConfig 限流配置
   */
  constructor(
    llmClient: LLMClient,
    rateLimitConfig: RateLimitConfig = {
      tokensPerSecond: 1000, // 默认每秒1000个token
      maxBurstTokens: 5000, // 默认最大突发5000个token
    }
  ) {
    this.llmClient = llmClient;
    this.rateLimitConfig = rateLimitConfig;
    this.tokenBucket = new TokenBucket(
      rateLimitConfig.maxBurstTokens,
      rateLimitConfig.tokensPerSecond
    );
  }

  /**
   * 调用LLM并进行token统计和限流
   * @param prompt 提示词
   * @param opts 请求选项
   * @returns LLM响应
   */
  async call(prompt: string, opts?: LLMRequestOptions): Promise<string> {
    const model = opts?.model || 'gpt-4o-mini';
    const userId = opts?.userId;

    try {
      // 计算prompt的token数量
      const promptTokens = this.countTokens(prompt, model);

      // 检查是否超过限流
      if (!this.tokenBucket.tryAcquire(promptTokens)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // 调用实际的LLM客户端
      const response = await this.llmClient.call(prompt, opts);

      // 计算响应的token数量
      const completionTokens = this.countTokens(response, model);
      const totalTokens = promptTokens + completionTokens;

      // 记录token统计
      const stats: TokenStats = {
        promptTokens,
        completionTokens,
        totalTokens,
        timestamp: Date.now(),
        model,
        userId,
      };
      this.tokenStats.push(stats);

      // 消耗响应的token（如果需要更精确的限流）
      // 注意：这里只消耗了prompt的token，响应的token消耗可选
      // this.tokenBucket.tryAcquire(completionTokens);

      return response;
    } catch (error) {
      console.error('LLM Gateway Error:', error);
      throw error;
    }
  }

  /**
   * 计算文本的token数量
   * @param text 要计算的文本
   * @param model 使用的模型
   * @returns token数量
   */
  private countTokens(text: string, model: string): number {
    try {
      // 使用类型断言处理模型名称
      const encoding = encoding_for_model(model as any);
      const tokens = encoding.encode(text);
      return tokens.length;
    } catch (error) {
      console.warn(
        `Failed to count tokens for model ${model}, using fallback.`,
        error
      );
      // 回退方案：假设每个token平均包含4个字符
      return Math.ceil(text.length / 4);
    }
  }

  /**
   * 获取token统计信息
   * @param userId 可选的用户ID，用于过滤统计信息
   * @returns Token统计列表
   */
  getTokenStats(userId?: string): TokenStats[] {
    if (userId) {
      return this.tokenStats.filter((stats) => stats.userId === userId);
    }
    return [...this.tokenStats];
  }

  /**
   * 重置token统计
   * @param userId 可选的用户ID，用于重置特定用户的统计
   */
  resetTokenStats(userId?: string): void {
    if (userId) {
      this.tokenStats = this.tokenStats.filter(
        (stats) => stats.userId !== userId
      );
    } else {
      this.tokenStats = [];
    }
  }

  /**
   * 更新限流配置
   * @param config 新的限流配置
   */
  updateRateLimitConfig(config: RateLimitConfig): void {
    this.rateLimitConfig = config;
    this.tokenBucket.updateConfig(
      config.maxBurstTokens,
      config.tokensPerSecond
    );
  }
}

/**
 * 创建LLM网关实例的工厂函数
 * @param llmClient 实际的LLM客户端
 * @param rateLimitConfig 限流配置
 * @returns LLM网关实例
 */
export function createLLMGateway(
  llmClient: LLMClient,
  rateLimitConfig?: RateLimitConfig
): LLMGateway {
  return new LLMGatewayImpl(llmClient, rateLimitConfig);
}
