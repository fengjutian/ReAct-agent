"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const agent_1 = require("core/agent");
const reasoner_1 = require("core/reasoner");
const mock_client_1 = require("llm/mock-client");
const openai_client_1 = require("llm/openai-client");
const kimi_client_1 = require("llm/kimi-client");
const ollama_client_1 = require("llm/ollama-client");
const qwen_client_1 = require("llm/qwen-client");
const deepseek_client_1 = require("llm/deepseek-client");
const coze_client_1 = require("llm/coze-client");
const coze_orchestrator_1 = require("workflow/coze-orchestrator");
const path_1 = __importDefault(require("path"));
const pino_http_1 = __importDefault(require("pino-http"));
dotenv_1.default.config();
// 加载 `.env`，用于读取 `OPENAI_API_KEY`、`PORT` 等
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, pino_http_1.default)());
// 添加静态文件支持，用于提供Coze Studio编排页面
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// 端口优先使用环境变量 `PORT`，否则默认 3001
const port = process.env.PORT || 3001;
// 选择 LLM：优先使用 KimiClient，然后是 OpenAIClient，再是 QwenClient，接着是 DeepSeekClient，然后是 CozeClient，然后是 OllamaClient，最后是 Mock
let llmClient;
if (process.env.KIMI_API_KEY) {
    llmClient = new kimi_client_1.KimiClient(process.env.KIMI_API_KEY);
    console.log('Using KimiClient (Moonshot)');
}
else if (process.env.OPENAI_API_KEY) {
    llmClient = new openai_client_1.OpenAIClient(process.env.OPENAI_API_KEY);
    console.log('Using OpenAIClient (real LLM)');
}
else if (process.env.QWEN_API_KEY) {
    llmClient = new qwen_client_1.QwenClient(process.env.QWEN_API_KEY);
    console.log('Using QwenClient (Alibaba Cloud)');
}
else if (process.env.DEEPSEEK_API_KEY) {
    llmClient = new deepseek_client_1.DeepSeekClient(process.env.DEEPSEEK_API_KEY);
    console.log('Using DeepSeekClient (DeepSeek Inc.)');
}
else if (process.env.COZE_API_KEY) {
    llmClient = new coze_client_1.CozeClient(process.env.COZE_API_KEY, process.env.COZE_BASE_URL, process.env.COZE_DEFAULT_WORKFLOW);
    console.log(`Using CozeClient (Coze Studio) with workflow: ${process.env.COZE_DEFAULT_WORKFLOW || 'default'}`);
}
else if (process.env.USE_OLLAMA === 'true') {
    llmClient = new ollama_client_1.OllamaClient({
        baseURL: process.env.OLLAMA_BASE_URL,
        defaultModel: process.env.OLLAMA_DEFAULT_MODEL,
    });
    console.log(`Using OllamaClient with model: ${process.env.OLLAMA_DEFAULT_MODEL || 'llama3'}`);
}
else {
    llmClient = new mock_client_1.MockLLMClient();
    console.log('Using MockLLMClient (mock LLM)');
}
// 创建推理器实例
const reasoner = new reasoner_1.Reasoner(llmClient);
// 创建Coze Studio服务编排器实例（如果配置了相关环境变量）
let cozeOrchestrator;
if (process.env.COZE_API_KEY) {
    cozeOrchestrator = new coze_orchestrator_1.CozeOrchestrator(process.env.COZE_API_KEY, process.env.COZE_BASE_URL, process.env.COZE_DEFAULT_WORKFLOW);
    console.log('Coze Studio服务编排器已初始化');
}
// 组装推理器与代理；第二参数为最大思考步数，第三参数为Coze Studio服务编排器
const agent = new agent_1.Agent(reasoner, 6, cozeOrchestrator);
// 组装推理器与代理；第二参数为最大思考步数
// 添加一个欢迎页面
app.get('/', (req, res) => {
    req.log.info('收到欢迎页面请求');
    res.send('欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。或访问 /coze-orchestration.html 使用Coze Studio服务编排页面。');
});
app.post('/react/run', async (req, res) => {
    req.log.info('收到查询请求');
    try {
        const q = req.body?.query; // 读取用户问题
        if (!q)
            return res.status(400).json({ error: 'missing query' }); // 参数校验
        const out = await agent.run(q); // 调用 Agent 执行
        res.json({ result: out.final, history: out.history }); // 返回最终答案与推理历史
    }
    catch (e) {
        res.status(500).json({ error: e.message }); // 错误捕获
    }
});
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
