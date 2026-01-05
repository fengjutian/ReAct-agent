/**
 * 令牌桶限流算法实现
 */

export class TokenBucket {
  private capacity: number; // 桶容量
  private tokens: number; // 当前令牌数量
  private refillRate: number; // 每秒补充的令牌数量
  private lastRefillTime: number; // 上次补充令牌的时间

  /**
   * 创建令牌桶实例
   * @param capacity 桶容量
   * @param refillRate 每秒补充的令牌数量
   */
  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.tokens = capacity; // 初始时桶是满的
    this.refillRate = refillRate;
    this.lastRefillTime = Date.now();
  }

  /**
   * 尝试获取令牌
   * @param count 需要的令牌数量
   * @returns 是否成功获取令牌
   */
  tryAcquire(count: number): boolean {
    this.refill();

    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }

    return false;
  }

  /**
   * 补充令牌
   */
  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTime) / 1000;

    // 计算需要补充的令牌数量
    const tokensToAdd = elapsedSeconds * this.refillRate;

    // 补充令牌，但不超过桶容量
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  /**
   * 获取当前令牌数量
   * @returns 当前令牌数量
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }

  /**
   * 更新令牌桶配置
   * @param capacity 新的桶容量
   * @param refillRate 新的补充速率
   */
  updateConfig(capacity: number, refillRate: number): void {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.refill(); // 立即补充一次令牌
  }
}
