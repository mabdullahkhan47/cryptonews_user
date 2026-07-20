import AdMedia from "./AdMedia";

const NativeAdGridCard = ({ ad }) => (
  <a
    href={ad.link}
    target="_blank"
    rel="noopener noreferrer sponsored"
    aria-label={`Sponsored: ${ad.title}`}
    className="group flex flex-col overflow-hidden rounded-xl border border-amber-200/70 bg-white shadow-sm transition duration-300 hover:border-amber-300 hover:shadow-md sm:rounded-2xl dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-none dark:hover:border-zinc-600"
  >
    <div className="relative h-44 w-full overflow-hidden sm:h-52 lg:h-56">
      <AdMedia
        ad={ad}
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <div className="absolute left-2.5 top-2.5 inline-flex rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:left-3 sm:top-3 sm:text-xs sm:py-1">
        Sponsored
      </div>
    </div>
    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
      <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-gray-900 group-hover:underline sm:text-base dark:text-gray-100">
        {ad.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-600 sm:mt-2 sm:text-sm dark:text-gray-400">
        {ad.description}
      </p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 sm:mt-4 sm:text-xs dark:text-gray-400">
        <span>Promoted</span>
        <span className="font-medium text-blue-800 dark:text-purple-300">
          {ad.ctaText || "Learn more"} →
        </span>
      </div>
    </div>
  </a>
);

export default NativeAdGridCard;
