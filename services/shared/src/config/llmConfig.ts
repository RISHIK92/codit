export const LLM_MODELS = {
  FAST_REASONING: {
    provider: "groq",
    model: "llama-3.1-8b-instant",
    temperature: 0,
  },
  DEEP_REASONING: {
    provider: "groq",
    model: "qwen/qwen3-32b",
    temperature: 0.3,
  },
  RESOURCE_CURATOR: {
    provider: "groq",
    model: "groq/compound",
    response_format: "json_object",
  },
};
