import Link from "next/link";
import { ArrowRight, BookOpen, LineChart, Newspaper } from "lucide-react";

export const metadata = {
  title: "About | CryptoNews",
  description:
    "Learn about CryptoNews, our crypto news coverage, live market data, AI assistant, and glossary.",
};

const cards = [
  {
    icon: Newspaper,
    title: "News coverage",
    description:
      "Trending stories and category feeds for Bitcoin, Ethereum, altcoins, regulation, and markets.",
    href: "/news/Latest News",
    label: "Read latest news",
  },
  {
    icon: LineChart,
    title: "Live market data",
    description:
      "Follow real-time prices from the site ticker and switch currencies while you browse articles.",
    href: "/news/Markets",
    label: "View markets",
  },
  {
    icon: BookOpen,
    title: "AI and glossary",
    description:
      "Ask CryptoNews AI about prices and terms, or look up definitions in the built-in glossary.",
    href: "/glossary",
    label: "Browse glossary",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white px-6 pb-10 pt-4 text-left text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 sm:px-12 sm:pt-6 md:px-16 lg:px-20 xl:px-24">
      <section className="w-full">
        <h1 className="text-lg font-semibold text-black sm:text-2xl md:text-3xl dark:text-white">
          About CryptoNews
        </h1>
        <div className="mt-1.5 h-0.5 w-24 rounded-full bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 sm:mt-2 sm:h-1 sm:w-32" />

        <p className="mt-4 w-full text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:mt-5 sm:text-base sm:leading-8">
          CryptoNews is a crypto news platform built to help you stay informed without getting lost
          in noise. We publish trending stories and category-based coverage across Bitcoin, Ethereum,
          altcoins, blockchain, regulation, and broader market news, so you can quickly find updates
          that matter to you. Alongside our articles, a live price ticker keeps market moves visible
          while you read, and you can switch currencies to view prices in the format you prefer.
          CryptoNews AI is available across the site to answer questions about prices, news, and
          terminology, while our glossary explains common crypto terms in plain language. Whether you
          are checking the latest headline or digging into a specific topic, everything is designed
          to be easy to read on desktop and mobile.
        </p>
      </section>

      <div className="mt-8 w-full sm:mt-10">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, description, href, label }) => (
            <div
              key={title}
              className="flex h-full flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Icon className="h-5 w-5 text-blue-800 dark:text-blue-400" />
              <h2 className="mt-3 text-base font-semibold sm:text-lg">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
              <Link
                href={href}
                className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-800 to-purple-800 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-300 hover:from-purple-800 hover:to-blue-800 sm:text-sm"
              >
                {label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 w-full sm:mt-12">
          <h2 className="text-base font-semibold sm:text-xl">Our approach</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base sm:leading-8">
            We focus on useful coverage over noise. Articles include summaries, tags, and sharing
            options so you can read quickly or go deeper when you want to.
          </p>
          <p className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base sm:leading-8">
            CryptoNews AI is available on every page. On article pages, it can use the story you
            are reading to answer follow-up questions. The site also supports dark mode and works
            well on mobile, so you can stay updated wherever you are.
          </p>
        </div>
      </div>
    </div>
  );
}
