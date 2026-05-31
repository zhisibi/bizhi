/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Compass, Flame, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}: HeroProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const trendingTags = ["雪山倒影", "赛博街角", "萌猫治愈", "3D流体波纹", "和风二次元", "马尔代夫沙滩"];

  return (
    <div className="relative py-12 md:py-20 overflow-hidden bg-gray-950">
      
      {/* Decorative backdrop gradients */}
      <div className="absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-200">
            全系 4K 高画质壁纸库 • 体验多模态数字感官
          </span>
        </div>

        {/* Big Display Landing Typography */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          让每一次解锁，<br className="sm:hidden" />
          都成为
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            眼球的艺术旅行
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-400 leading-relaxed mb-8">
          精选自然美学、蒸汽未来、赛博朋克与写意二次元创作成作。集成电脑（16:9）、平板（4:3）、手机（9:16）三端精准无损模拟裁剪预览，更有 <b>Gemini 3.5</b> 深度理解你的灵感，一键采集意境美图。
        </p>

        {/* Interactive Advanced Search Panel */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl mb-6">
          <div className="relative flex items-center rounded-2xl border border-gray-800 bg-gray-900/60 p-2 shadow-2xl backdrop-blur-md focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
            <Search className="ml-3 h-5 w-5 text-gray-500" />
            <input
              id="global-wallpaper-search"
              type="text"
              placeholder="搜索任何风格、色系或关键词（例如：'雨夜', '雪山', '治愈'）..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                if (e.target.value === "") {
                  setSearchQuery("");
                }
              }}
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-gray-500 outline-none"
            />
            <button
              id="search-submit-btn"
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <span>采集检索</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Hot Search tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl mx-auto">
          <div className="flex items-center text-xs text-gray-550 mr-1 font-mono text-gray-500 gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
            <span>热搜采集词:</span>
          </div>
          {trendingTags.map((tag) => (
            <button
              id={`trending-tag-${tag}`}
              key={tag}
              type="button"
              onClick={() => {
                setLocalSearch(tag);
                setSearchQuery(tag);
              }}
              className="rounded-full bg-gray-900/80 px-3 py-1 text-xs text-gray-400 border border-gray-800/60 hover:border-indigo-500/40 hover:text-indigo-300 transition-all"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Quick Features strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto border-t border-gray-900 pt-8 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>千款 4K 无损画质精选</span>
          </div>
          <div className="flex items-center justify-center space-x-2 border-y sm:border-y-0 sm:border-x border-gray-900 py-2 sm:py-0">
            <Compass className="h-4 w-4 text-sky-500" />
            <span>三端智能无死角裁剪调试</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 text-fuchsia-500" />
            <span>Gemini AI 灵感意境绘写</span>
          </div>
        </div>

      </div>

      {/* Decorative Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-950 to-transparent" />
    </div>
  );
}
