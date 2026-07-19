"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  SendHorizonal,
  StopCircle,
  RotateCcw,
  Copy,
  Check,
  X,
} from "lucide-react";
import { sendChatMessage, type ChatMode } from "@/lib/api/aiApi";

// ── Types ──────────────────────────────────────────────────────────────────

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// ── Props ──────────────────────────────────────────────────────────────────

interface AiAssistantProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  phaseId?: string;
  /** Short human-readable summary of the current project + phase, e.g. "Project: Recipe Tracker (React, Node) — Phase 2: State Management". */
  currentTask?: string;
  activeFileId?: string;
  getToken: () => Promise<string>;
  /** When set, the panel auto-sends this message as soon as it opens */
  initialMessage?: string;
  /**
   * Bump this (e.g. an incrementing counter) to force a resend of the same
   * initialMessage text — e.g. clicking "Submit" again for another review
   * round. Dedup is keyed on this, not on the message text, so identical
   * text sent via a new nonce still goes out; only an unchanged nonce
   * (React Strict Mode double-invoking the same trigger) is suppressed.
   */
  initialMessageNonce?: number;
  /** Mode for the auto-sent initialMessage — defaults to "chat" (agentic) */
  initialMessageMode?: ChatMode;
  onInitialMessageConsumed?: () => void;
  /** Called with the full assistant reply once a message finishes streaming successfully. */
  onReplyComplete?: (fullText: string) => void;
  /** Mirrors whether a request is in flight — lets callers (e.g. the Submit button) disable themselves only while the AI is actually thinking. */
  onLoadingChange?: (loading: boolean) => void;
}

