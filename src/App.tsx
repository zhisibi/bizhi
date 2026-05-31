/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WallpaperGrid from "./components/WallpaperGrid";
import AIStudio from "./components/AIStudio";
import DetailsModal from "./components/DetailsModal";
import { Wallpaper } from "./types";
import { Image, Compass, Flame, ArrowUp, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'ai-studio' | 'likes'>('gallery');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [sortBy, setSortBy] = useState("热门");

  // Liked items persisted in localStorage
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Lightbox selection
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  // Back to top scroll state
  const [showScrollTop, setShowScrollTop] = useState(false);

  const categories = ["全部", "自然风光", "赛博霓虹", "星空深空", "极简主义", "动漫壁纸", "治愈可爱"];

  // Initialize: Load liked IDs from localStorage
  useEffect(() => {
    try {
      const persisted = localStorage.getItem("聚光采集_liked_ids");
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (Array.isArray(parsed)) {
          setLikedIds(new Set<string>(parsed));
        }
      }
    } catch (e) {
      console.error("Failed to load liked ids", e);
    }
  }, []);

  // Sync likes to localStorage
  const persistLikes = (newLikes: Set<string>) => {
    setLikedIds(newLikes);
    try {
      localStorage.setItem("聚光采集_liked_ids", JSON.stringify(Array.from(newLikes)));
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch wallpapers from back-end Express matching dynamic criteria
  const loadWallpapers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy
      });
      const res = await fetch(`/api/wallpapers?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setWallpapers(data);
      }
    } catch (err) {
      console.error("Failed to fetch wallpapers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, [selectedCategory, searchQuery, sortBy]);

  // Back to top indicator handling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle Like Action handler
  const handleLikeToggle = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // prevent opening details popup
    }
    const updated = new Set<string>(likedIds);
    const isNowLiked = !updated.has(id);
    
    if (isNowLiked) {
      updated.add(id);
    } else {
      updated.delete(id);
    }
    persistLikes(updated);

    try {
      // Inform backend server to update statistics
      await fetch(`/api/wallpapers/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liked: isNowLiked })
      });

      // Synchronize state locally inside grid so numbers animate correctly
      setWallpapers(prev => prev.map(w => {
        if (w.id === id) {
          return {
            ...w,
            likes: isNowLiked ? w.likes + 1 : Math.max(0, w.likes - 1)
          };
        }
        return w;
      }));

      // If details modal of that current wallpaper is open, sync that too
      if (selectedWallpaper && selectedWallpaper.id === id) {
        setSelectedWallpaper(prev => prev ? {
          ...prev,
          likes: isNowLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1)
        } : null);
      }

    } catch (err) {
      console.error("Error updating likes count online", err);
    }
  };

  // Increment download audit increments
  const handleDownloadCountIncrement = (id: string, updatedCount: number) => {
    setWallpapers(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, downloads: updatedCount };
      }
      return w;
    }));
    if (selectedWallpaper && selectedWallpaper.id === id) {
      setSelectedWallpaper(prev => prev ? { ...prev, downloads: updatedCount } : null);
    }
  };

  // Navigate back to core search if AI studio recommends a tag
  const handleAIStudioSearchAndNavigate = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setSelectedCategory("全部");
    setActiveTab('gallery');
    // Scroll smoothly to grid list
    const gridElement = document.getElementById("nav-btn-gallery");
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Switch to liked tab wallpapers list
  const getFilteredWallpapers = () => {
    const list = [...wallpapers];
    if (activeTab === 'likes') {
      return list.filter(w => likedIds.has(w.id));
    }
    return list;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 selection:bg-indigo-500/25">
      
      {/* Header bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // clear search query filters on standard tab navigation
          if (tab !== 'gallery') {
            setSelectedCategory("全部");
            setSearchQuery("");
          }
        }}
        favoritesCount={likedIds.size}
      />

      {/* Primary Layout sections switcher */}
      <main className="flex-1">
        {activeTab === 'gallery' && (
          <>
            {/* Interactive Search banner */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            {/* Masonry gallery list core layout with load indicators */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-36">
                <RefreshCw className="h-9 w-9 text-indigo-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-gray-500">正在召请云端采集图谱...</p>
              </div>
            ) : (
              <WallpaperGrid
                wallpapers={getFilteredWallpapers()}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                likedWallpapers={likedIds}
                onLikeToggle={handleLikeToggle}
                onSelectWallpaper={(wall) => setSelectedWallpaper(wall)}
              />
            )}
          </>
        )}

        {/* AI Creative Studio View */}
        {activeTab === 'ai-studio' && (
          <AIStudio
            onSearchAndNavigate={handleAIStudioSearchAndNavigate}
            fullWallpapersList={wallpapers}
            onSelectWallpaper={(wall) => setSelectedWallpaper(wall)}
          />
        )}

        {/* Favourites Likes tab view */}
        {activeTab === 'likes' && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-10 border-b border-gray-900 pb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">我的收藏画册</h2>
              <p className="text-sm text-gray-550 max-w-sm mx-auto text-gray-500 leading-relaxed">
                在这里查看您在浏览过程中点赞收藏的所有品质壁纸资源。记录保留在当前浏览器缓存中。
              </p>
            </div>

            {likedIds.size === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-gray-900 bg-gray-950/40">
                <span className="text-3xl mb-4">🤍</span>
                <h3 className="text-base font-bold text-gray-300">画册空空如也</h3>
                <p className="text-xs text-gray-550 max-w-xs mt-1 text-gray-500">
                  快去探索大厅或者AI画意工坊中点赞采集一些好看的纸片风景吧！
                </p>
                <button
                  id="goto-gallery-from-likes"
                  onClick={() => setActiveTab('gallery')}
                  className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-505 hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
                >
                  去林间大厅转转
                </button>
              </div>
            ) : (
              <WallpaperGrid
                wallpapers={getFilteredWallpapers()}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                likedWallpapers={likedIds}
                onLikeToggle={handleLikeToggle}
                onSelectWallpaper={(wall) => setSelectedWallpaper(wall)}
              />
            )}
          </section>
        )}
      </main>

      {/* Compact layout footer block */}
      <footer className="border-t border-gray-900 bg-gray-950/80 py-8 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-indigo-650/15 text-indigo-400 px-1.5 py-0.5 text-[10px] font-bold border border-indigo-550/10">聚光采集</span>
            <span>© 2026 Core Canvas Studio.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-600">
            <span>京ICP备99882215号</span>
            <span className="hidden sm:inline">•</span>
            <span>CC0与开放图片标准许可协议</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center text-indigo-500/70 shrink-0 select-none">
              <Sparkles className="h-3.5 w-3.5 mr-0.5 animate-pulse" />
              <span>Gemini 3.5 智能赋能</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Lightbox pop up modal loader overlay */}
      {selectedWallpaper && (
        <DetailsModal
          wallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          isLiked={likedIds.has(selectedWallpaper.id)}
          onLikeToggle={() => handleLikeToggle(selectedWallpaper.id)}
          onDownloadCountIncrement={handleDownloadCountIncrement}
        />
      )}

      {/* Back to top float action button */}
      {showScrollTop && (
        <button
          id="back-to-top-fab-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-550 hover:bg-indigo-500 active:scale-90 transition-all border border-indigo-500/10 animate-fade-in-up"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

    </div>
  );
}
