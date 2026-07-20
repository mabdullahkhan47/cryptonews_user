"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  ChevronLeft,
  Copy,
  History,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useChat } from "@/hooks/useChat";
import { useChatArticle } from "@/context/ChatArticleContext";

const HOMEPAGE_PROMPTS = [
  "Today's Crypto News",
  "What is the price of Bitcoin?",
  "Explain blockchain simply",
];

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-start gap-2 px-1 sm:gap-3"
    >
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-violet-500/25 sm:h-8 sm:w-8 dark:shadow-violet-500/20">
        <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>
      <div className="flex min-w-[100px] items-center gap-2 rounded-2xl rounded-tl-md border border-zinc-200/90 bg-white px-3 py-2 shadow-sm sm:min-w-[120px] sm:gap-2.5 sm:px-4 sm:py-3 dark:border-white/8 dark:bg-[#1a1a2e] dark:shadow-none">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 animate-bounce rounded-full bg-violet-500 [animation-delay:0ms] sm:h-1.5 sm:w-1.5" />
          <span className="h-1 w-1 animate-bounce rounded-full bg-violet-500 [animation-delay:140ms] sm:h-1.5 sm:w-1.5" />
          <span className="h-1 w-1 animate-bounce rounded-full bg-violet-500 [animation-delay:280ms] sm:h-1.5 sm:w-1.5" />
        </div>
        <span className="text-[11px] text-zinc-600 sm:text-[13px] dark:text-zinc-400">Thinking…</span>
      </div>
    </motion.div>
  );
}

