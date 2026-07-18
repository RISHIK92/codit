// ─── Provider abstraction ──────────────────────────────────────────────────
// Any LLM backend can plug in here as long as it speaks the OpenAI-style
// chat-completions shape (which Groq, OpenAI, and most others do).

export interface ToolCall {
  id: string;
  name: string;
  /** raw JSON string, as returned by the model */
  arguments: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  /** JSON schema for the tool's arguments */
  parameters: Record<string, unknown>;
}

export interface ChatTurn {
  role: "user" | "assistant" | "system" | "tool";
  /** null on an assistant turn that only carries tool calls */
  content: string | null;
  /** present on an assistant turn that is requesting tool use */
  toolCalls?: ToolCall[];
  /** present on a tool-result turn, links back to the originating call */
  toolCallId?: string;
}

export interface ChatCompletionResult {
  content: string | null;
  toolCalls?: ToolCall[];
}

export interface ChatProvider {
  name: string;
  getChatCompletion(
    messages: ChatTurn[],
    tools?: ToolDefinition[],
    maxTokens?: number,
  ): Promise<ChatCompletionResult>;
}
