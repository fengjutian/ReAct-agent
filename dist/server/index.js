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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const port = process.env.PORT || 3000;
// 选择 LLM：如果有 OPENAI_API_KEY 则使用 OpenAIClient，否则用 Mock
let llmClient;
if (process.env.OPENAI_API_KEY) {
    llmClient = new openai_client_1.OpenAIClient(process.env.OPENAI_API_KEY);
    console.log("Using OpenAIClient (real LLM)");
}
else {
    llmClient = new mock_client_1.MockLLMClient();
    console.log("Using MockLLMClient (mock LLM)");
}
const reasoner = new reasoner_1.Reasoner(llmClient);
const agent = new agent_1.Agent(reasoner, 6);
app.post("/react/run", async (req, res) => {
    try {
        const q = req.body?.query;
        if (!q)
            return res.status(400).json({ error: "missing query" });
        const out = await agent.run(q);
        res.json({ result: out.final, history: out.history });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
