/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles, ArrowRight, Palette, Compass, HelpCircle, Loader2, ImagePlus, User2 } from "lucide-react";
import { AIAssistResponse, Wallpaper } from "../types";

interface AIStudioProps {
  onSearchAndNavigate: (searchTerm: string) => void;
  fullWallpapersList: Wallpaper[];
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
}

export default function AIStudio({ onSearchAndNavigate, fullWallpapersList, onSelectWallpaper }: AIStudioProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAssistResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [matchedWallpapers, setMatchedWallpapers] = useState<Wallpaper[]>([]);

  const samplePrompts = [
    "写意的绿色雨叶微距露珠",
    "东京深夜雨后的粉红赛博街角",
    "太空堡垒外的深蓝色母星晨霞",
    "极简奶油风波纹石膏流动"
  ];

  const handleGenerate = async (searchPrompt: string) => {
    if (!searchPrompt.trim()) return;
    setLoading(true);
    setError(null);
    setAiResult(null);
    setMatchedWallpapers([]);

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: searchPrompt })
      });
      
      if (!response.ok) {
        throw new Error("AI 灵感引擎唤醒失败，请稍后重试。");
      }

      const data: AIAssistResponse = await response.json();
      setAiResult(data);

      // Perform a semantic and literal match on fullWallpapersList to find matching resources
      // Match by category, matching keywords, or tags
      const keywords = data.matchingKeywords || [];
      const tags = data.tags || [];
      
      const matched = fullWallpapersList.filter(wall => {
        // Compute hit rate
        const hasKeywordMatch = keywords.some(kw => 
          wall.title.includes(kw) || 
          wall.tags.some(t => t.includes(kw)) ||
          wall.category.includes(kw)
        );
        const hasTagMatch = tags.some(tag => 
          wall.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        return hasKeywordMatch || hasTagMatch;
      });

      // If nothing matched, pick 3 wallpapers from related/adjacent categories
      if (matched.length === 0) {
        // Fallback matching logic: grab random curated or matching any general tag
        setMatchedWallpapers(fullWallpapersList.slice(0, 3));
      } else {
        setMatchedWallpapers(matched.slice(0, 3));
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "未知错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      
      {/* Title block */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 rounded-xl bg-indigo-500/10 px-3 py-1 text-indigo-400 mb-3">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">Gemini 灵感绘色</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3.5xl font-bold tracking-tight text-white mb-2">
          AI 创意画意写本
        </h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          不知道如何搜索？用最细腻的词汇描写您的心境、色调或氛围，Gemini 智能将其扩充并解析为大师级壁纸，并为您跨越分类、秒级检索匹配。
        </p>
      </div>

      {/* Input panel Card container */}
      <div className="rounded-3xl border border-gray-900 bg-gray-950 p-6 shadow-xl mb-10">
        <div className="relative flex flex-col sm:flex-row gap-3">
          <input
            id="ai-prompt-input"
            type="text"
            placeholder="写下你脑海中的画面，例：'璀璨浩瀚的紫金色星云'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-2xl bg-gray-900 border border-gray-800 px-4 py-3.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate(prompt);
            }}
          />
          <button
            id="ai-generate-btn"
            onClick={() => handleGenerate(prompt)}
            disabled={loading || !prompt.trim()}
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white flex items-center justify-center space-x-2 transition-all active:scale-97 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>画意构思中...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>智能绘意检索</span>
              </>
            )}
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-gray-500">试一下快捷意境输入:</span>
          {samplePrompts.map((p, idx) => (
            <button
              id={`ai-sample-prompt-${idx}`}
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(p);
                handleGenerate(p);
              }}
              disabled={loading}
              className="rounded-lg bg-gray-900/60 hover:bg-gray-800 border border-gray-850 border-gray-800/40 text-gray-400 hover:text-indigo-300 px-2.5 py-1 text-xs transition-all disabled:opacity-50"
            >
              📋 {p}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative h-12 w-12 flex items-center justify-center mb-4">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            <Sparkles className="absolute h-5 w-5 text-pink-400 animate-bounce" />
          </div>
          <h3 className="text-base font-bold text-gray-300 mb-1">正在召请 Gemini 艺术灵智...</h3>
          <p className="text-xs text-gray-550 max-w-xs leading-relaxed text-gray-500">
            我们正在利用谷歌前沿 AI 分割分析构图美学、调制定制东方古典美色卡、并检索匹配契合此氛围的数据资源...
          </p>
        </div>
      )}

      {/* Error Output */}
      {error && (
        <div className="rounded-2xl border border-red-900/30 bg-red-900/5 p-4 text-center text-sm text-red-400 mb-8">
          {error}
        </div>
      )}

      {/* Full AI Result Visual Showcase */}
      {aiResult && !loading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Main deconstruction visual card */}
          <div className="rounded-3xl border border-gray-850 border-gray-800/50 bg-gray-900/15 p-6 md:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
            
            {/* Soft decorative color radial orb */}
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Deconstruction text details */}
              <div className="md:col-span-7">
                <h3 className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-2">主轴意境解构</h3>
                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-900/80 mb-6">
                  <p className="text-sm text-gray-350 leading-relaxed italic text-gray-300">
                    “ {aiResult.aestheticAnalysis} ”
                  </p>
                </div>

                <h3 className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">扩充 AI 创意作词提示</h3>
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/30">
                  <p className="text-xs font-mono text-indigo-200 leading-relaxed break-words selection:bg-indigo-400/20">
                    {aiResult.expandedPrompt}
                  </p>
                </div>
              </div>

              {/* Advanced Color Palette generation display */}
              <div className="md:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-pink-400 font-bold uppercase tracking-wider mb-3">
                    <Palette className="h-4 w-4" />
                    <span>东方美学灵感色谱</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {aiResult.colorPalette.map((color, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5 p-2 rounded-xl bg-gray-950 border border-gray-900">
                        <div
                          className="h-8 w-8 rounded-lg shadow-inner shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-200 truncate">{color.name}</p>
                          <p className="text-[10px] font-mono text-gray-500 uppercase">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub Tags recommended by Gemini */}
                <div>
                  <h3 className="text-xs font-mono text-gray-500 font-bold uppercase tracking-wider mb-2">解构生成的标签</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {aiResult.tags.map((tag, i) => (
                      <span key={i} className="rounded-lg bg-gray-900 px-2 py-1 text-[10px] font-medium text-gray-400 border border-gray-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Matches segment */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-6">
              <div className="flex items-center space-x-2">
                <ImagePlus className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">为您智能关联的采集高清壁纸 ({matchedWallpapers.length})</h3>
              </div>
              <p className="text-xs text-gray-550 text-gray-500 font-mono">命中检索词: {aiResult.matchingKeywords?.join(", ")}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {matchedWallpapers.map((wall) => {
                const isVertical = wall.defaultRatio === "9:16";
                const img_w = isVertical ? 360 : 640;
                const img_h = isVertical ? 640 : 360;
                const aspect_wh_css = isVertical ? "aspect-[9/16]" : "aspect-[16/9]";
                const cropUrl = `https://images.unsplash.com/${wall.photoId}?auto=format&fit=crop&w=${img_w}&h=${img_h}&q=80`;

                return (
                  <div
                    id={`ai-match-card-${wall.id}`}
                    key={wall.id}
                    onClick={() => onSelectWallpaper(wall)}
                    className="group rounded-2xl border border-gray-850 border-gray-800/50 bg-gray-950 hover:border-indigo-500/50 transition-all overflow-hidden cursor-pointer"
                  >
                    <div className={`relative overflow-hidden bg-gray-900 ${aspect_wh_css}`}>
                      <img
                        src={cropUrl}
                        alt="Match wall image"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 rounded bg-gray-950/80 px-1.5 py-0.5 text-[9px] font-mono text-gray-400 border border-white/5">
                        {wall.defaultRatio}
                      </span>
                    </div>
                    <div className="p-3.5 border-t border-gray-900">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white line-clamp-1">{wall.title}</span>
                        <span className="text-[10px] text-indigo-400 font-semibold">{wall.category}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 flex items-center">
                        <User2 className="h-2.5 w-2.5 mr-0.5" />
                        <span className="truncate">{wall.credit.name}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <button
                id="ai-goto-gallery-search"
                onClick={() => {
                  if (aiResult.matchingKeywords && aiResult.matchingKeywords.length > 0) {
                    onSearchAndNavigate(aiResult.matchingKeywords[0]);
                  } else {
                    onSearchAndNavigate("");
                  }
                }}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-gray-900 border border-gray-800 px-5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white hover:border-indigo-500 transition-all cursor-pointer"
              >
                <span>在探索大厅中执行多模态过滤搜索</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
