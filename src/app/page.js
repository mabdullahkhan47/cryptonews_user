"use client"
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link';
import { usePlacementAds } from '@/hooks/usePlacementAds';
import { interleaveWithAds } from '@/utils/interleaveAds';
import NativeAdGridCard from '@/components/ads/NativeAdGridCard';
import ResponsiveArticleImage from '@/components/ResponsiveArticleImage';
import ReadingTimeBadge from '@/components/ReadingTimeBadge';

const Page = () => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false)
  const { ads: homepageAds } = usePlacementAds('homepage');

  const sideListArticles = articles.slice(1, 5);

  const gridItems = useMemo(
    () => interleaveWithAds(articles.slice(5, 14), homepageAds, { interval: 6, startAfter: 6 }),
    [articles, homepageAds]
  );

  const getArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/trending`,
        {
          method: "GET",
          headers: { source: "user" },
        }
      );
      const data = await response.json();
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);


  return (
    <div className='min-h-screen bg-white dark:bg-zinc-900'>
      {loading && !initialized && (
        <div className="flex justify-center px-4 pb-8 pt-6 sm:px-8 lg:px-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      {initialized && articles.length > 0 && (
        <div className="px-3 pb-10 pt-4 sm:px-8 sm:pt-6 lg:px-12">
          <h2 className="mb-4 text-lg font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-white">
            Top Trending News
          </h2>

          <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none lg:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:gap-8">
              {articles.length > 0 && (
                <div className="w-full lg:w-1/2">
                  <Link href={`/news/id/${articles[0]._id}`} className="group block">
                    <div className="relative h-48 w-full overflow-hidden rounded-xl sm:h-72 lg:h-[380px]">
                      <ResponsiveArticleImage
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        src={articles[0].coverImage || "/images/img.avif"}
                        variants={articles[0].coverImageVariants}
                        alt={articles[0].title}
                        priority
                      />
                      {articles[0].category?.name && (
                        <div className="absolute bottom-2 left-2 rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:bottom-3 sm:left-3 sm:text-xs sm:py-1">
                          {articles[0].category.name}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5 sm:mt-4 sm:gap-2.5">
                      <h2 className="line-clamp-2 text-base font-bold leading-snug text-black sm:text-lg lg:text-xl dark:text-white">
                        {articles[0].title}
                      </h2>
                      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 sm:line-clamp-3 sm:text-sm dark:text-zinc-400">
                        {articles[0].summary}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 sm:text-sm dark:text-zinc-400">
                        <span>
                          {formatDistanceToNow(new Date(articles[0].publishedAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <ReadingTimeBadge minutes={articles[0].minutesRead} />
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faEye} className="text-[10px]" /> {articles[0].views}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="flex w-full flex-col lg:w-1/2">
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {sideListArticles.map((article) => (
                    <li key={article._id} className="py-3 first:pt-0 last:pb-0 sm:py-4">
                      <Link
                        href={`/news/id/${article._id}`}
                        className="group flex items-start gap-3 sm:gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 group-hover:underline sm:text-[15px] lg:text-base dark:text-gray-100">
                            {article.title}
                          </h3>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-500 sm:mt-2 sm:text-xs dark:text-gray-400">
                            <span>
                              {formatDistanceToNow(new Date(article.publishedAt), {
                                addSuffix: true,
                              })}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">·</span>
                            <span className="inline-flex items-center gap-1">
                              <FontAwesomeIcon icon={faEye} className="text-[9px]" /> {article.views}
                            </span>
                            <ReadingTimeBadge minutes={article.minutesRead} compact />
                          </div>
                          {article.category?.name && (
                            <span className="mt-2 inline-flex rounded bg-gradient-to-r from-blue-800 to-purple-800 px-1.5 py-0.5 text-[9px] font-medium text-white sm:px-2 sm:text-[10px]">
                              {article.category.name}
                            </span>
                          )}
                        </div>
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32 lg:h-28 lg:w-36">
                          <ResponsiveArticleImage
                            src={article.coverImage || "/images/img.avif"}
                            variants={article.coverImageVariants}
                            alt={article.title}
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 text-center sm:mt-6">
              <Link
                href={`/news/Latest News`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-800 to-purple-800 px-3.5 py-2 text-xs font-medium text-white shadow-md transition-all duration-300 hover:from-purple-800 hover:to-blue-800 sm:px-4 sm:py-2.5 sm:text-sm"
              >
                <span>See More Trending News</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {gridItems.map((item) =>
              item.type === 'ad' ? (
                <NativeAdGridCard key={item.key} ad={item.data} />
              ) : (
                <Link
                  key={item.data._id}
                  href={`/news/id/${item.data._id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:border-zinc-300 hover:shadow-md sm:rounded-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none dark:hover:border-zinc-700"
                >
                  <div className="relative h-44 w-full overflow-hidden sm:h-52 lg:h-56">
                    <ResponsiveArticleImage
                      src={item.data.coverImage || "/images/img.avif"}
                      variants={item.data.coverImageVariants}
                      alt={item.data.title}
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    {item.data.category?.name && (
                      <div className="absolute left-2.5 top-2.5 inline-flex rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:left-3 sm:top-3 sm:text-xs sm:py-1">
                        {item.data.category.name}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-gray-900 group-hover:underline sm:text-base dark:text-gray-100">
                      {item.data.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-600 sm:mt-2 sm:text-sm dark:text-gray-400">
                      {item.data.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 sm:mt-4 sm:text-xs dark:text-gray-400">
                      <span>
                        {formatDistanceToNow(new Date(item.data.publishedAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <ReadingTimeBadge minutes={item.data.minutesRead} />
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faEye} className="text-[10px]" /> {item.data.views}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
