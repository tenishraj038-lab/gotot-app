"use client";

import { ArrowDown, Shield, Zap, Globe, Users, Play, Clock, Download } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLocale();

  const scrollToDownload = () => {
    const el = document.querySelector("section.max-w-6xl");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-transparent to-accent-50/30 dark:from-primary-950/20 dark:via-transparent dark:to-accent-950/10 pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {t.hero.badge}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight animate-slide-up">
          {t.hero.title}
          <br />
          <span className="text-gradient">{t.hero.subtitle}</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {t.hero.description}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            <Shield className="w-4 h-4" />
            {t.hero.noLogin}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
            <Zap className="w-4 h-4" />
            {t.hero.unlimited}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            <Globe className="w-4 h-4" />
            {t.hero.platforms}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
            <Download className="w-4 h-4" />
            {t.hero.mp3And4k}
          </span>
        </div>

        <button
          onClick={scrollToDownload}
          className="mt-14 inline-flex flex-col items-center gap-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors cursor-pointer group"
          aria-label="Scroll to download section"
        >
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Start Downloading</span>
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
}
