"use client";

import { ArrowDown, Shield, Zap, Globe, Users } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLocale();

  const scrollToDownload = () => {
    const el = document.querySelector("section.max-w-6xl");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 dark:to-transparent pointer-events-none" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
              {t.hero.badge}
            </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
          {t.hero.title}
          <br />
          <span className="text-gradient">{t.hero.subtitle}</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t.hero.description}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-500" />
            {t.hero.noLogin}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            {t.hero.unlimited}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary-500" />
            {t.hero.platforms}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-500" />
            {t.hero.mp3And4k}
          </span>
        </div>

        <button
          onClick={scrollToDownload}
          className="mt-12 inline-flex flex-col items-center gap-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors cursor-pointer group"
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
