# blades-to-one

一个基于ReAct框架的智能体系统，使用TypeScript开发，支持多种工具集成和LLM调用。

## 项目简介

万剑归宗 (blades-to-one) 是一个基于ReAct（Reasoning + Acting）框架的智能体实现，它结合了推理能力和执行能力，能够通过思考和使用工具来解决复杂问题。

### 核心特性

- ✅ **ReAct框架实现**：将推理和行动相结合
- ✅ **多LLM支持**：Kimi、OpenAI等
- ✅ **工具集成**：支持多种工具调用
- ✅ **TypeScript开发**：类型安全，代码质量高
- ✅ **REST API**：提供HTTP接口供外部调用
- ✅ **模块化设计**：易于扩展和定制

## 技术栈

- **TypeScript**：主要开发语言
- **Express**：Web服务器
- **OpenAI SDK**：与LLM交互
- **dotenv**：环境变量管理

## 核心概念

### ReAct框架

ReAct框架将智能体的行为分为两个主要阶段：

1. **推理（Reasoning）**：智能体分析问题，思考解决方案
2. **行动（Acting）**：智能体执行动作，使用工具获取信息

这种结合使得智能体能够解决需要多步推理和外部信息的复杂问题。

### 智能体组件

- **Agent**：智能体核心，协调推理和行动
- **Reasoner**：负责构建提示和生成思考
- **Parser**：解析LLM响应，提取动作和参数
- **LLM Client**：与大语言模型交互
- **Tools**：智能体可以使用的工具集合

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 配置环境变量

复制示例环境变量文件并配置：

```bash
cp .env.example .env
```

编辑`.env`文件，添加你的API密钥：

```env
PORT=3000
# 使用Kimi API（推荐）
KIMI_API_KEY=your_actual_kimi_api_key_here
# 或使用OpenAI API
# OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

服务器将在`http://localhost:3000`上启动。

### 4. 测试API

使用curl或其他HTTP客户端测试API：

```bash
curl -X POST http://localhost:3000/react/run \
  -H "Content-Type: application/json" \
  -d '{"query": "上海的天气如何？"}'
```

## 配置

### LLM配置

万剑归宗 (blades-to-one) 支持多种LLM，优先级如下：

1. **Kimi API**：来自Moonshot AI的大语言模型
2. **OpenAI API**：OpenAI的GPT系列模型
3. **Mock LLM**：用于开发和测试的模拟实现

### 环境变量

| 变量名 | 描述 | 默认值 |
| --- | --- | --- |
| PORT | 服务器端口 | 3000 |
| KIMI_API_KEY | Kimi API密钥 | 无 |
| OPENAI_API_KEY | OpenAI API密钥 | 无 |

## API文档

### POST /react/run

执行智能体推理和行动流程。

#### 请求体

```json
{
  "query": "你的问题或任务"
}
```

#### 响应

```json
{
  "result": "最终答案",
  "history": [
    {
      "role": "agent",
      "content": "思考内容"
    },
    {
      "role": "tool",
      "content": "工具执行结果",
      "meta": {
        "action": "工具名称",
        "input": "工具输入"
      }
    },
    ...
  ]
}
```

## 工具列表

万剑归宗 (blades-to-one) 支持以下工具：

### 1. 搜索工具 (search)

执行网络搜索获取信息。

```typescript
async function webSearch(query: string): Promise<string>
```

### 2. 代码执行工具 (code_exec)

执行JavaScript代码片段。

```typescript
async function runCode(code: string): Promise<string>
```

### 3. 小型模型推理工具 (model_small)

使用小型模型进行推理。

```typescript
async function modelSmall(prompt: string): Promise<string>
```

### 4. 大型模型推理工具 (model_large)

使用大型模型进行推理。

```typescript
async function modelLarge(prompt: string): Promise<string>
```

### 5. 数据库查询工具 (db_query)

执行数据库查询。

```typescript
async function dbQuery(query: string): Promise<string>
```

### 6. 网络请求工具 (web_request)

发送HTTP网络请求。

```typescript
async function webRequest(input: string | { url: string; method?: string; headers?: Record<string, string>; body?: any }): Promise<string>
```

## 项目结构

```
├── src/
│   ├── core/              # 核心组件
│   │   ├── agent.ts       # 智能体核心
│   │   ├── parser.ts      # 响应解析器
│   │   ├── reasoner.ts    # 推理器
│   │   └── types.ts       # 类型定义
│   ├── llm/               # LLM客户端
│   │   ├── kimi-client.ts # Kimi API客户端
│   │   ├── mock-client.ts # 模拟客户端
│   │   └── openai-client.ts # OpenAI API客户端
│   ├── server/            # 服务器
│   │   └── index.ts       # 服务器入口
│   └── tools/             # 工具集
│       ├── codeExec.ts    # 代码执行工具
│       ├── dbQuery.ts     # 数据库查询工具
│       ├── index.ts       # 工具索引
│       ├── modelInference.ts # 模型推理工具
│       ├── search.ts      # 搜索工具
│       └── webRequest.ts  # 网络请求工具
├── tests/                 # 测试文件
├── .env.example           # 环境变量示例
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目文档
```

## 开发指南

### 添加新工具

1. 在`src/tools/`目录下创建新的工具文件
2. 实现工具函数，遵循以下签名：
   ```typescript
   async function toolName(input: any): Promise<string>
   ```
3. 在`src/tools/index.ts`中导出新工具

### 添加新LLM客户端

1. 在`src/llm/`目录下创建新的客户端文件
2. 实现`LLMClient`接口
3. 在`src/server/index.ts`中添加客户端支持

## 测试

运行测试：

```bash
npm run test
# 或
pnpm test
```

## 构建和部署

### 构建

```bash
npm run build
# 或
pnpm build
```

### 启动生产服务器

```bash
npm start
# 或
pnpm start
```

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 鸣谢

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Moonshot AI](https://www.moonshot.cn/) - Kimi API
- [OpenAI](https://openai.com/) - OpenAI API
