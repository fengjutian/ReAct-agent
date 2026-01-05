/**
 * LLM网关核心实现，包含token统计和限流功能
 */
import { LLMClient } from '../core/types';
import { LLMGateway, TokenStats, LLMRequestOptions, RateLimitConfig } from './types';
/**
 * LLM网关实现类
 */
export declare class LLMGatewayImpl implements LLMGateway {
    private llmClient;
    private tokenBucket;
    private tokenStats;
    private rateLimitConfig;
    /**
     * 创建LLM网关实例
     * @param llmClient 实际的LLM客户端
     * @param rateLimitConfig 限流配置
     */
    constructor(llmClient: LLMClient, rateLimitConfig?: RateLimitConfig);
    /**
     * 调用LLM并进行token统计和限流
     * @param prompt 提示词
     * @param opts 请求选项
     * @returns LLM响应
     */
    call(prompt: string, opts?: LLMRequestOptions): Promise<string>;
    /**
     * 计算文本的token数量
     * @param text 要计算的文本
     * @param model 使用的模型
     * @returns token数量
     */
    private countTokens;
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
/**
 * 创建LLM网关实例的工厂函数
 * @param llmClient 实际的LLM客户端
 * @param rateLimitConfig 限流配置
 * @returns LLM网关实例
 */
export declare function createLLMGateway(llmClient: LLMClient, rateLimitConfig?: RateLimitConfig): LLMGateway;