// ── Content renderer ───────────────────────────────────────────────────────
// Hand-rolled, not a full markdown parser — just enough to cover what the
// assistant actually produces: fenced code, inline code, bold, and lists.
// Streamed text can briefly show an unclosed ``` or ** as literal
// characters until the closing marker arrives; it self-corrects.

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, j) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-${j}`}
          className="px-1 py-0.5 bg-void rounded text-[11px] font-mono text-accent/80 border border-border-s"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-${j}`} className="font-semibold text-txt">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${j}`}>{part}</span>;
  });
}

function renderTextBlock(block: string, blockKey: string) {
  const lines = block.split("\n");
  return (
    <span key={blockKey}>
      {lines.map((line, li) => {
        const lineKey = `${blockKey}-l${li}`;
        const numbered = line.match(/^(\d+)\.\s+(.*)/);
        const bulleted = line.match(/^[-*]\s+(.*)/);

        if (numbered) {
          return (
            <div key={lineKey} className="flex gap-1.5 pl-0.5">
              <span className="text-txt-ghost shrink-0">{numbered[1]}.</span>
              <span>{renderInline(numbered[2], lineKey)}</span>
            </div>
          );
        }
        if (bulleted) {
          return (
            <div key={lineKey} className="flex gap-1.5 pl-0.5">
              <span className="text-txt-ghost shrink-0">•</span>
              <span>{renderInline(bulleted[1], lineKey)}</span>
            </div>
          );
        }
        return (
          <span key={lineKey}>
            {renderInline(line, lineKey)}
            {li < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}

function renderContent(text: string) {
  if (!text)
    return <span className="opacity-30 italic text-[11px]">Thinking…</span>;

  const blocks = text.split(/(```[\s\S]*?```)/g);
  return blocks.map((block, i) => {
    if (block.startsWith("```")) {
      const newline = block.indexOf("\n");
      const lang = newline > 3 ? block.slice(3, newline).trim() : "";
      const code =
        newline > 3 ? block.slice(newline + 1, -3) : block.slice(3, -3);
      return (
        <pre
          key={i}
          className="my-2 p-3 bg-void rounded-sm border border-border-s overflow-x-auto text-[11px] font-mono leading-relaxed text-txt-muted"
        >
          {lang && (
            <div className="text-[9px] uppercase tracking-widest text-txt-ghost mb-2 font-(family-name:--font-dm)">
              {lang}
            </div>
          )}
          <code>{code.trimEnd()}</code>
        </pre>
      );
    }
    return renderTextBlock(block, `b${i}`);
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export function AiAssistant({
  open,
  onClose,
  projectId,
  phaseId,
  currentTask,
  activeFileId,
  getToken,
  initialMessage,
  initialMessageNonce,
  initialMessageMode,
  onInitialMessageConsumed,
  onReplyComplete,
  onLoadingChange,
}: AiAssistantProps) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Dedupes the initialMessage auto-send below against React 18 Strict
  // Mode's intentional double-invocation of mount effects in dev (this
  // effect fires a real network request, which is exactly the kind of
  // non-idempotent mount action Strict Mode double-fires to catch). Keyed on
  // initialMessageNonce when the caller provides one, so a deliberate resend
  // of identical text (e.g. clicking "Submit" again) still goes out — only
  // a genuinely-repeated trigger (same nonce) is suppressed.
  const sentKeyRef = useRef<string | number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Auto-send an injected message (e.g. from Option+Click popup, or Submit-for-review)
  useEffect(() => {
    const dedupeKey = initialMessageNonce ?? initialMessage ?? null;
    if (
      open &&
      initialMessage &&
      dedupeKey !== null &&
      sentKeyRef.current !== dedupeKey
    ) {
      sentKeyRef.current = dedupeKey;
      setInput(initialMessage);
      onInitialMessageConsumed?.();
      // Let the panel paint first, then fire
      setTimeout(() => {
        sendMessageWithText(initialMessage, initialMessageMode);
      }, 120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMessage, initialMessageNonce]);

  async function sendMessageWithText(text: string, mode: ChatMode = "chat") {
    if (!text || loading) return;

    const userMsg: AiMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const abort = new AbortController();
    abortRef.current = abort;

    const assistantMsgId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const token = await getToken();
      const fullText = await sendChatMessage(
        token,
        {
          projectId,
          phaseId,
          currentTask,
          activeFilePath: activeFileId,
          message: text,
          // "review" is a fresh evaluation of the current submission — prior
          // unrelated chat turns are noise here, not useful context.
          history:
            mode === "review"
              ? []
              : messages.map((m) => ({ role: m.role, content: m.content })),
          mode,
        },
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: m.content + chunk }
                : m,
            ),
          );
        },
        abort.signal,
      );
      onReplyComplete?.(fullText);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    m.content ||
                    "Sorry, I couldn't reach the AI service. Please try again.",
                }
              : m,
          ),
        );
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function sendMessage() {
    const text = input.trim();
    await sendMessageWithText(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleClear() {
    setMessages([]);
    setInput("");
  }

  if (!open) return null;

  return (
    <div className="h-full w-full flex flex-col bg-void">
        {/* Header */}
        <div className="h-12 shrink-0 flex items-center gap-2.5 px-4 border-b border-border-s bg-surface/60">
          <Sparkles size={13} className="text-accent shrink-0" />
          <span className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt flex-1">
            AI Assistant
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              title="Clear conversation"
              className="p-1 rounded-sm text-txt-ghost hover:text-accent hover:bg-surface transition-colors cursor-pointer"
            >
              <RotateCcw size={11} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-txt-ghost hover:text-txt hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-12">
              <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
                <Sparkles size={16} className="text-accent/60" />
              </div>
              <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost leading-relaxed max-w-55">
                Ask anything about your code, the current phase, or how to debug
                an issue.
              </p>
              <div className="mt-2 space-y-1.5 w-full">
                {[
                  "Explain the current file",
                  "What should I build next?",
                  "How do I add error handling?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left px-3 py-2 rounded-sm border border-border-s text-[11px] font-(family-name:--font-dm) text-txt-ghost hover:text-txt hover:border-accent/30 hover:bg-surface/40 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`group relative max-w-[90%] px-3 py-2.5 rounded-sm text-[12px] font-(family-name:--font-dm) leading-[1.7]
                  ${
                    msg.role === "user"
                      ? "bg-accent/10 border border-accent/20 text-txt"
                      : "bg-surface/40 border border-border-s text-txt-muted"
                  }`}
              >
                {msg.role === "assistant" && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute top-2 right-2 p-0.5 rounded opacity-0 group-hover:opacity-100 text-txt-ghost hover:text-accent transition-all cursor-pointer"
                    title="Copy"
                  >
                    {copiedId === msg.id ? (
                      <Check size={10} className="text-accent" />
                    ) : (
                      <Copy size={10} />
                    )}
                  </button>
                )}
                <div className="whitespace-pre-wrap wrap-break-word pr-4">
                  {renderContent(msg.content)}
                </div>
              </div>
              <span className="text-[9px] font-(family-name:--font-dm) text-txt-ghost px-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-border-s bg-surface/30 px-3 py-3">
          <div className="flex items-end gap-2 bg-void border border-border-s rounded-sm focus-within:border-accent/40 transition-colors px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your code…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-[12px] font-(family-name:--font-dm) text-txt placeholder:text-txt-ghost outline-none leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: "20px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
              }}
            />
            {loading ? (
              <button
                onClick={handleStop}
                className="shrink-0 p-1 rounded-sm text-red-400/70 hover:text-red-400 hover:bg-surface transition-colors cursor-pointer"
                title="Stop"
              >
                <StopCircle size={14} />
              </button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="shrink-0 p-1 rounded-sm text-txt-ghost hover:text-accent transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                title="Send (Enter)"
              >
                <SendHorizonal size={14} />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[9px] font-(family-name:--font-dm) text-txt-ghost text-center">
            Enter to send · Shift+Enter for newline
          </p>
        </div>
    </div>
  );
}
