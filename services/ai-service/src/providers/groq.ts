import type { ChatProvider, ChatTurn, ToolDefinition } from "./types";
import { chatCompletion } from "./openaiCompatible";

export const groqProvider: ChatProvider = {
  name: "groq",
  getChatCompletion(
    messages: ChatTurn[],
    tools?: ToolDefinition[],
    maxTokens?: number,
  ) {
    return chatCompletion({
      baseUrl: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      providerName: "Groq",
      messages,
      tools,
      maxTokens,
    });
  },
};
