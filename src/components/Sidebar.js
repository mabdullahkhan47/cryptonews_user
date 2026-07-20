"use client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { usePlacementAds } from "@/hooks/usePlacementAds";
import AdMedia from "@/components/ads/AdMedia";

const Sidebar = ({ trendingArticles = [], excludeAdIds = [] }) => {
  const { ads, loading: adsLoading } = usePlacementAds("sidebar");

  const sponsoredAds = ads
    .filter((ad) => !excludeAdIds.includes(String(ad._id)))
    .slice(0, 2);

  return (
    <aside className="mt-2 hidden w-full shrink-0 flex-col lg:mt-0 lg:flex lg:w-[360px] lg:self-stretch">
      <div className="flex h-full flex-col border-zinc-200 lg:border-l lg:pl-4 dark:border-zinc-800">
        <section className="shrink-0 space-y-3 pr-1 sm:space-y-4" aria-label="Trending news">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-gray-900 sm:text-xl dark:text-white">
              Trending News
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 sm:text-xs dark:text-amber-300">
              Live
            </span>
          </div>
          <div className="space-y-2.5 sm:space-y-3">
            {trendingArticles.slice(0, 5).map((article) => (
              <article
                key={article._id}
                className="group border-b border-zinc-200 pb-2.5 transition last:border-b-0 sm:pb-3 dark:border-zinc-800"
              >
                <Link href={`/news/id/${article._id}`}>
                  <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-gray-900 transition group-hover:bg-gradient-to-r group-hover:from-blue-800 group-hover:to-purple-800 group-hover:bg-clip-text group-hover:text-transparent sm:text-sm dark:text-gray-100">
                    {article.title}
                  </h3>
                </Link>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500 sm:mt-2 sm:text-xs dark:text-gray-400">
                  <span>
                    {formatDistanceToNow(new Date(article.publishedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faEye} className="text-[10px]" /> {article.views}
                  </span>
                </div>
              </article>
            ))}
            {trendingArticles.length === 0 && (
              <div className="border-b border-zinc-200 pb-3 text-sm text-gray-500 dark:border-zinc-800 dark:text-gray-400">
                No trending stories right now.
              </div>
            )}
          </div>
        </section>

        {(adsLoading || sponsoredAds.length > 0) && (
          <section
            className="mt-8 shrink-0 space-y-3 border-t border-zinc-200 pt-6 pr-1 lg:sticky lg:top-24 lg:self-start dark:border-zinc-800"
            aria-label="Sponsored advertisements"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                Advertisement
              </p>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400">
                Ad
              </span>
            </div>
            <div className="space-y-3">
              {adsLoading && (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                  Loading...
                </div>
              )}

              {!adsLoading &&
                sponsoredAds.map((ad) => (
                  <article
                    key={ad._id}
                    className="group overflow-hidden rounded-xl border border-amber-200/60 bg-white shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none dark:hover:border-zinc-600"
                  >
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="block"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <AdMedia
                          ad={ad}
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 360px"
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                          Sponsored
                        </span>
                      </div>
                      <div className="space-y-2 border-t border-zinc-100 p-4 dark:border-zinc-800">
                        <h3 className="text-[15px] font-semibold leading-snug text-zinc-900 transition group-hover:text-blue-800 dark:text-zinc-100 dark:group-hover:text-amber-400">
                          {ad.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
                          {ad.description}
                        </p>
                        <p className="pt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                          {ad.ctaText || "Learn more"} →
                        </p>
                      </div>
                    </a>
                  </article>
                ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
