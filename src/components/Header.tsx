/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles, Image as ImageIcon, Heart, Monitor, Download, Compass } from "lucide-react";

interface HeaderProps {
  activeTab: 'gallery' | 'ai-studio' | 'likes';
  setActiveTab: (tab: 'gallery' | 'ai-studio' | 'likes') => void;
  favoritesCount: number;
}

export default function Header({ activeTab, setActiveTab, favoritesCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('gallery')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-950">
              <Compass className="h-5 w-5 text-indigo-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-200 bg-clip-text text-transparent">
              聚光壁纸
            </span>
            <span className="ml-1.5 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
              HD Studio
            </span>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <nav className="flex items-center space-x-1.5 sm:space-x-3">
          <button
            id="nav-btn-gallery"
            onClick={() => setActiveTab('gallery')}
            className={`group relative flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeTab === 'gallery'
                ? 'bg-gray-800/80 text-white shadow-inner shadow-gray-700/50'
                : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'
            }`}
          >
            <ImageIcon className={`h-3.5 w-3.5 ${activeTab === 'gallery' ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
            <span>探索大厅</span>
            {activeTab === 'gallery' && (
              <span className="absolute -bottom-[9px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-indigo-500" />
            )}
          </button>

          <button
            id="nav-btn-ai-studio"
            onClick={() => setActiveTab('ai-studio')}
            className={`group relative flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeTab === 'ai-studio'
                ? 'bg-gradient-to-r from-indigo-550 to-purple-650 bg-indigo-600/25 text-indigo-200 shadow-inner'
                : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${activeTab === 'ai-studio' ? 'text-indigo-300 animate-pulse' : 'text-gray-500 group-hover:text-amber-400'}`} />
            <span className="bg-gradient-to-r group-hover:from-indigo-200 group-hover:to-pink-200 bg-clip-text">AI 创意工坊</span>
            {activeTab === 'ai-studio' && (
              <span className="absolute -bottom-[9px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
            )}
          </button>

          <button
            id="nav-btn-likes"
            onClick={() => setActiveTab('likes')}
            className={`group relative flex items-center space-x-1.5 rounded-lg px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
              activeTab === 'likes'
                ? 'bg-gray-800/80 text-white shadow-inner shadow-gray-700/50'
                : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 ${activeTab === 'likes' ? 'fill-pink-500 text-pink-500' : 'text-gray-500 group-hover:text-pink-400'}`} />
            <span>我的收藏</span>
            {favoritesCount > 0 && (
              <span className="ml-1 rounded-full bg-pink-550 bg-pink-600 px-1.5 py-0.2 text-[10px] font-mono font-bold text-white">
                {favoritesCount}
              </span>
            )}
            {activeTab === 'likes' && (
              <span className="absolute -bottom-[9px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-pink-500" />
            )}
          </button>
        </nav>

        {/* Right Side Info */}
        <div className="hidden md:flex items-center space-x-3 text-xs text-gray-500 font-mono">
          <Monitor className="h-4 w-4 text-gray-600" />
          <span>支持 PC / 平板 / 手机</span>
        </div>

      </div>
    </header>
  );
}
