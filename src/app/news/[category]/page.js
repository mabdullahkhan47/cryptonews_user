"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useSearch } from "@/context/SearchContext";
import { useCategory } from "@/context/CategoryContext";
import { useParams } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import NewsItem from "@/components/NewsItem";
import Sidebar from "@/components/Sidebar";
import { usePlacementAds } from "@/hooks/usePlacementAds";
import { interleaveWithAds } from "@/utils/interleaveAds";
import NativeAdListItem from "@/components/ads/NativeAdListItem";

const Page = () => {
    const { searchQuery } = useSearch();
    const { category, setCategory } = useCategory();
    const params = useParams();
    const headingRef = useRef(null);
    const [lineWidth, setLineWidth] = useState(0);

    const [articles, setArticles] = useState([]);
    const [displayArticles, setDisplayArticles] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [trendingArticles, setTrendingArticles] = useState([]);
    const limit = 10;
    const { ads: feedAds } = usePlacementAds('article_feed');

    const activeCategory = decodeURIComponent(params?.category || "") || category || "Latest News";

    const getArticles = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL
                }/api/articles/?category=${encodeURIComponent(activeCategory)}`,
                {
                    method: "GET",
                    headers: { source: "user" },
                }
            );
            const data = await response.json();
            if (data.success) {
                setArticles(data.articles || []);
                setTrendingArticles(data.trendingArticles || []);
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
            setArticles([]);
            setTrendingArticles([]);
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    };

    useEffect(() => {
        getArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);

    useEffect(() => {
        if (activeCategory && category !== activeCategory) {
            setCategory(activeCategory);
        }
    }, [activeCategory, category, setCategory]);

    useEffect(() => {
        if (headingRef.current) {
            setLineWidth(headingRef.current.offsetWidth);
        }
    }, [activeCategory]);

    const filtered = useMemo(() => {
        const q = (searchQuery || "").toLowerCase();
        let list = articles;
        if (q) {
            list = list.filter((a) => {
                const titleMatch = a.title?.toLowerCase().includes(q);
                const summaryMatch = a.summary?.toLowerCase().includes(q);
                return titleMatch || summaryMatch;
            });
        }
        return list;
    }, [articles, searchQuery]);

    useEffect(() => {
        setDisplayArticles(filtered.slice(0, limit));
        setHasMore(filtered.length > limit);
    }, [filtered, limit]);

    const handleShowMore = () => {
        setDisplayArticles((prev) => {
            const next = filtered.slice(prev.length, prev.length + limit);
            const combined = [...prev, ...next];
            setHasMore(combined.length < filtered.length);
            return combined;
        });
    }

    const handleShowLess = () => {
        setDisplayArticles(filtered.slice(0, limit));
        setHasMore(true);
    }

    const feedItems = useMemo(() => {
        if (searchQuery?.trim()) {
            return displayArticles.map((article) => ({ type: 'article', data: article }));
        }
        return interleaveWithAds(displayArticles, feedAds, { interval: 5, startAfter: 5 });
    }, [displayArticles, feedAds, searchQuery]);

    return (
        <div className="bg-white dark:bg-zinc-900 min-h-screen">
            {loading && !initialized && <div className="flex justify-center pt-20 p-6">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>}
            {!loading && initialized && displayArticles.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-20 bg-white dark:bg-zinc-900 h-screen text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        No Articles Found
                    </h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
                        We couldn’t find any articles matching your request. Try adjusting your
                        filters or search again.
                    </p>
                </div>
            )}
            {initialized && displayArticles.length > 0 && (
              <div className="flex flex-col gap-5 px-3 pt-4 sm:gap-8 sm:px-6 sm:pt-6 lg:flex-row lg:items-stretch lg:justify-between lg:px-10">
                <div className="min-w-0 w-full px-0 sm:px-4 md:px-8 lg:max-w-2/3 lg:px-2 xl:px-2">
                    <div className="mb-3 sm:mb-6">
                        <h1 ref={headingRef} className="text-lg font-semibold text-black sm:text-2xl md:text-3xl dark:text-white">
                            Latest {activeCategory !== "Latest News" && activeCategory} News
                        </h1>
                        <div style={{ width: `${Math.max(lineWidth, 80)}px` }} className="mt-1.5 h-0.5 rounded-full bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 sm:mt-2 sm:h-1"></div>
                    </div>
                    <ul className="flex w-full flex-col gap-5 sm:gap-6 md:gap-8">
                        {feedItems.map((item) =>
                            item.type === 'ad' ? (
                                <NativeAdListItem key={item.key} ad={item.data} />
                            ) : (
                                <NewsItem key={item.data._id} article={item.data} />
                            )
                        )}
                    </ul>
                    <div className="mb-10 mt-6 flex items-center justify-center sm:mb-12 sm:mt-8 lg:mr-20 lg:justify-end">
                        <button
                          type="button"
                          onClick={hasMore ? handleShowMore : handleShowLess}
                          className="flex cursor-pointer items-center gap-1 rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-medium text-black shadow-md hover:bg-zinc-300 sm:px-3 sm:py-2 sm:text-sm dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                        >
                            <span>Show {hasMore ? 'more' : 'less'}</span>
                            {hasMore ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                        </button>
                    </div>
                </div>
                <Sidebar trendingArticles={trendingArticles} />
              </div>
            )}
        </div>
    );
};

export default Page;
