import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Agent } from 'core/agent';
import { Reasoner } from 'core/reasoner';
import { MockLLMClient } from 'llm/mock-client';
import { OpenAIClient } from 'llm/openai-client';
import { KimiClient } from 'llm/kimi-client';
import { OllamaClient } from 'llm/ollama-client';
import { QwenClient } from 'llm/qwen-client';
import { DeepSeekClient } from 'llm/deepseek-client';
import { CozeClient } from 'llm/coze-client';
import { CozeOrchestrator } from 'workflow/coze-orchestrator';
import path from 'path';
import pinoHttp from 'pino-http';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(pinoHttp());

// 添加静态文件支持，用于提供Coze Studio编排页面
app.use(express.static(path.join(__dirname, '../../public')));

// 端口优先使用环境变量 `PORT`，否则默认 3001
const port = process.env.PORT || 3001;

let llmClient: any;
if (process.env.KIMI_API_KEY) {
  llmClient = new KimiClient(process.env.KIMI_API_KEY);
  console.log('Using KimiClient (Moonshot)');
} else if (process.env.OPENAI_API_KEY) {
  llmClient = new OpenAIClient(process.env.OPENAI_API_KEY);
  console.log('Using OpenAIClient (real LLM)');
} else if (process.env.QWEN_API_KEY) {
  llmClient = new QwenClient(process.env.QWEN_API_KEY);
  console.log('Using QwenClient (Alibaba Cloud)');
} else if (process.env.DEEPSEEK_API_KEY) {
  llmClient = new DeepSeekClient(process.env.DEEPSEEK_API_KEY);
  console.log('Using DeepSeekClient (DeepSeek Inc.)');
} else if (process.env.COZE_API_KEY) {
  llmClient = new CozeClient(
    process.env.COZE_API_KEY,
    process.env.COZE_BASE_URL,
    process.env.COZE_DEFAULT_WORKFLOW
  );
  console.log(
    `Using CozeClient (Coze Studio) with workflow: ${process.env.COZE_DEFAULT_WORKFLOW || 'default'}`
  );
} else if (process.env.USE_OLLAMA === 'true') {
  llmClient = new OllamaClient({
    baseURL: process.env.OLLAMA_BASE_URL,
    defaultModel: process.env.OLLAMA_DEFAULT_MODEL,
  });
  console.log(
    `Using OllamaClient with model: ${process.env.OLLAMA_DEFAULT_MODEL || 'llama3'}`
  );
} else {
  llmClient = new MockLLMClient();
  console.log('Using MockLLMClient (mock LLM)');
}

// 创建推理器实例
const reasoner = new Reasoner(llmClient);

// 创建Coze Studio服务编排器实例（如果配置了相关环境变量）
let cozeOrchestrator: CozeOrchestrator | undefined;
if (process.env.COZE_API_KEY) {
  cozeOrchestrator = new CozeOrchestrator(
    process.env.COZE_API_KEY,
    process.env.COZE_BASE_URL,
    process.env.COZE_DEFAULT_WORKFLOW
  );
  console.log('Coze Studio服务编排器已初始化');
}

// 组装推理器与代理；第二参数为最大思考步数，第三参数为Coze Studio服务编排器
const agent = new Agent(reasoner, 6, cozeOrchestrator);

app.get('/', (req, res) => {
  req.log.info('收到欢迎页面请求');
  res.send(
    '欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。或访问 /coze-orchestration.html 使用Coze Studio服务编排页面。'
  );
});

app.post('/react/run', async (req, res) => {
  req.log.info('收到查询请求');
  try {
    const q = req.body?.query; // 读取用户问题
    if (!q) return res.status(400).json({ error: 'missing query' }); // 参数校验
    const out = await agent.run(q); // 调用 Agent 执行
    res.json({ result: out.final, history: out.history }); // 返回最终答案与推理历史
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // 错误捕获
  }
});

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);

