import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config();

export interface ServerConfig {
  port: number;
  llmTokensPerSecond: number;
  llmMaxBurstTokens: number;
}

export interface LLMClientConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultWorkflow?: string;
}

export const getServerConfig = (): ServerConfig => ({
  port: parseInt(process.env.PORT || '3001', 10),
  llmTokensPerSecond: parseInt(process.env.LLM_TOKENS_PER_SECOND || '1000', 10),
  llmMaxBurstTokens: parseInt(process.env.LLM_MAX_BURST_TOKENS || '5000', 10),
});

export const getLLMClientConfig = (clientType: string): LLMClientConfig => {
  const config: LLMClientConfig = {};

  switch (clientType) {
    case 'kimi':
      config.apiKey = process.env.KIMI_API_KEY;
      break;
    case 'openai':
      config.apiKey = process.env.OPENAI_API_KEY;
      break;
    case 'qwen':
      config.apiKey = process.env.QWEN_API_KEY;
      break;
    case 'deepseek':
      config.apiKey = process.env.DEEPSEEK_API_KEY;
      break;
    case 'ollama':
      config.baseUrl = process.env.OLLAMA_BASE_URL;
      config.defaultModel = process.env.OLLAMA_DEFAULT_MODEL;
      break;
    default:
      break;
  }

  return config;
};

export const getPublicPath = (): string => {
  return path.join(__dirname, '../../public');
};
