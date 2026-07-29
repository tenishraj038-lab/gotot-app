"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Github, User, LogOut, LayoutDashboard, Menu, X, Bell } from "lucide-react";
import { useStore } from "@/lib/store";
import { loadTokens, clearTokens, getAuthToken, api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import LocaleSwitcher from "./LocaleSwitcher";
import { useLocale } from "@/lib/i18n";

function NotificationBell() {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    loadTokens();
    api.getUnreadCount().then((d) => setUnread(d.unread)).catch(() => {});
    const interval = setInterval(() => {
      api.getUnreadCount().then((d) => setUnread(d.unread)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Link href="/notifications" className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200" title="Notifications">
      <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const { t } = useLocale();
  const { isDarkMode, toggleDarkMode, user, setUser, setSubscription, setAuthModalOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("gotot_theme") === "dark";
    if (saved !== isDarkMode) {
      document.documentElement.classList.toggle("dark", saved);
    }
    loadTokens();
    if (getAuthToken()) {
      api.getMe().then(setUser).catch(() => {});
      api.getSubscriptionStatus().then(setSubscription).catch(() => {});
    }
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    setSubscription(null);
    toast.success("Logged out");
    router.push("/");
  };

  const isLoggedIn = user || getAuthToken();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gradient">GoTot</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">API</Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                Features
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/download/tiktok" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">TikTok</Link>
                <Link href="/download/instagram" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Instagram</Link>
                <Link href="/download/twitter" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Twitter/X</Link>
                <Link href="/download/facebook" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Facebook</Link>
                <Link href="/download/reddit" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Reddit</Link>
                <Link href="/download/vimeo" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Vimeo</Link>
                <Link href="/download/twitch" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Twitch</Link>
                <Link href="/download/dailymotion" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Dailymotion</Link>
                <Link href="/download/linkedin" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">LinkedIn</Link>
                <Link href="/download/pinterest" className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">Pinterest</Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-gray-600" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {isLoggedIn ? (
              <>
                <NotificationBell />
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hidden md:block"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/25"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            <button
              className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-800/50">
            <nav className="flex flex-col gap-2">
              <Link href="/" className="px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/pricing" className="px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/download/instagram" className="px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>Instagram</Link>
              <Link href="/download/tiktok" className="px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>TikTok</Link>
              <Link href="/docs" className="px-3 py-2 text-sm font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>API Docs</Link>
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="px-3 py-2 text-sm font-medium rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-3 py-2 text-sm font-medium rounded-xl text-red-600 text-left">Sign Out</button>
                </>
              ) : (
                <Link href="/login" className="px-3 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
