"use client";

import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useChatArticle } from "@/context/ChatArticleContext";

const ARTICLE_PROMPTS = [
  { label: "Summarize", prompt: "Summarize this article" },
  { label: "Explain simply", prompt: "Explain in simple words" },
  { label: "Key takeaways", prompt: "What are the key takeaways?" },
  { label: "Market impact", prompt: "How could this affect the market?" },
];

export default function ArticleChatBridge({ article }) {
  const { setArticleContext, setRequestOpen } = useChatArticle();

  useEffect(() => {
    if (!article?._id) {
      setArticleContext(null);
      return undefined;
    }

    setArticleContext({
      articleId: article._id,
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      tags: article.tags,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
    });

    return () => setArticleContext(null);
  }, [article, setArticleContext]);

  const openWithPrompt = (prompt) => {
    setRequestOpen(true);
    window.dispatchEvent(
      new CustomEvent("cryptonews-chat-prompt", { detail: { prompt } })
    );
  };

  if (!article?._id) return null;

  return (
    <div className="my-4 rounded-lg border border-blue-300/70 bg-gradient-to-br from-sky-100 via-blue-50 to-sky-50 p-3 shadow-sm sm:my-6 sm:rounded-xl sm:p-4 md:my-8 md:rounded-2xl md:p-5 dark:border-blue-400/30 dark:from-blue-950/70 dark:via-blue-950/40 dark:to-sky-950/50">
      <div className="flex items-center justify-between gap-2 sm:gap-4 md:items-start">
        <div className="min-w-0 flex-1">
          <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-blue-700 sm:block sm:text-xs dark:text-sky-300">
            CryptoNews AI
          </p>
          <h3 className="text-sm font-semibold leading-tight text-zinc-900 sm:mt-0.5 sm:text-base md:text-lg dark:text-white">
            Ask about this article
          </h3>
          <p className="mt-1 hidden text-xs text-blue-900/60 md:block md:text-sm dark:text-blue-100/55">
            Get summaries, explanations, and follow-ups grounded in this story.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRequestOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:brightness-110 sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs md:rounded-xl md:px-5 md:py-2.5 md:text-sm"
        >
          <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          <span className="sm:hidden">Ask</span>
          <span className="hidden sm:inline">Open assistant</span>
        </button>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-3 sm:flex sm:flex-wrap sm:gap-2 md:mt-4">
        {ARTICLE_PROMPTS.map(({ label, prompt }) => (
          <button
            key={prompt}
            type="button"
            onClick={() => openWithPrompt(prompt)}
            className="rounded-md border border-blue-300/60 bg-white/80 px-2 py-1 text-[10px] leading-tight text-blue-900/80 transition hover:border-blue-400 hover:bg-blue-100 hover:text-blue-800 sm:rounded-full sm:px-3 sm:py-1.5 sm:text-[11px] md:text-xs dark:border-blue-400/25 dark:bg-blue-500/10 dark:text-blue-100 dark:hover:border-blue-400/45 dark:hover:bg-blue-500/20 dark:hover:text-white"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
