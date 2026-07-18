import type { ChatProvider } from "./types";
import { groqProvider } from "./groq";

export type {
  ChatProvider,
  ChatTurn,
  ToolDefinition,
  ToolCall,
  ChatCompletionResult,
  TokenUsage,
} from "./types";

const PROVIDERS: Record<string, ChatProvider> = {
  groq: groqProvider,
};

/** Swappable via AI_PROVIDER env var (defaults to "groq"). */
export function getChatProvider(): ChatProvider {
  const name = (process.env.AI_PROVIDER || "groq").toLowerCase();
  const provider = PROVIDERS[name];
  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER "${name}" — expected one of: ${Object.keys(PROVIDERS).join(", ")}`,
    );
  }
  return provider;
}
