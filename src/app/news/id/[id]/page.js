"use client";
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from 'next/navigation';
import { FaRedditAlien, FaTelegramPlane } from 'react-icons/fa';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import Sidebar from '@/components/Sidebar';
import ArticleChatBridge from '@/components/ArticleChatBridge';
import parse from "html-react-parser";
import TickerView from '@/components/TickerView';
import { useCurrency } from "@/context/CurrencyContext";

const Page = () => {

  const { currency } = useCurrency();

  const options = {
    replace: (domNode) => {
      if (domNode.name === "ticker-tag") {
        const symbol = domNode.attribs?.["data-symbol"] || "BTC";
        const slug = domNode.attribs?.["data-symbol"] || "bitcoin";
        return <TickerView currency={currency} node={{ attrs: { symbol, slug } }} />;
      }
    },
  };

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const getArticle = async () => {
    setLoading(true);
    let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/article/${id}`, {
      method: 'GET',
      headers: { source: "user" },
    });
    const data = await response.json();
    setArticle(data.Article);
    setTrendingArticles(data.trendingArticles || []);
    setRelatedArticles(data.relatedArticles || []);
    setLoading(false);
  }

  const addView = async () => {
    let viewed = [];

    try {
      const stored = localStorage.getItem("viewedNews");
      if (stored) {
        try {
          viewed = JSON.parse(stored);
          if (!Array.isArray(viewed)) viewed = [];
        } catch (err) {
          console.warn("Failed to parse viewedNews:", err);
          viewed = [];
        }
      }
      if (!viewed.includes(id)) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/article/${id}/view`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "source": "user"
          },
        });
        const data = await response.json();
        if (data.success) {
          viewed.push(id);
          setArticle(data.article)
          localStorage.setItem("viewedNews", JSON.stringify(viewed));
        }
      }
    } catch (error) {
      console.error("Error in addView:", error);
    }
  };

  useEffect(() => {
    if (!id) return;
    getArticle();
    addView();
    try {
      const stored = localStorage.getItem("likedNews");
      if (stored) {
        const likedArticles = JSON.parse(stored);
        if (Array.isArray(likedArticles)) {
          setLiked(likedArticles.includes(id));
        }
      }
    } catch (err) {
      console.warn("Failed to parse likedNews from localStorage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const toggleLike = async () => {
    try {
      const idStr = String(id);

      let likedNews = [];
      const stored = localStorage.getItem("likedNews");
      if (stored) {
        try {
          likedNews = JSON.parse(stored);
          if (!Array.isArray(likedNews)) likedNews = [];
        } catch {
          likedNews = [];
        }
      }

      let action = "like";
      if (likedNews.includes(idStr)) {
        action = "unlike";
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/article/${idStr}/${action}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", source: "user" },
        }
      );

      const data = await response.json();
      if (data.success) {
        setLiked(prev => !prev);
        setArticle(data.article);

        if (action === "like") {
          likedNews.push(idStr);
        } else {
          likedNews = likedNews.filter(item => item !== idStr);
        }
        localStorage.setItem("likedNews", JSON.stringify(likedNews));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const updateShareCount = async (platform) => {
    let sharedArticles = JSON.parse(localStorage.getItem("sharedNews")) || [];
    if (!sharedArticles.includes(id)) {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/article/${id}/${platform}/share`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'source': 'user'
        }
      });
      sharedArticles.push(id);
      localStorage.setItem("sharedNews", JSON.stringify(sharedArticles));
      setShared(true);
    }
  };

  const handleShare = async (e, platform) => {
    e.preventDefault();
    const articleUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/news/id/${article._id}`;
    const articleTitle = article.title || "Check out this article";

    let platformUrl = "";
    if (platform === "telegram") {
      platformUrl = `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
    } else if (platform === "X") {
      platformUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
    } else if (platform === "reddit") {
      platformUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}`;
    } else if (platform === "linkedin") {
      platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    }

    if (platformUrl) {
      window.open(platformUrl, "_blank", "noopener,noreferrer,width=600,height=500");
      await updateShareCount(platform);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8 pt-4 text-zinc-800 sm:pb-10 sm:pt-6 dark:bg-zinc-900 dark:text-zinc-100">
      {loading && (
        <div className="flex h-screen justify-center bg-white p-6 pt-20 dark:bg-zinc-900">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      {!loading && article && (
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-8 lg:px-8">
          <div className="min-w-0 flex-1 overflow-x-hidden">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-lg font-semibold leading-snug sm:text-2xl md:text-3xl sm:leading-tight">
              {article.title}
            </h1>
            <p className="text-sm leading-relaxed text-zinc-700 sm:text-base md:text-lg dark:text-zinc-200">
              {article.summary}
            </p>
            {article.coverImage && (
              <div className="flex">
                <div className="relative w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-zinc-200 sm:rounded-sm sm:shadow-xl dark:ring-zinc-700">
                  <Image
                    src={article.coverImage}
                    alt={article.title || "Article cover"}
                    width={800}
                    height={500}
                    priority
                    className="max-h-[240px] w-full object-cover sm:max-h-[400px] md:max-h-[500px]"
                  />
                  <div className="absolute right-2 top-2 rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:right-4 sm:top-4 sm:px-3 sm:py-1 sm:text-sm">
                    {article.category?.name}
                  </div>
                </div>
              </div>
            )}
            <div className="mx-0 mt-4 mb-4 flex flex-wrap items-center justify-between gap-3 sm:mx-1 sm:mt-8 sm:mb-8 sm:gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 sm:text-sm dark:text-gray-300">
                  <FontAwesomeIcon icon={faEye} className="text-[12px] sm:text-sm" />
                  <span className="font-medium">{article.views}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 sm:text-sm dark:text-gray-300">
                  <button
                    type="button"
                    onClick={toggleLike}
                    className="inline-flex items-center justify-center rounded-full p-0.5 transition-colors hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                    aria-label={liked ? "Unlike article" : "Like article"}
                  >
                    <FontAwesomeIcon
                      icon={liked ? solidHeart : regularHeart}
                      className={`text-base transition-all duration-300 sm:text-lg ${
                        liked ? "scale-105 text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                    />
                  </button>
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {Array.isArray(article.likes) ? article.likes.length : (article.likes || 0)}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={(e) => handleShare(e, "X")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white shadow-sm transition hover:opacity-90 sm:h-10 sm:w-10 sm:rounded-xl"
                  aria-label="Share on X"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="text-sm sm:text-lg" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShare(e, "telegram")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0088cc] text-white shadow-sm transition hover:opacity-90 sm:h-10 sm:w-10 sm:rounded-xl"
                  aria-label="Share on Telegram"
                >
                  <FaTelegramPlane className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShare(e, "reddit")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF4500] text-white shadow-sm transition hover:opacity-90 sm:h-10 sm:w-10 sm:rounded-xl"
                  aria-label="Share on Reddit"
                >
                  <FaRedditAlien className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleShare(e, "linkedin")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0077b5] text-white shadow-sm transition hover:opacity-90 sm:h-10 sm:w-10 sm:rounded-xl"
                  aria-label="Share on LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-sm sm:text-lg" />
                </button>
              </div>
            </div>
            <ArticleChatBridge article={article} />
            <div className="article-body tiptap prose prose-sm max-w-none dark:prose-invert sm:prose-base lg:prose-lg">
              {parse(article.content || "", options)}
            </div>
            <div className="flex flex-wrap gap-1.5 border-y border-zinc-200 py-3 sm:gap-2 sm:py-4 dark:border-zinc-700">
              {(article.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-sm bg-zinc-200 px-2 py-0.5 text-[11px] text-black shadow-sm sm:bg-zinc-300 sm:py-1 sm:text-sm dark:bg-zinc-700 dark:text-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          {relatedArticles.length > 0 && (
            <div className="mt-8 border-t border-zinc-200 pt-6 sm:mt-10 sm:pt-8 dark:border-zinc-800">
              <h2 className="text-lg font-semibold sm:text-2xl">Read More</h2>
              <div className="mt-1.5 h-0.5 w-16 rounded-full bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 sm:mt-2 sm:h-1 sm:w-24" />
              <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
                {relatedArticles.map((related) => (
                  <Link
                    key={related._id}
                    href={`/news/id/${related._id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:border-zinc-300 hover:shadow-md sm:rounded-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none dark:hover:border-zinc-700"
                  >
                    <div className="relative h-40 w-full overflow-hidden sm:h-44">
                      <Image
                        src={related.coverImage || "/images/img.avif"}
                        alt={related.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                      {related.category?.name && (
                        <div className="absolute left-2.5 top-2.5 rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:left-3 sm:top-3 sm:text-xs sm:py-1">
                          {related.category.name}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                      <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-gray-900 group-hover:underline sm:text-base dark:text-gray-100">
                        {related.title}
                      </h3>
                      {related.summary && (
                        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-600 sm:mt-2 sm:text-sm dark:text-gray-400">
                          {related.summary}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 sm:mt-4 sm:text-xs dark:text-gray-400">
                        {related.publishedAt ? (
                          <span>
                            {formatDistanceToNow(new Date(related.publishedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        ) : (
                          <span />
                        )}
                        {typeof related.views === "number" && (
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                            {related.views}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          </div>
          <Sidebar trendingArticles={trendingArticles} />
        </div>
      )}
    </div>
  );
};

export default Page;
