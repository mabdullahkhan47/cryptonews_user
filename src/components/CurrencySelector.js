import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencySelector() {

    const { currency, setCurrency } = useCurrency();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currencies = [
        { value: "USD", label: "US Dollar", country: "US" },
        { value: "EUR", label: "Euro", country: "EU" },
        { value: "GBP", label: "British Pound", country: "GB" },
        { value: "PKR", label: "Pakistani Rupee", country: "PK" },
        { value: "INR", label: "Indian Rupee", country: "IN" },
        { value: "JPY", label: "Japanese Yen", country: "JP" },
        { value: "CNY", label: "Chinese Yuan", country: "CN" },
        { value: "CAD", label: "Canadian Dollar", country: "CA" },
        { value: "AUD", label: "Australian Dollar", country: "AU" },
        { value: "CHF", label: "Swiss Franc", country: "CH" },
        { value: "AED", label: "UAE Dirham", country: "AE" },
        { value: "SAR", label: "Saudi Riyal", country: "SA" },
        { value: "TRY", label: "Turkish Lira", country: "TR" },
        { value: "ZAR", label: "South African Rand", country: "ZA" },
    ];

    const selected = currencies.find((c) => c.value === currency) || currencies[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!dropdownRef.current) return;

            if (dropdownRef.current.contains(e.target)) return;
            const clickedScrollbar =
                window.innerWidth - e.clientX <= 16 || 
                window.innerHeight - e.clientY <= 16;  

            if (clickedScrollbar) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-10 shrink-0 border-l border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex cursor-pointer items-center justify-center gap-1 px-2 py-1.5 transition-all duration-200 sm:w-26 sm:justify-between sm:gap-2 sm:px-3 sm:py-2"
                >
                    <div className="flex items-center gap-1 sm:gap-2">
                        <ReactCountryFlag
                            countryCode={selected.country}
                            svg
                            style={{
                                width: "1.15em",
                                height: "0.85em",
                                borderRadius: "50%",
                            }}
                        />
                        <span className="text-[11px] font-medium leading-none text-gray-900 sm:text-sm dark:text-gray-100">
                            {selected.value}
                        </span>
                    </div>
                    <ChevronDown
                        size={14}
                        className={`hidden shrink-0 text-gray-600 transition-transform sm:block dark:text-gray-400 ${open ? "rotate-180" : ""}`}
                    />
                </button>
                {open && (
                    <div className="absolute right-0 z-20 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-1 shadow-lg animate-in fade-in slide-in-from-top-2 sm:w-68 dark:border-zinc-700 dark:bg-zinc-900">
                        {currencies.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                    setCurrency(item.value);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-black transition hover:bg-gradient-to-r hover:from-blue-800 hover:to-purple-800 hover:text-white sm:px-3 dark:text-white"
                            >
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <ReactCountryFlag
                                        countryCode={item.country}
                                        svg
                                        style={{ width: "1.75em", height: "1.25em", borderRadius: "50%" }}
                                    />
                                    <div className="flex items-center gap-2 sm:gap-4">
                                        <span className="text-xs font-medium sm:text-sm">{item.value}</span>
                                        <span className="text-[10px] sm:text-xs">{item.label}</span>
                                    </div>
                                </div>
                                {item.value === currency && (
                                    <Check className="text-blue-500 dark:text-blue-400" size={14} />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
