import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Agent } from "../core/agent";
import { Reasoner } from "../core/reasoner";
import { MockLLMClient } from "../llm/mock-client";
import { OpenAIClient } from "../llm/openai-client";
import { KimiClient } from "../llm/kimi-client";

dotenv.config();
// 加载 `.env`，用于读取 `OPENAI_API_KEY`、`PORT` 等

const app = express();
app.use(bodyParser.json());
// 初始化 Express 应用并启用 JSON 解析中间件

const port = process.env.PORT || 3000;
// 端口优先使用环境变量 `PORT`，否则默认 3000

// 选择 LLM：优先使用 KimiClient，然后是 OpenAIClient，最后是 Mock
let llmClient: any;
if (process.env.KIMI_API_KEY) {
  llmClient = new KimiClient(process.env.KIMI_API_KEY);
  console.log("Using KimiClient (Moonshot)");
} else if (process.env.OPENAI_API_KEY) {
  llmClient = new OpenAIClient(process.env.OPENAI_API_KEY);
  console.log("Using OpenAIClient (real LLM)");
} else {
  llmClient = new MockLLMClient();
  console.log("Using MockLLMClient (mock LLM)");
}

const reasoner = new Reasoner(llmClient);
const agent = new Agent(reasoner, 6);
// 组装推理器与代理；第二参数为最大思考步数

// 添加一个欢迎页面
app.get("/", (req, res) => {
  res.send("欢迎使用万剑归宗 (blades-to-one)! 使用 POST /react/run 进行查询。");
});

app.post("/react/run", async (req, res) => {
  try {
    const q = req.body?.query; // 读取用户问题
    if (!q) return res.status(400).json({ error: "missing query" }); // 参数校验
    const out = await agent.run(q); // 调用 Agent 执行
    res.json({ result: out.final, history: out.history }); // 返回最终答案与推理历史
  } catch (e: any) {
    res.status(500).json({ error: e.message }); // 错误捕获
  }
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`)); // 启动服务并输出访问地址