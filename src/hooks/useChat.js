"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChatArticle } from "@/context/ChatArticleContext";

const SESSION_KEY = "cryptonews_chat_session";

function stripEmojis(text = "") {
  return String(text)
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\p{Emoji_Presentation}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/:[a-z0-9_+-]+:/gi, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripFollowUpsDisplay(text = "") {
  return stripEmojis(
    String(text)
      .replace(/\n?---(?:USED_ARTICLES|FOLLOWUPS)---[\s\S]*$/i, "")
      .trim()
  );
}

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json", source: "user" };
  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
  if (token) headers.usertoken = token;
  return headers;
}

export function useChat() {
  const { articleContext } = useChatArticle() || {};
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [historySearch, setHistorySearch] = useState("");
  const abortRef = useRef(null);
  const lastUserMessageRef = useRef("");

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const loadHistory = useCallback(
    async (search = historySearch) => {
      try {
        const query = search?.trim() ? `?q=${encodeURIComponent(search.trim())}` : "";
        const res = await fetch(`${baseUrl}/api/chat/history${query}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) setHistory(data.history || []);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    },
    [baseUrl, historySearch]
  );

  const loadSession = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${baseUrl}/api/chat/${id}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          setSessionId(data.session.sessionId);
          setMessages(
            (data.session.messages || []).map((msg) => ({
              ...msg,
              content:
                msg.role === "assistant"
                  ? stripFollowUpsDisplay(msg.content || "")
                  : msg.content,
              followUpQuestions: (msg.followUpQuestions || []).map(stripEmojis).filter(Boolean),
            }))
          );
          localStorage.setItem(SESSION_KEY, data.session.sessionId);
        }
      } catch (err) {
        console.error("Failed to load session", err);
      }
    },
    [baseUrl]
  );

  const startNewChat = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/chat/new-session`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.session.sessionId);
        setMessages([]);
        localStorage.setItem(SESSION_KEY, data.session.sessionId);
        await loadHistory();
      }
    } catch (err) {
      console.error("Failed to create session", err);
    }
  }, [baseUrl, loadHistory]);

  const deleteSession = useCallback(
    async (id) => {
      try {
        await fetch(`${baseUrl}/api/chat/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
        if (sessionId === id) {
          setSessionId(null);
          setMessages([]);
          localStorage.removeItem(SESSION_KEY);
        }
        await loadHistory();
      } catch (err) {
        console.error("Failed to delete session", err);
      }
    },
    [baseUrl, loadHistory, sessionId]
  );

  const renameSession = useCallback(
    async (id, title) => {
      try {
        const res = await fetch(`${baseUrl}/api/chat/${id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ title }),
        });
        const data = await res.json();
        if (data.success) await loadHistory();
        return data.success;
      } catch (err) {
        console.error("Failed to rename session", err);
        return false;
      }
    },
    [baseUrl, loadHistory]
  );

  const stopGenerating = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (message, { useStream = true, regenerate = false } = {}) => {
      const trimmed = message.trim();
      if (!trimmed || loading) return;

      setError(null);
      setLoading(true);
      setStreaming(useStream);
      lastUserMessageRef.current = trimmed;

      if (!regenerate) {
        const userMessage = {
          role: "user",
          content: trimmed,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);
      } else {
        setMessages((prev) => {
          const next = [...prev];
          if (next[next.length - 1]?.role === "assistant") next.pop();
          return next;
        });
      }

      const assistantPlaceholder = {
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        relatedArticles: [],
        followUpQuestions: [],
      };

      if (!useStream) {
        setMessages((prev) => [...prev, assistantPlaceholder]);
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const body = {
          message: trimmed,
          sessionId,
          stream: useStream,
          regenerate,
          articleContext: articleContext || undefined,
        };

        if (useStream) {
          const res = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
            signal: controller.signal,
          });

          if (!res.ok || !res.body) {
            throw new Error("Chat request failed");
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let fullAnswer = "";
          let relatedArticles = [];
          let followUpQuestions = [];
          let newSessionId = sessionId;
          let targetText = "";
          let displayedText = "";
          let revealRaf = null;
          let assistantStarted = false;

          const paintAssistant = (content) => {
            if (!assistantStarted) {
              assistantStarted = true;
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content,
                  timestamp: new Date().toISOString(),
                  relatedArticles: [],
                  followUpQuestions: [],
                },
              ]);
              return;
            }
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant" && last.content !== content) {
                next[next.length - 1] = { ...last, content };
              }
              return next;
            });
          };

          const revealStep = () => {
            revealRaf = null;
            if (displayedText.length >= targetText.length) return;

            const lag = targetText.length - displayedText.length;
            const step =
              lag > 60 ? Math.ceil(lag * 0.45) : lag > 20 ? 8 : Math.min(lag, 4);
            displayedText = targetText.slice(0, displayedText.length + step);
            paintAssistant(displayedText);

            if (displayedText.length < targetText.length) {
              revealRaf = requestAnimationFrame(revealStep);
            }
          };

          const queueReveal = (raw) => {
            targetText = stripFollowUpsDisplay(raw);
            if (!targetText) return;
            if (revealRaf == null) {
              revealRaf = requestAnimationFrame(revealStep);
            }
          };

          const finishReveal = async () => {
            targetText = stripFollowUpsDisplay(fullAnswer);
            if (!targetText) return;

            await new Promise((resolve) => {
              const start = performance.now();
              const snap = () => {
                if (
                  displayedText.length >= targetText.length ||
                  performance.now() - start > 400
                ) {
                  if (revealRaf != null) cancelAnimationFrame(revealRaf);
                  revealRaf = null;
                  displayedText = targetText;
                  paintAssistant(displayedText);
                  resolve();
                  return;
                }
                const lag = targetText.length - displayedText.length;
                const step = Math.max(6, Math.ceil(lag * 0.35));
                displayedText = targetText.slice(0, displayedText.length + step);
                paintAssistant(displayedText);
                revealRaf = requestAnimationFrame(snap);
              };
              snap();
            });
          };

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const payload = JSON.parse(line.slice(6));

              if (payload.type === "chunk") {
                fullAnswer += payload.chunk;
                queueReveal(fullAnswer);
              }

              if (payload.type === "error") {
                throw new Error(payload.msg || "Chat request failed");
              }

              if (payload.type === "done") {
                fullAnswer = payload.answer || fullAnswer;
                relatedArticles = payload.relatedArticles || [];
                followUpQuestions = payload.followUpQuestions || [];
                newSessionId = payload.sessionId || newSessionId;
              }
            }
          }

          await finishReveal();

          if (newSessionId) {
            setSessionId(newSessionId);
            localStorage.setItem(SESSION_KEY, newSessionId);
          }

          setMessages((prev) => {
            const finalContent = stripFollowUpsDisplay(fullAnswer);
            if (!finalContent) return prev;

            const next = [...prev];
            const last = next[next.length - 1];

            if (last?.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: finalContent,
                relatedArticles,
                followUpQuestions,
              };
              return next;
            }

            return [
              ...next,
              {
                role: "assistant",
                content: finalContent,
                timestamp: new Date().toISOString(),
                relatedArticles,
                followUpQuestions,
              },
            ];
          });
        } else {
          setMessages((prev) => [...prev, assistantPlaceholder]);
          const res = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
            signal: controller.signal,
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.msg || "Chat failed");

          setSessionId(data.sessionId);
          localStorage.setItem(SESSION_KEY, data.sessionId);

          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: stripFollowUpsDisplay(data.answer || ""),
              timestamp: new Date().toISOString(),
              relatedArticles: data.relatedArticles || [],
              followUpQuestions: data.followUpQuestions || [],
            };
            return next;
          });
        }

        await loadHistory();
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong");
        setMessages((prev) =>
          prev.filter((m) => m.content !== "" || m.role !== "assistant")
        );
      } finally {
        abortRef.current = null;
        setLoading(false);
        setStreaming(false);
      }
    },
    [baseUrl, loading, sessionId, loadHistory, articleContext]
  );

  const regenerateResponse = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content || lastUserMessageRef.current;
    if (!text) return;
    await sendMessage(text, { regenerate: true });
  }, [messages, sendMessage]);

  useEffect(() => {
    loadHistory();
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) loadSession(saved);
  }, [loadHistory, loadSession]);

  return {
    sessionId,
    messages,
    history,
    loading,
    streaming,
    error,
    historySearch,
    setHistorySearch,
    articleContext,
    sendMessage,
    startNewChat,
    loadSession,
    deleteSession,
    renameSession,
    loadHistory,
    stopGenerating,
    regenerateResponse,
  };
}