function ArticleCard({ article }) {
  const href = `/news/id/${article.slug || article.articleId}`;
  const dateLabel = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : null;

  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-lg border border-violet-200/70 bg-gradient-to-r from-violet-50/80 to-white px-2.5 py-2 transition hover:border-violet-300 hover:from-violet-50 hover:to-violet-50/40 sm:items-start sm:gap-3 sm:rounded-xl sm:border-zinc-200 sm:bg-white sm:p-2.5 sm:shadow-sm sm:hover:border-violet-300 sm:hover:bg-violet-50/70 dark:border-violet-500/20 dark:from-violet-500/10 dark:to-white/[0.03] dark:hover:border-violet-400/35 dark:hover:from-violet-500/15 dark:hover:to-white/[0.05] sm:dark:border-white/8 sm:dark:bg-white/[0.04] sm:dark:from-transparent sm:dark:to-transparent sm:dark:shadow-none sm:dark:hover:bg-white/[0.07]"
    >
      {article.thumbnail ? (
        <div className="relative hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-200 sm:block dark:bg-zinc-800">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="56px"
          />
        </div>
      ) : (
        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 sm:flex dark:bg-violet-500/15 dark:text-violet-300">
          <Sparkles className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {article.categoryName && (
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-violet-600 sm:inline-block dark:text-violet-300/80">
            {article.categoryName}
          </span>
        )}
        <p className="line-clamp-1 text-[11px] font-medium leading-snug text-zinc-900 group-hover:text-violet-700 sm:line-clamp-2 sm:text-[13px] dark:text-zinc-100 dark:group-hover:text-white">
          {article.title}
        </p>
        {dateLabel && (
          <p className="mt-0.5 text-[10px] text-violet-600/70 sm:mt-1 sm:text-[10px] sm:text-zinc-500 dark:text-violet-300/60 sm:dark:text-zinc-500">
            {dateLabel}
          </p>
        )}
      </div>
      <ArrowUpRight className="hidden h-3.5 w-3.5 shrink-0 text-violet-400/80 transition group-hover:text-violet-600 sm:mt-1 sm:block dark:text-violet-400/70 dark:group-hover:text-violet-300" />
    </Link>
  );
}

function ChatMessage({ message, onCopy, isStreaming }) {
  const isUser = message.role === "user";
  const showContent = message.content?.trim();

  return (
    <motion.div
      initial={isUser ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2 sm:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-violet-500/20 sm:h-8 sm:w-8">
          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      )}

      <div className={`min-w-0 ${isUser ? "max-w-[88%] sm:max-w-[85%]" : "max-w-[92%] sm:max-w-[90%]"}`}>
        <div
          className={
            isUser
              ? "rounded-xl rounded-br-md bg-gradient-to-br from-blue-600 to-violet-600 px-3 py-2 text-[12px] leading-relaxed text-white shadow-md shadow-violet-500/20 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-[14px] dark:shadow-lg dark:shadow-violet-900/20"
              : "relative rounded-xl rounded-tl-md border border-zinc-200/95 bg-white px-3 py-2 pr-8 text-[12px] leading-relaxed text-zinc-800 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:px-4 sm:py-3 sm:pr-10 sm:text-[14px] dark:border-white/8 dark:bg-[#1a1a2e] dark:text-zinc-100 dark:shadow-none"
          }
        >
          {!isUser && showContent && !isStreaming && (
            <button
              type="button"
              onClick={() => onCopy(message.content)}
              className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 sm:right-2 sm:top-2 sm:h-7 sm:w-7 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
              aria-label="Copy message"
              title="Copy"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}

          {isUser ? (
            <p className="chat-md whitespace-pre-wrap">{message.content}</p>
          ) : showContent ? (
            isStreaming ? (
              <div className="chat-md chat-streaming whitespace-pre-wrap text-[12px] leading-relaxed text-zinc-700 sm:text-[14px] dark:text-zinc-200">
                {message.content}
                <span className="chat-stream-cursor" aria-hidden />
              </div>
            ) : (
            <div className="chat-md chat-reply-done prose prose-sm max-w-none prose-zinc dark:prose-invert prose-p:my-2 prose-p:text-[12px] prose-p:leading-relaxed prose-p:text-zinc-700 sm:prose-p:my-3 sm:prose-p:text-[14px] dark:prose-p:text-zinc-200 prose-headings:mt-4 prose-headings:mb-1.5 prose-headings:font-semibold prose-headings:text-zinc-900 first:prose-headings:mt-0 sm:prose-headings:mt-5 sm:prose-headings:mb-2 dark:prose-headings:text-zinc-50 prose-strong:text-zinc-900 dark:prose-strong:text-white prose-a:text-violet-700 dark:prose-a:text-violet-300 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:text-[12px] prose-li:text-zinc-700 sm:prose-ul:my-3 sm:prose-ol:my-3 sm:prose-li:my-1 sm:prose-li:text-[14px] dark:prose-li:text-zinc-200 prose-code:rounded prose-code:bg-violet-50 prose-code:px-1 prose-code:text-[11px] prose-code:text-violet-700 sm:prose-code:text-[13px] dark:prose-code:bg-white/10 dark:prose-code:text-violet-200 prose-pre:bg-zinc-900 prose-pre:text-[11px] prose-pre:text-zinc-100 sm:prose-pre:text-[13px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-1.5 mt-4 text-base font-semibold first:mt-0 sm:mb-2 sm:mt-5 sm:text-lg">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-1.5 mt-4 text-[14px] font-semibold first:mt-0 sm:mb-2 sm:mt-5 sm:text-base">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-1.5 mt-3 text-[13px] font-semibold first:mt-0 sm:mb-2 sm:mt-4 sm:text-[15px]">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="my-2 text-[12px] leading-relaxed first:mt-0 last:mb-0 sm:my-3 sm:text-[14px]">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-2 list-disc space-y-1 pl-5 text-[12px] leading-relaxed text-zinc-700 sm:my-3 sm:text-[14px] dark:text-zinc-200">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-2 list-decimal space-y-1 pl-5 text-[12px] leading-relaxed text-zinc-700 sm:my-3 sm:text-[14px] dark:text-zinc-200">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="pl-0.5 marker:text-violet-500 dark:marker:text-violet-400">
                      {children}
                    </li>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            )
          ) : null}

          {!isUser && message.relatedArticles?.length > 0 && (
            <div className="mt-2.5 border-t border-zinc-200/80 pt-2.5 sm:mt-4 sm:pt-3 dark:border-white/8">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700 sm:mb-2 sm:text-[11px] dark:text-violet-300">
                Related articles
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {message.relatedArticles.map((article) => (
                  <ArticleCard key={article.articleId} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        {message.timestamp && (
          <p
            className={`mt-1 px-1 text-[9px] text-zinc-600 sm:mt-1.5 sm:text-[10px] dark:text-zinc-500 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const [pinKey, setPinKey] = useState(0);
  const chatArticle = useChatArticle();

  const {
    messages,
    history,
    loading,
    streaming,
    error,
    historySearch,
    setHistorySearch,
    sendMessage,
    startNewChat,
    loadSession,
    deleteSession,
    renameSession,
    loadHistory,
    stopGenerating,
    regenerateResponse,
  } = useChat();

  const suggestedPrompts = HOMEPAGE_PROMPTS;

  const pinToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // Open / history load: land at conversation end
  useLayoutEffect(() => {
    if (!open) return;
    stickToBottomRef.current = true;
    pinToBottom();
  }, [open, pinKey]);

  useEffect(() => {
    if (!open) return undefined;
    stickToBottomRef.current = true;
    const timers = [0, 40, 120, 280, 450].map((ms) =>
      setTimeout(pinToBottom, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [open, pinKey, messages.length]);

  // Follow the assistant response while generating; otherwise honor stick-to-bottom
  useLayoutEffect(() => {
    if (!open) return;
    if (loading || streaming) {
      stickToBottomRef.current = true;
      pinToBottom();
      return;
    }
    if (stickToBottomRef.current) pinToBottom();
  }, [messages, loading, streaming, open, pinKey]);

  const handleScroll = () => {
    if (loading || streaming) {
      stickToBottomRef.current = true;
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 100;
  };

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open && !showHistory) inputRef.current?.focus();
  }, [open, showHistory]);

  useEffect(() => {
    if (chatArticle?.requestOpen) {
      setOpen(true);
      chatArticle.setRequestOpen(false);
    }
  }, [chatArticle?.requestOpen, chatArticle]);

  useEffect(() => {
    const handler = (event) => {
      const prompt = event.detail?.prompt;
      if (!prompt) return;
      setOpen(true);
      setTimeout(() => sendMessage(prompt), 150);
    };
    window.addEventListener("cryptonews-chat-prompt", handler);
    return () => window.removeEventListener("cryptonews-chat-prompt", handler);
  }, [sendMessage]);

  useEffect(() => {
    const timer = setTimeout(() => loadHistory(historySearch), 300);
    return () => clearTimeout(timer);
  }, [historySearch, loadHistory]);

  const handleSend = async (text = input) => {
    const value = text.trim();
    if (!value || loading) return;
    setInput("");
    stickToBottomRef.current = true;
    requestAnimationFrame(pinToBottom);
    await sendMessage(value);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const latestFollowUps =
    [...messages].reverse().find((m) => m.role === "assistant")?.followUpQuestions || [];

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[59] bg-slate-900/35 backdrop-blur-[4px] dark:bg-black/60"
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-gradient-to-b from-[#f5f4fa] via-[#f3f4f8] to-[#ebeaf2] text-zinc-900 dark:bg-none dark:bg-[#0c0c14] dark:text-zinc-100 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(88vh,760px)] sm:w-[min(calc(100vw-2rem),520px)] sm:rounded-[28px] sm:border sm:border-zinc-200/90 sm:shadow-[0_28px_80px_-24px_rgba(15,23,42,0.35),0_0_0_1px_rgba(99,102,241,0.1)] dark:sm:border-white/10 dark:sm:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.75),0_0_0_1px_rgba(139,92,246,0.12)]"
            >
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -top-20 left-1/2 h-52 w-80 -translate-x-1/2 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20" />
              <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/15" />
              <div className="pointer-events-none absolute bottom-24 -left-10 h-36 w-36 rounded-full bg-indigo-300/15 blur-3xl dark:hidden" />

              {/* Header */}
              <div className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200/90 bg-white/75 px-3 py-3 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-3.5 dark:border-white/8 dark:bg-[#0c0c14]/80">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                  {showHistory ? (
                    <button
                      type="button"
                      onClick={() => setShowHistory(false)}
                      className="shrink-0 rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                      aria-label="Back to chat"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/30 sm:h-10 sm:w-10 sm:rounded-2xl dark:shadow-violet-900/40">
                      <Sparkles className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-emerald-400 sm:h-2.5 sm:w-2.5 dark:border-[#0c0c14]" />
                    </div>
                  )}
                  <div className="min-w-0 overflow-hidden">
                    <p className="truncate text-[13px] font-semibold tracking-tight text-zinc-900 sm:text-[15px] dark:text-white">
                      CryptoNews AI
                    </p>
                    <p className="truncate text-[10px] text-zinc-600 sm:text-[11px] dark:text-zinc-400">
                      Online · Crypto assistant
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => setShowHistory((v) => !v)}
                    className={`rounded-lg p-2 transition sm:rounded-xl sm:p-2.5 ${
                      showHistory
                        ? "bg-violet-50 text-violet-700 dark:bg-white/10 dark:text-white"
                        : "text-zinc-600 hover:bg-zinc-100/90 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                    aria-label="Chat history"
                  >
                    <History className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={startNewChat}
                    className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100/90 hover:text-zinc-900 sm:rounded-xl sm:p-2.5 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                    aria-label="New chat"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100/90 hover:text-zinc-900 sm:rounded-xl sm:p-2.5 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showHistory ? (
                <div className="relative z-10 flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-3">
                  <div className="relative mb-4">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                    <input
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder="Search conversations…"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-200/60 dark:border-white/8 dark:bg-white/[0.04] dark:shadow-none dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-500/40 dark:focus:ring-0 dark:focus:bg-white/[0.06]"
                    />
                  </div>
                  {history.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                      <History className="mb-3 h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">No conversations yet</p>
                    </div>
                  ) : (
                    <ul className="chat-scroll flex-1 space-y-2 overflow-y-auto pr-1">
                      {history.map((item) => (
                        <li
                          key={item.sessionId}
                          className="group flex items-center gap-1 rounded-2xl border border-zinc-200 bg-white/90 p-2.5 shadow-sm transition hover:border-violet-200 hover:bg-white dark:border-white/6 dark:bg-white/[0.03] dark:shadow-none dark:hover:border-white/10 dark:hover:bg-white/[0.05]"
                        >
                          <button
                            type="button"
                            onClick={async () => {
                              stickToBottomRef.current = true;
                              setShowHistory(false);
                              await loadSession(item.sessionId);
                              setPinKey((n) => n + 1);
                            }}
                            className="min-w-0 flex-1 px-1.5 text-left"
                          >
                            {renamingId === item.sessionId ? (
                              <input
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={async (e) => {
                                  if (e.key === "Enter") {
                                    await renameSession(item.sessionId, renameValue);
                                    setRenamingId(null);
                                  }
                                  if (e.key === "Escape") setRenamingId(null);
                                }}
                                className="w-full rounded-lg border border-violet-400 bg-white px-2 py-1 text-sm text-zinc-900 outline-none dark:border-violet-500/40 dark:bg-[#12121c] dark:text-white"
                                autoFocus
                              />
                            ) : (
                              <>
                                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                  {item.title}
                                </p>
                                {item.preview && (
                                  <p className="mt-0.5 truncate text-xs text-zinc-600 dark:text-zinc-400">
                                    {item.preview}
                                  </p>
                                )}
                                {item.updatedAt && (
                                  <p className="mt-1 text-[10px] text-zinc-600 dark:text-zinc-500">
                                    {formatDistanceToNow(new Date(item.updatedAt), {
                                      addSuffix: true,
                                    })}
                                  </p>
                                )}
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingId(item.sessionId);
                              setRenameValue(item.title);
                            }}
                            className="rounded-lg p-2 text-zinc-400 opacity-0 transition hover:bg-violet-50 hover:text-violet-600 group-hover:opacity-100 dark:hover:bg-white/5 dark:hover:text-violet-300"
                            aria-label="Rename chat"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSession(item.sessionId)}
                            className="rounded-lg p-2 text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            aria-label="Delete chat"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <>
                  <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="chat-scroll relative z-10 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 sm:space-y-5 sm:px-4 sm:py-5"
                  >
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center px-1 pt-8 text-center sm:pt-10">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-md shadow-violet-500/30 sm:mb-5 sm:h-16 sm:w-16 sm:rounded-[20px]">
                          <Bot className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                        </div>
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg dark:text-white">
                          Welcome to CryptoNews AI
                        </h3>
                        <p
                          className="mt-2.5 max-w-[320px] text-[12px] leading-relaxed text-zinc-600 sm:max-w-[360px] sm:text-[13px] dark:text-zinc-400"
                          style={{ fontFamily: 'system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif' }}
                        >
                          Hey! 👋 I can help with crypto news 📰, live prices 📈, and simple explainers 💡. Ask about Bitcoin, Ethereum, market moves, or what a term means — I&apos;ll keep it clear and grounded in CryptoNews.
                        </p>
                        <p className="mb-2 mt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-500">
                          Try asking
                        </p>
                        <div className="grid w-full gap-1.5 sm:gap-2">
                          {suggestedPrompts.map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => handleSend(q)}
                              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-[12px] text-zinc-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-[13px] dark:border-white/8 dark:bg-white/[0.03] dark:shadow-none dark:text-zinc-300 dark:hover:border-violet-400/30 dark:hover:bg-violet-500/10 dark:hover:text-white"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages
                      .filter(
                        (m) => m.role !== "assistant" || Boolean(m.content?.trim())
                      )
                      .map((message, index, visible) => (
                      <ChatMessage
                        key={`${message.role}-${index}-${message.timestamp}`}
                        message={message}
                        onCopy={handleCopy}
                        isStreaming={
                          streaming &&
                          loading &&
                          index === visible.length - 1 &&
                          message.role === "assistant"
                        }
                      />
                    ))}

                    <AnimatePresence mode="wait">
                      {loading &&
                        !messages.some(
                          (m, i) =>
                            i === messages.length - 1 &&
                            m.role === "assistant" &&
                            m.content?.trim()
                        ) && <TypingIndicator key="thinking" />}
                    </AnimatePresence>

                    {error && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        <p>{error}</p>
                        <button
                          type="button"
                          onClick={() => regenerateResponse()}
                          className="mt-2 text-xs font-medium underline underline-offset-2"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {!loading && latestFollowUps.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <p className="px-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-500">
                          Continue with
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {latestFollowUps.map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => handleSend(q)}
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] text-zinc-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800 sm:px-3.5 sm:py-1.5 sm:text-xs dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none dark:text-zinc-300 dark:hover:border-violet-400/35 dark:hover:bg-violet-500/15 dark:hover:text-white"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="relative z-10 shrink-0 border-t border-zinc-200/90 bg-white/80 p-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] backdrop-blur-md dark:border-white/8 dark:bg-[#0c0c14]/90 sm:p-3"
                  >
                    <div className="flex items-end gap-1.5 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-sm focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-200/70 dark:border-white/10 dark:bg-[#161622] dark:shadow-inner dark:focus-within:border-violet-500/35 dark:focus-within:ring-0 dark:focus-within:bg-[#161622]">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Ask anything about crypto…"
                        rows={1}
                        className="max-h-20 min-h-[32px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[12px] leading-5 text-zinc-900 outline-none placeholder:text-zinc-500 sm:min-h-[34px] sm:px-2.5 sm:text-[13px] dark:text-zinc-100 dark:placeholder:text-zinc-500"
                        disabled={loading}
                      />
                      {loading && streaming ? (
                        <button
                          type="button"
                          onClick={stopGenerating}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-400/25 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                          aria-label="Stop generating"
                        >
                          <Square className="h-3 w-3 fill-current" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading || !input.trim()}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md shadow-violet-500/30 transition hover:brightness-110 disabled:opacity-35 dark:shadow-violet-900/30"
                          aria-label="Send message"
                        >
                          {loading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 text-center text-[10px] text-zinc-600 dark:text-zinc-500">
                      CryptoNews AI can make mistakes. Verify important info.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          type="button"
          onClick={() => {
            stickToBottomRef.current = true;
            setOpen(true);
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-[0_12px_40px_-8px_rgba(124,58,237,0.55)] sm:bottom-6 sm:right-6"
          aria-label="Open CryptoNews AI chat"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}
    </>
  );
}
