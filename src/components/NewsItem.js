import React from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";

const isObjectIdLike = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value.trim());

const NewsItem = ({ article }) => {
  const { searchQuery } = useSearch();

  const publishedTime = article.publishedAt ? new Date(article.publishedAt).getTime() : null;
  const editedTime = article.editedAt ? new Date(article.editedAt).getTime() : null;
  const isUpdated = Boolean(publishedTime && editedTime && editedTime > publishedTime);
  const authorLabel =
    article.author && !isObjectIdLike(article.author) ? article.author : null;
  const categoryName =
    typeof article.category === "string"
      ? null
      : article.category?.name || null;

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const highlighted = String(text || "").replace(
      regex,
      `<span class="bg-yellow-300 dark:bg-teal-600">$1</span>`
    );
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  return (
    <li className="flex w-full flex-col items-stretch gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-sm sm:gap-4 md:flex-row md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-zinc-800 dark:bg-zinc-950 md:dark:bg-transparent">
      <Link href={`/news/id/${article._id}`} className="block w-full shrink-0 md:w-56 lg:w-68">
        <div className="relative h-44 w-full overflow-hidden rounded-xl sm:h-48 md:h-40 md:rounded-none lg:h-44">
          <Image
            src={article.coverImage || "/images/img.avif"}
            alt={article.title || "Article"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {categoryName && (
            <div className="absolute bottom-2 right-2 rounded-md bg-gradient-to-r from-blue-800 to-purple-800 px-2 py-0.5 text-[10px] font-medium text-white shadow sm:bottom-3 sm:right-3 sm:text-xs sm:py-1">
              {categoryName}
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 w-full flex-1 flex-col justify-between px-0.5 text-left md:px-0">
        <Link href={`/news/id/${article._id}`} className="block w-full">
          <h3 className="line-clamp-2 w-full text-left text-[15px] font-semibold leading-snug text-gray-900 hover:underline sm:text-base md:text-md dark:text-white">
            {highlightText(article.title, searchQuery)}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 w-full text-left text-xs leading-relaxed text-gray-700 sm:mt-2 sm:text-sm md:line-clamp-3 dark:text-zinc-300">
          {highlightText(article.summary, searchQuery)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 sm:mt-3 sm:text-sm">
          {article.publishedAt && (
            <span>
              {formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
              })}
            </span>
          )}
          {authorLabel && (
            <>
              <span className="hidden text-gray-400 sm:inline">|</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">
                By {authorLabel}
              </span>
            </>
          )}
        </div>
        {isUpdated && (
          <span className="mt-1 text-[11px] text-gray-500 sm:text-sm">
            Last Updated:{" "}
            {new Date(article.editedAt).toLocaleDateString("en-GB").replace(/\//g, "-")}{" "}
            {new Date(article.editedAt).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 sm:mt-3 sm:gap-3 sm:text-sm dark:text-gray-300">
          <FontAwesomeIcon icon={faEye} className="text-[11px]" />
          <span>{article.views}</span>
        </div>
      </div>
    </li>
  );
};

export default NewsItem;
