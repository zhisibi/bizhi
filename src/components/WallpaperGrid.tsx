/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Eye, Download, Heart, Tv, ArrowUpDown, Filter, ChevronRight, User2 } from "lucide-react";
import { Wallpaper } from "../types";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  likedWallpapers: Set<string>;
  onLikeToggle: (id: string, e: React.MouseEvent) => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
}

export default function WallpaperGrid({
  wallpapers,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  likedWallpapers,
  onLikeToggle,
  onSelectWallpaper
}: WallpaperGridProps) {
  const sorts = ["最新", "热门", "点赞", "下载"];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      
      {/* Filters and Sorters Panel */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-6">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((category) => (
            <button
              id={`category-filter-btn-${category}`}
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 pointer-events-auto ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-gray-900/60 text-gray-400 border border-gray-805 border-gray-800/40 hover:bg-gray-800/60 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown/Buttons */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center text-xs text-gray-500 space-x-1.5">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>排序方式:</span>
          </div>
          <div className="flex rounded-xl bg-gray-900/60 p-1 border border-gray-800/40">
            {sorts.map((sort) => (
              <button
                id={`sort-btn-${sort}`}
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  sortBy === sort
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid List */}
      {wallpapers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-gray-900 bg-gray-950/40">
          <div className="rounded-full bg-gray-900 p-4 mb-4">
            <Filter className="h-6 w-6 text-gray-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-300 mb-1">未找到匹配壁纸</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            找不到符合您检索条件的壁纸。尝试更换搜索词或重置分类过滤器。
          </p>
          <button
            id="reset-filter-btn"
            onClick={() => {
              setSelectedCategory("全部");
              setSortBy("热门");
            }}
            className="mt-4 rounded-xl bg-indigo-600/20 px-4 py-2 text-xs font-medium text-indigo-400 hover:bg-indigo-600/35 transition-all"
          >
            重置过滤器
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wallpapers.map((wall) => {
            const isLiked = likedWallpapers.has(wall.id);
            // Constructing high-quality unsplash link
            const desktopUrl = `https://images.unsplash.com/${wall.photoId}?auto=format&fit=crop&w=640&h=360&q=80`;
            const mobileUrl = `https://images.unsplash.com/${wall.photoId}?auto=format&fit=crop&w=360&h=640&q=80`;
            const previewImgSrc = wall.defaultRatio === "9:16" ? mobileUrl : desktopUrl;

            return (
              <div
                id={`wallpaper-card-${wall.id}`}
                key={wall.id}
                onClick={() => onSelectWallpaper(wall)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-905 border-gray-800/40 bg-gray-900/10 cursor-pointer shadow-lg hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                
                {/* Photo container */}
                <div className={`relative overflow-hidden bg-gray-950 ${wall.defaultRatio === "9:16" ? "aspect-[9/16]" : "aspect-[16/9]"}`}>
                  <img
                    src={previewImgSrc}
                    alt={wall.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category over-tag */}
                  <span className="absolute top-2.5 left-2.5 rounded-lg bg-gray-950/60 px-2 py-0.8 text-[10px] font-semibold text-gray-300 backdrop-blur-md border border-white/5">
                    {wall.category}
                  </span>

                  {/* Aspect Ratio over-tag */}
                  <span className="absolute top-2.5 right-2.5 rounded-lg bg-gray-950/60 px-1.5 py-0.8 text-[10px] font-mono text-gray-400 backdrop-blur-md border border-white/5">
                    {wall.defaultRatio}
                  </span>

                  {/* Gradient Hover Cover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-xs text-indigo-300 line-clamp-2 leading-relaxed mb-8">
                      {wall.description}
                    </p>
                  </div>

                  {/* Action buttons list on bottom right overlay */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      id={`like-btn-${wall.id}`}
                      onClick={(e) => onLikeToggle(wall.id, e)}
                      title={isLiked ? "取消点赞" : "加入点赞收藏"}
                      className="rounded-lg bg-gray-950/70 p-1.5 text-pink-400 hover:bg-pink-600 hover:text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/5"
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-pink-500 text-pink-500" : ""}`} />
                    </button>
                    <button
                      id={`preview-trigger-${wall.id}`}
                      title="呼出设备模拟裁剪预览"
                      className="rounded-lg bg-gray-950/70 p-1.5 text-indigo-400 hover:bg-indigo-600 hover:text-white backdrop-blur-md transition-all hover:scale-110 border border-white/5"
                    >
                      <Tv className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info Text Area */}
                <div className="flex flex-1 flex-col p-4 bg-gray-950/40 relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {wall.title}
                    </h3>
                    <div className="flex items-center text-[10px] font-mono text-gray-500">
                      <Eye className="mr-0.5 h-3 w-3" />
                      <span>{wall.views >= 1000 ? `${(wall.views / 1000).toFixed(1)}k` : wall.views}</span>
                    </div>
                  </div>

                  {/* Photo credit info */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-900 text-[11px] text-gray-400">
                    <div className="flex items-center space-x-1 text-gray-500 hover:text-gray-300">
                      <User2 className="h-3 w-3" />
                      <span className="line-clamp-1">{wall.credit.name}</span>
                    </div>
                    
                    {/* Compact stats */}
                    <div className="flex items-center space-x-2 font-mono text-[10px]">
                      <div className="flex items-center text-pink-500/70">
                        <Heart className="mr-0.5 h-2.5 w-2.5 fill-pink-500/10" />
                        <span>{wall.likes}</span>
                      </div>
                      <div className="flex items-center text-indigo-500/70">
                        <Download className="mr-0.5 h-2.5 w-2.5" />
                        <span>{wall.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
