"use client";
import React, { useEffect, useState } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiLitecoin, SiBinance, SiSolana, SiTether, SiRipple, SiCardano } from "react-icons/si";
import { FaDog } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import CurrencySelector from "./CurrencySelector";
import { useCurrency } from "@/context/CurrencyContext";
import useExchangeRates from "@/app/hooks/useExchangeRates";

export default function Ticker() {
  const { currency } = useCurrency();
  const { rates } = useExchangeRates();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CRYPTO_DATA_URL}/api/crypto/top/10`,
          {
            headers: {
              source: "user",
            },
          }
        );
        const data = await response.json();
        if (!cancelled && data.success) {
          setCoins(data.tickers || []);
        }
      } catch (err) {
        console.error("Error fetching ticker:", err);
      } finally {
        if (!cancelled && isInitial) setLoading(false);
      }
    };

    fetchData(true);
    const interval = setInterval(() => fetchData(false), 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [currency]);

  const convertPrice = (usdPrice) => {
    if (!usdPrice) return "--";

    const numericPrice = Number(usdPrice);
    if (isNaN(numericPrice)) return "--";
    let converted = numericPrice;
    if (currency !== "USD" && rates[currency]) {
      converted = numericPrice * rates[currency];
    }
    return converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const renderCoinIcon = (coin) => {
    if (coin?.image) {
      return (
        <img
          src={coin.image}
          alt={`${coin.symbol} logo`}
          className="h-3.5 w-3.5 shrink-0 rounded-full object-cover sm:h-5 sm:w-5"
          loading="lazy"
        />
      );
    }
    return getIcon(coin.symbol);
  };

  const getIcon = (symbol) => {
    const iconClass = "h-3.5 w-3.5 sm:h-5 sm:w-5";
    switch (String(symbol || "").toUpperCase()) {
      case "BTC":
        return <FaBitcoin className={`text-yellow-400 ${iconClass}`} />;
      case "ETH":
        return <FaEthereum className={`text-blue-400 ${iconClass}`} />;
      case "LTC":
        return <SiLitecoin className={`text-gray-400 ${iconClass}`} />;
      case "XRP":
        return <SiRipple className={`text-sky-500 ${iconClass}`} />;
      case "USDT":
        return <SiTether className={`text-green-500 ${iconClass}`} />;
      case "BNB":
        return <SiBinance className={`text-yellow-500 ${iconClass}`} />;
      case "SOL":
        return <SiSolana className={`text-purple-500 ${iconClass}`} />;
      case "USDC":
        return <AiOutlineDollarCircle className={`text-blue-400 ${iconClass}`} />;
      case "DOGE":
        return <FaDog className={`text-yellow-600 ${iconClass}`} />;
      case "TRX":
        return (
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-red-600 sm:h-5 sm:w-5"
            aria-hidden="true"
            role="img"
          >
            <circle cx="16" cy="16" r="14.5" fill="currentColor" />
            <polygon
              points="8.5,7.87 15.43,26.13 25.5,13.54 22.16,10.26"
              fill="#ffffff"
            />
            <polygon
              points="15.43,26.13 17,14.8 22.16,10.26"
              fill="currentColor"
            />
          </svg>
        );
      case "ADA":
        return <SiCardano className={`text-blue-600 ${iconClass}`} />;
      default:
        return <span className="h-3.5 w-3.5 rounded-full bg-gray-400 sm:h-4 sm:w-4" />;
    }
  };

  function currencySymbol(curr) {
    switch (curr) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "PKR":
        return "₨";
      case "INR":
        return "₹";
      case "JPY":
        return "¥";
      case "CNY":
        return "¥";
      case "CAD":
        return "C$";
      case "AUD":
        return "A$";
      case "CHF":
        return "CHF";
      case "AED":
        return "د.إ";
      case "SAR":
        return "﷼";
      case "TRY":
        return "₺";
      case "ZAR":
        return "R";
      default:
        return "$";
    }
  }

  const renderStrip = (suffix = "") => (
    <div
      className="flex shrink-0 items-center text-[11px] text-black sm:text-sm dark:text-white"
      aria-hidden={suffix ? "true" : undefined}
    >
      {coins.map((coin) => (
        <a
          key={`${coin.id}${suffix}`}
          href={coin.coinrankingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 transition hover:bg-zinc-100 sm:gap-2 sm:px-5 sm:py-2 dark:hover:bg-zinc-800"
        >
          {renderCoinIcon(coin)}
          <span className="font-semibold">{coin.symbol}</span>
          <span>
            {currencySymbol(currency)}
            {convertPrice(coin.price)}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span
              className={`font-medium ${
                coin.percent_change_24h > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {coin.percent_change_24h > 0 ? "▲" : "▼"}
            </span>
            <span
              className={`font-medium ${
                coin.percent_change_24h > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {coin.percent_change_24h?.toFixed(2)}%
            </span>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <div className="relative w-full border-b border-zinc-200 bg-white pt-[calc(3rem+env(safe-area-inset-top))] sm:pt-[calc(3.5rem+env(safe-area-inset-top))] dark:border-zinc-700 dark:bg-zinc-900">
      {!loading && coins.length > 0 && (
        <div className="flex items-center">
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="ticker-marquee flex w-max whitespace-nowrap">
              {renderStrip()}
              {renderStrip("-copy")}
            </div>
          </div>
          <CurrencySelector />
        </div>
      )}
    </div>
  );
}
