"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMoon,
  faSun,
  faXmark,
  faAngleDown,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { Banknote, BitcoinIcon, BookOpenIcon, Code2, Layers3, Menu, Shield, X } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import LoginModal from "./LoginModal";
import { useSearch } from "@/context/SearchContext";
import { categories } from "@/Data/categories";
import { useCategory } from "@/context/CategoryContext";

const iconMap = {
  LatestNews: (props) => <FontAwesomeIcon icon={faNewspaper} {...props} />,
  Bitcoin: (props) => <BitcoinIcon {...props} />,
  Ethereum: (props) => <FaEthereum {...props} />,
  Altcoins: (props) => <Code2 {...props} />,
  Blockchain: (props) => <Banknote {...props} />,
  Regulations: (props) => <Shield {...props} />,
  Market: (props) => <Layers3 {...props} />,
};

const Navbar = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userToken, setuserToken] = useState(null);
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [modalMode, setModalMode] = useState("login");
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const [showLearnMenu, setShowLearnMenu] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const { setCategory } = useCategory();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
    const handleStorageChange = () => setuserToken(localStorage.getItem("userToken"));
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    }
    if (modal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modal]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const timer = setTimeout(() => mobileSearchRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const openAuth = (mode) => {
    closeMenu();
    setModalMode(mode);
    setModal(true);
  };

  const goCategory = (name) => {
    setCategory(name);
    closeMenu();
    router.push(`/news/${name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setuserToken(null);
  };

  return (
    <div>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto flex h-12 items-center justify-between gap-2 px-3 sm:h-14 sm:gap-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={closeMenu}
            className="shrink-0 text-base font-semibold tracking-tight text-zinc-900 sm:text-xl lg:text-2xl dark:text-white"
          >
            Logo
          </Link>

          {/* Desktop nav */}
          <div className="relative group hidden lg:block">
            <span className="relative cursor-pointer bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-xl font-medium text-zinc-900 transition duration-300 group-hover:text-transparent dark:text-white">
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-800 to-purple-800 transition-all duration-300 ease-in-out group-hover:w-full" />
              News
            </span>
            <div className="invisible absolute -left-10 mt-2 w-48 rounded-lg bg-white text-black opacity-0 shadow-lg transition duration-300 ease-in group-hover:visible group-hover:opacity-100 dark:bg-zinc-900 dark:text-white">
              <ul className="px-2 py-2">
                {categories.map((category) => {
                  const OptionIcon = category.icon ? iconMap[category.icon] : null;
                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-left hover:bg-gradient-to-r hover:from-blue-800 hover:to-purple-800 hover:text-white"
                        onClick={() => goCategory(category.name)}
                      >
                        {OptionIcon && <OptionIcon className="h-5 w-5" />}
                        <span>{category.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="relative group hidden lg:block">
            <span className="relative cursor-pointer bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-xl font-medium text-zinc-900 transition duration-300 group-hover:text-transparent dark:text-white">
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-800 to-purple-800 transition-all duration-300 ease-in-out group-hover:w-full" />
              Learn
            </span>
            <div className="invisible absolute -left-10 mt-2 w-36 rounded-lg bg-white text-black opacity-0 shadow-lg transition duration-300 ease-in group-hover:visible group-hover:opacity-100 dark:bg-zinc-900 dark:text-white">
              <ul className="px-2 py-2">
                <li>
                  <button
                    type="button"
                    onClick={() => router.push("/glossary")}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-left hover:bg-gradient-to-r hover:from-blue-800 hover:to-purple-800 hover:text-white"
                  >
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Glossary</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <Link
            href="/about"
            className="relative hidden bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-xl font-medium text-zinc-900 transition duration-300 hover:text-transparent lg:flex dark:text-white"
          >
            About
          </Link>

          <div className="relative hidden min-w-0 flex-1 lg:block lg:max-w-md xl:max-w-lg">
            <div className="flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-zinc-900 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-600/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
              <FontAwesomeIcon icon={faSearch} className="mr-2 h-4 w-4 text-zinc-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Cryptonews..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center rounded-full bg-gradient-to-r from-zinc-600 to-zinc-900 px-2.5 py-2 text-white dark:from-yellow-500 dark:to-orange-500"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
            {userToken ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-sm font-medium text-white"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-800 to-purple-800 px-3 py-1.5 text-sm font-medium text-white"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("signup")}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-800 to-purple-800 px-3 py-1.5 text-sm font-medium text-white"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  Signup
                </button>
              </>
            )}
          </div>

          {/* Mobile: search · theme · menu */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setSearchOpen((v) => !v);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                searchOpen
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300"
                  : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              <FontAwesomeIcon icon={searchOpen ? faXmark : faSearch} className="text-[12px]" />
            </button>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-zinc-600 to-zinc-900 text-white transition-all dark:from-yellow-500 dark:to-orange-500"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-[12px]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMenuOpen((v) => !v);
              }}
              className={`menu-btn-brand flex h-8 w-8 items-center justify-center rounded-full transition ${
                menuOpen ? "menu-btn-brand-open text-white" : "text-blue-800 dark:text-violet-300"
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-4 w-4" strokeWidth={2.25} /> : <Menu className="h-4 w-4" strokeWidth={2.25} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="border-t border-zinc-100 px-3 py-2 lg:hidden dark:border-zinc-800">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 dark:border-zinc-700 dark:bg-zinc-900">
              <FontAwesomeIcon icon={faSearch} className="text-[11px] text-zinc-400" />
              <input
                ref={mobileSearchRef}
                type="search"
                placeholder="Search…"
                className="w-full bg-transparent text-xs text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-400"
                  aria-label="Clear"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-[11px]" />
                </button>
              ) : null}
            </div>
          </div>
        )}
      </nav>

      {/* Full-screen side menu */}
      <div className="lg:hidden" aria-hidden={!menuOpen}>
        <div
          className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={closeMenu}
        />

        <aside
          className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-none flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-zinc-950 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] dark:border-zinc-800">
            <div>
              <p className="text-base font-semibold text-zinc-900 dark:text-white">Menu</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Browse news & more</p>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {/* News */}
            <div className="mb-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowNewsMenu((v) => !v)}
                className="flex w-full items-center justify-between bg-zinc-50 px-3.5 py-3 text-left dark:bg-zinc-900/70"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">News</span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`text-xs text-zinc-400 transition-transform duration-300 ${
                    showNewsMenu ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <ul
                className={`overflow-hidden bg-white transition-all duration-500 ease-in-out dark:bg-zinc-950 ${
                  showNewsMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {categories.map((category) => {
                  const OptionIcon = iconMap[category.icon];
                  return (
                    <li key={category.id} className="border-t border-zinc-100 dark:border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => goCategory(category.name)}
                        className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[13px] text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        {OptionIcon && (
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-blue-800 dark:from-blue-950/50 dark:to-purple-950/40 dark:text-violet-300">
                            <OptionIcon className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <span className="font-medium">{category.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Learn */}
            <div className="mb-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowLearnMenu((v) => !v)}
                className="flex w-full items-center justify-between bg-zinc-50 px-3.5 py-3 text-left dark:bg-zinc-900/70"
              >
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">Learn</span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`text-xs text-zinc-400 transition-transform duration-300 ${
                    showLearnMenu ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <ul
                className={`overflow-hidden bg-white transition-all duration-500 ease-in-out dark:bg-zinc-950 ${
                  showLearnMenu ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <li className="border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      router.push("/glossary");
                    }}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[13px] text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 text-blue-800 dark:from-blue-950/50 dark:to-purple-950/40 dark:text-violet-300">
                      <BookOpenIcon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium">Glossary</span>
                  </button>
                </li>
              </ul>
            </div>

            <Link
              href="/about"
              onClick={closeMenu}
              className="mb-2 flex items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-sm font-semibold text-zinc-900 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-white dark:hover:border-violet-500/30"
            >
              About
            </Link>
          </div>

          <div className="border-t border-zinc-200 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 dark:border-zinc-800">
            {userToken ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-2.5 text-sm font-semibold text-white"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openAuth("login")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-800 to-purple-800 py-2.5 text-sm font-semibold text-white"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="text-xs" />
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuth("signup")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                  Signup
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <LoginModal
        isOpen={modal}
        onClose={() => setModal(false)}
        mode={modalMode}
        setMode={setModalMode}
      />
    </div>
  );
};

export default Navbar;
