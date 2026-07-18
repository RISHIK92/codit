import type { ChatProvider, ChatTurn, ToolDefinition } from "./types";
import { chatCompletion, chatCompletionStream } from "./openaiCompatible";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

export const groqProvider: ChatProvider = {
  name: "groq",
  getChatCompletion(
    messages: ChatTurn[],
    tools?: ToolDefinition[],
    maxTokens?: number,
  ) {
    return chatCompletion({
      baseUrl: GROQ_BASE_URL,
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      providerName: "Groq",
      messages,
      tools,
      maxTokens,
    });
  },
  getChatCompletionStream(
    messages: ChatTurn[],
    onDelta: (text: string) => void,
    tools?: ToolDefinition[],
    maxTokens?: number,
  ) {
    return chatCompletionStream(
      {
        baseUrl: GROQ_BASE_URL,
        apiKey: process.env.GROQ_API_KEY,
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        providerName: "Groq",
        messages,
        tools,
        maxTokens,
      },
      onDelta,
    );
  },
};
