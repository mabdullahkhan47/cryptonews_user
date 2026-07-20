import AdMedia from "./AdMedia";

const NativeAdListItem = ({ ad }) => (
  <li className="flex w-full flex-col items-stretch gap-3 overflow-hidden rounded-2xl border border-amber-200/70 bg-white p-3 text-left shadow-sm sm:gap-4 md:flex-row md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-zinc-700 dark:bg-zinc-950 md:dark:bg-transparent">
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block w-full shrink-0 md:w-56 lg:w-68"
      aria-label={`Sponsored: ${ad.title}`}
    >
      <div className="relative h-44 w-full overflow-hidden rounded-xl sm:h-48 md:h-40 md:rounded-none lg:h-44">
        <AdMedia
          ad={ad}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div className="absolute bottom-2 right-2 rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:bottom-3 sm:right-3 sm:text-xs sm:py-1">
          Sponsored
        </div>
      </div>
    </a>

    <div className="flex min-w-0 w-full flex-1 flex-col justify-between px-0.5 text-left md:px-0">
      <a href={ad.link} target="_blank" rel="noopener noreferrer sponsored" className="block w-full">
        <h3 className="line-clamp-2 w-full text-left text-[15px] font-semibold leading-snug text-gray-900 hover:underline sm:text-base dark:text-white">
          {ad.title}
        </h3>
      </a>
      <p className="mt-1.5 line-clamp-2 w-full text-left text-xs leading-relaxed text-gray-700 sm:mt-2 sm:text-sm dark:text-zinc-300">
        {ad.description}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-700 sm:mt-3 sm:text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">Promoted</span>
        <span className="hidden text-gray-400 sm:inline">|</span>
        <span className="font-medium text-blue-800 dark:text-purple-300">
          {ad.ctaText || "Learn more"} →
        </span>
      </div>
    </div>
  </li>
);

export default NativeAdListItem;
