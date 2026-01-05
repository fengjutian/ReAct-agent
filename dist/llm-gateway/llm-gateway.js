"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMGatewayImpl = void 0;
exports.createLLMGateway = createLLMGateway;
const token_bucket_1 = require("./token-bucket");
const tiktoken_1 = require("tiktoken");
/**
 * LLM网关实现类
 */
class LLMGatewayImpl {
    /**
     * 创建LLM网关实例
     * @param llmClient 实际的LLM客户端
     * @param rateLimitConfig 限流配置
     */
    constructor(llmClient, rateLimitConfig = {
        tokensPerSecond: 1000, // 默认每秒1000个token
        maxBurstTokens: 5000, // 默认最大突发5000个token
    }) {
        this.tokenStats = [];
        this.llmClient = llmClient;
        this.rateLimitConfig = rateLimitConfig;
        this.tokenBucket = new token_bucket_1.TokenBucket(rateLimitConfig.maxBurstTokens, rateLimitConfig.tokensPerSecond);
    }
    /**
     * 调用LLM并进行token统计和限流
     * @param prompt 提示词
     * @param opts 请求选项
     * @returns LLM响应
     */
    async call(prompt, opts) {
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
            const stats = {
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
        }
        catch (error) {
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
    countTokens(text, model) {
        try {
            // 使用类型断言处理模型名称
            const encoding = (0, tiktoken_1.encoding_for_model)(model);
            const tokens = encoding.encode(text);
            return tokens.length;
        }
        catch (error) {
            console.warn(`Failed to count tokens for model ${model}, using fallback.`, error);
            // 回退方案：假设每个token平均包含4个字符
            return Math.ceil(text.length / 4);
        }
    }
    /**
     * 获取token统计信息
     * @param userId 可选的用户ID，用于过滤统计信息
     * @returns Token统计列表
     */
    getTokenStats(userId) {
        if (userId) {
            return this.tokenStats.filter(stats => stats.userId === userId);
        }
        return [...this.tokenStats];
    }
    /**
     * 重置token统计
     * @param userId 可选的用户ID，用于重置特定用户的统计
     */
    resetTokenStats(userId) {
        if (userId) {
            this.tokenStats = this.tokenStats.filter(stats => stats.userId !== userId);
        }
        else {
            this.tokenStats = [];
        }
    }
    /**
     * 更新限流配置
     * @param config 新的限流配置
     */
    updateRateLimitConfig(config) {
        this.rateLimitConfig = config;
        this.tokenBucket.updateConfig(config.maxBurstTokens, config.tokensPerSecond);
    }
}
exports.LLMGatewayImpl = LLMGatewayImpl;
/**
 * 创建LLM网关实例的工厂函数
 * @param llmClient 实际的LLM客户端
 * @param rateLimitConfig 限流配置
 * @returns LLM网关实例
 */
function createLLMGateway(llmClient, rateLimitConfig) {
    return new LLMGatewayImpl(llmClient, rateLimitConfig);
}
