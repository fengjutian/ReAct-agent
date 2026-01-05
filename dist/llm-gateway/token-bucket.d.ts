/**
 * 令牌桶限流算法实现
 */
export declare class TokenBucket {
    private capacity;
    private tokens;
    private refillRate;
    private lastRefillTime;
    /**
     * 创建令牌桶实例
     * @param capacity 桶容量
     * @param refillRate 每秒补充的令牌数量
     */
    constructor(capacity: number, refillRate: number);
    /**
     * 尝试获取令牌
     * @param count 需要的令牌数量
     * @returns 是否成功获取令牌
     */
    tryAcquire(count: number): boolean;
    /**
     * 补充令牌
     */
    private refill;
    /**
     * 获取当前令牌数量
     * @returns 当前令牌数量
     */
    getTokens(): number;
    /**
     * 更新令牌桶配置
     * @param capacity 新的桶容量
     * @param refillRate 新的补充速率
     */
    updateConfig(capacity: number, refillRate: number): void;
}
