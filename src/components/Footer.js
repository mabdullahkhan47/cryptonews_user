import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faTelegram, faLinkedin, faReddit } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100 text-gray-700 dark:border-zinc-800 dark:bg-black dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">CryptoNews</h2>
          <p className="mt-3 text-sm">
            Stay updated with the latest crypto news, trends, and insights from the blockchain world.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-700 dark:hover:text-blue-400">Home</Link></li>
            <li><Link href="/news/Latest News" className="hover:text-blue-700 dark:hover:text-blue-400">News</Link></li>
            <li><Link href="/glossary" className="hover:text-blue-700 dark:hover:text-blue-400">Glossary</Link></li>
            <li><Link href="/about" className="hover:text-blue-700 dark:hover:text-blue-400">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="https://twitter.com" target="_blank" className="hover:text-blue-500">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </Link>
            <Link href="https://t.me" target="_blank" className="hover:text-sky-400">
              <FontAwesomeIcon icon={faTelegram} size="lg" />
            </Link>
            <Link href="https://www.linkedin.com" target="_blank" className="hover:text-blue-700">
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </Link>
            <Link href="https://www.reddit.com" target="_blank" className="hover:text-orange-600">
              <FontAwesomeIcon icon={faReddit} size="lg" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} CryptoNews. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
