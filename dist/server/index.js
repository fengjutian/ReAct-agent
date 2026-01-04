"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const agent_1 = require("../core/agent");
const reasoner_1 = require("../core/reasoner");
const mock_client_1 = require("../llm/mock-client");
const openai_client_1 = require("../llm/openai-client");
const kimi_client_1 = require("../llm/kimi-client");
const ollama_client_1 = require("../llm/ollama-client");
const qwen_client_1 = require("../llm/qwen-client");
const deepseek_client_1 = require("../llm/deepseek-client");
dotenv_1.default.config();
// 加载 `.env`，用于读取 `OPENAI_API_KEY`、`PORT` 等
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// 初始化 Express 应用并启用 JSON 解析中间件
const port = process.env.PORT || 3000;
// 端口优先使用环境变量 `PORT`，否则默认 3000
// 选择 LLM：优先使用 KimiClient，然后是 OpenAIClient，再是 QwenClient，接着是 DeepSeekClient，然后是 OllamaClient，最后是 Mock
let llmClient;
if (process.env.KIMI_API_KEY) {
    llmClient = new kimi_client_1.KimiClient(process.env.KIMI_API_KEY);
    console.log("Using KimiClient (Moonshot)");
}
else if (process.env.OPENAI_API_KEY) {
    llmClient = new openai_client_1.OpenAIClient(process.env.OPENAI_API_KEY);
    console.log("Using OpenAIClient (real LLM)");
}
else if (process.env.QWEN_API_KEY) {
    llmClient = new qwen_client_1.QwenClient(process.env.QWEN_API_KEY);
    console.log("Using QwenClient (Alibaba Cloud)");
}
else if (process.env.DEEPSEEK_API_KEY) {
    llmClient = new deepseek_client_1.DeepSeekClient(process.env.DEEPSEEK_API_KEY);
    console.log("Using DeepSeekClient (DeepSeek Inc.)");
}
else if (process.env.USE_OLLAMA === "true") {
    llmClient = new ollama_client_1.OllamaClient({
        baseURL: process.env.OLLAMA_BASE_URL,
        defaultModel: process.env.OLLAMA_DEFAULT_MODEL
    });
    console.log(`Using OllamaClient with model: ${process.env.OLLAMA_DEFAULT_MODEL || "llama3"}`);
}
else {
    llmClient = new mock_client_1.MockLLMClient();
    console.log("Using MockLLMClient (mock LLM)");
}
const reasoner = new reasoner_1.Reasoner(llmClient);
const agent = new agent_1.Agent(reasoner, 6);
// 组装推理器与代理；第二参数为最大思考步数
// 添加一个欢迎页面
app.get("/", (req, res) => {
    res.send("欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。");
});
app.post("/react/run", async (req, res) => {
    try {
        const q = req.body?.query; // 读取用户问题
        if (!q)
            return res.status(400).json({ error: "missing query" }); // 参数校验
        const out = await agent.run(q); // 调用 Agent 执行
        res.json({ result: out.final, history: out.history }); // 返回最终答案与推理历史
    }
    catch (e) {
        res.status(500).json({ error: e.message }); // 错误捕获
    }
});
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`)); // 启动服务并输出访问地址
