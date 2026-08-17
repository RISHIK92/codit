import type { ChatProvider, ChatTurn, ToolDefinition } from "./types";
import { chatCompletion, chatCompletionStream } from "./openaiCompatible";

// Groq retires model ids without notice — llama-3.3-70b-versatile was the
// previous default and now 404s, which silently broke every AI feature until
// the error was traced. Override with GROQ_MODEL rather than editing this.
const DEFAULT_MODEL = "openai/gpt-oss-120b";

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
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
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
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        providerName: "Groq",
        messages,
        tools,
        maxTokens,
      },
      onDelta,
    );
  },
};
