import express from 'express';
import bodyParser from 'body-parser';
import pinoHttp from 'pino-http';
import { Agent } from '../core/agent';
import { Reasoner } from '../core/reasoner';
import { CozeOrchestrator } from '../workflow/coze-orchestrator';
import { LLMGatewayImpl } from '../llm-gateway/llm-gateway';
import { getServerConfig, getPublicPath, getLLMClientConfig } from './config';
import { LLMClientFactory } from './llm-client-factory';
import { createRoutes } from './routes';

// 导入认证路由
import authRoutes from './auth/auth-routes';

// 初始化应用
const app = express();
app.use(bodyParser.json());
app.use(pinoHttp({
  // 配置日志格式和级别
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
}));

// 静态文件服务
app.use(express.static(getPublicPath()));

// 注册认证路由
app.use('/api/auth', authRoutes);

// 获取服务器配置
const serverConfig = getServerConfig();

// 创建LLM客户端
const { client: llmClient, type: clientType } = LLMClientFactory.createClient();
console.log(`Using ${clientType.charAt(0).toUpperCase() + clientType.slice(1)}Client`);

// 初始化LLM网关
const llmGateway = new LLMGatewayImpl(llmClient, {
  tokensPerSecond: serverConfig.llmTokensPerSecond,
  maxBurstTokens: serverConfig.llmMaxBurstTokens,
});
console.log('LLM Gateway initialized with rate limiting');

// 创建推理器
const reasoner = new Reasoner(llmGateway);

// 初始化Coze Studio服务编排器
let cozeOrchestrator: CozeOrchestrator | undefined;
const cozeConfig = getLLMClientConfig('coze');
if (cozeConfig.apiKey) {
  cozeOrchestrator = new CozeOrchestrator(
    cozeConfig.apiKey,
    cozeConfig.baseUrl,
    cozeConfig.defaultWorkflow
  );
  console.log('Coze Studio服务编排器已初始化');
}

// 创建代理
const agent = new Agent(reasoner, 6, cozeOrchestrator);

// 注册路由
app.use('/', createRoutes(agent, llmGateway));

// 启动服务器
app.listen(serverConfig.port, () => {
  console.log(`Server listening on http://localhost:${serverConfig.port}`);
});