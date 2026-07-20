"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { usePlacementAds } from "@/hooks/usePlacementAds";
import AdMedia from "@/components/ads/AdMedia";

const TopBarAd = () => {
  const { ads, loading } = usePlacementAds("topbar");
  const [visible, setVisible] = useState(true);

  const ad = ads[0];

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
  };

  if (loading || !visible || !ad) return null;

  return (
    <div
      aria-label="Advertisement"
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-3 pt-1.5 sm:px-4 sm:pt-2"
    >
      <div className="pointer-events-auto w-full max-w-md sm:max-w-2xl">
        <p className="mb-1 text-center text-[8px] font-semibold uppercase tracking-[0.22em] text-zinc-400 sm:mb-1.5 sm:text-[10px] sm:tracking-[0.26em] dark:text-zinc-500">
          Advertisement
        </p>

        <div className="relative">
          <span className="absolute -top-2 right-9 z-20 rounded-full bg-amber-600 px-1.5 py-0.5 text-[8px] font-bold uppercase leading-none tracking-[0.08em] text-white shadow-md sm:-top-2.5 sm:right-11 sm:px-2 sm:text-[9px] sm:tracking-[0.1em] dark:border dark:border-amber-400/30 dark:bg-amber-600/90 dark:shadow-black/30">
            Ad
          </span>

          <a
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center gap-2 overflow-hidden rounded-full border border-amber-200/70 bg-white/95 py-1 pl-1.5 pr-9 shadow-[0_4px_18px_rgba(0,0,0,0.08)] backdrop-blur-sm transition hover:border-amber-300 hover:shadow-[0_6px_24px_rgba(217,119,6,0.12)] sm:gap-3 sm:py-2 sm:pl-2 sm:pr-11 dark:border-zinc-700 dark:bg-zinc-900/95 dark:shadow-[0_2px_16px_rgba(0,0,0,0.45)] dark:hover:border-zinc-600"
          >
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-zinc-200/80 bg-zinc-100 sm:h-10 sm:w-10 dark:border-zinc-600 dark:bg-zinc-800">
              <AdMedia ad={ad} className="object-cover" sizes="40px" />
            </div>

            <div className="min-w-0 flex-1 py-0.5">
              <p className="truncate text-[11px] font-semibold text-zinc-800 transition group-hover:text-amber-700 sm:text-sm dark:text-zinc-100 dark:group-hover:text-amber-400">
                {ad.title}
              </p>
              <p className="truncate text-[10px] text-zinc-500 sm:text-xs dark:text-zinc-400">
                {ad.description}
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss advertisement"
            className="absolute right-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:text-zinc-800 sm:right-2 sm:h-7 sm:w-7 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBarAd;
