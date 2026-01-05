/**
 * LLM网关接口定义
 */
import { LLMClient } from '../core/types';

/**
 * LLM请求配置
 */
export interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  userId?: string; // 用于限流的用户标识
}

/**
 * Token统计信息
 */
export interface TokenStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timestamp: number;
  model: string;
  userId?: string;
}

/**
 * 限流配置
 */
export interface RateLimitConfig {
  tokensPerSecond: number; // 每秒允许的token数量
  maxBurstTokens: number; // 最大突发token数量
}

/**
 * LLM网关接口
 */
export interface LLMGateway extends LLMClient {
  /**
   * 获取token统计信息
   * @param userId 可选的用户ID，用于过滤统计信息
   * @returns Token统计列表
   */
  getTokenStats(userId?: string): TokenStats[];
  
  /**
   * 重置token统计
   * @param userId 可选的用户ID，用于重置特定用户的统计
   */
  resetTokenStats(userId?: string): void;
  
  /**
   * 更新限流配置
   * @param config 新的限流配置
   */
  updateRateLimitConfig(config: RateLimitConfig): void;
}
