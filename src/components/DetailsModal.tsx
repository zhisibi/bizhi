/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { X, Heart, Eye, Download, Info, Check, Copy, Palette, Sparkles, AlertCircle, RefreshCw, Layers, Monitor } from "lucide-react";
import { Wallpaper } from "../types";
import PreviewDevice from "./PreviewDevice";

interface DetailsModalProps {
  wallpaper: Wallpaper;
  onClose: () => void;
  isLiked: boolean;
  onLikeToggle: (id: string) => void;
  onDownloadCountIncrement: (id: string, updatedCount: number) => void;
}

type ModalTab = 'view' | 'calibrate' | 'license';
type DownloadState = 'idle' | 'downloading' | 'success' | 'error';

export default function DetailsModal({
  wallpaper,
  onClose,
  isLiked,
  onLikeToggle,
  onDownloadCountIncrement
}: DetailsModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('view');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [selectedResolutionLabel, setSelectedResolutionLabel] = useState<string>("");

  const downloadOptions = [
    { label: "💻 电脑极清 (4K UHD)", width: 3840, height: 2160, ratio: "16:9" },
    { label: "💻 电脑标准 (1080P HD)", width: 1920, height: 1080, ratio: "16:9" },
    { label: "📱 智能手机 (竖格式 Lockscreen)", width: 1080, height: 1920, ratio: "9:16" },
    { label: "📟 平板电脑 (iPad Pro)", width: 2048, height: 1536, ratio: "4:3" }
  ];

  const handleCopyColor = (colorHex: string) => {
    navigator.clipboard.writeText(colorHex);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleDownload = async (option: typeof downloadOptions[0]) => {
    setDownloadState('downloading');
    setSelectedResolutionLabel(option.label);
    
    try {
      // Construct the precise crop API URL supplied by Unsplash
      const downloadImgUrl = `https://images.unsplash.com/${wallpaper.photoId}?auto=format&fit=crop&w=${option.width}&h=${option.height}&q=90`;
      
      const response = await fetch(downloadImgUrl, {
        referrerPolicy: "no-referrer"
      });
      const blob = await response.blob();
      
      const blobUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = `聚光壁纸_${wallpaper.title}_${option.width}x${option.height}.jpg`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(blobUrl);

      // Trigger back-end audit counter
      const auditRes = await fetch(`/api/wallpapers/${wallpaper.id}/download`, {
        method: "POST"
      });
      if (auditRes.ok) {
        const result = await auditRes.json();
        onDownloadCountIncrement(wallpaper.id, result.downloads);
      }

      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 2500);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloadState('error');
      setTimeout(() => setDownloadState('idle'), 3000);
    }
  };

  const getResponsivePreviewUrl = () => {
    const isPortrait = wallpaper.defaultRatio === "9:16";
    const width = isPortrait ? 600 : 1200;
    const height = isPortrait ? 1060 : 675;
    return `https://images.unsplash.com/${wallpaper.photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=90`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      
      {/* Black backdrop glass shield */}
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Lightbox container card structure */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-gray-850 border-gray-800 bg-gray-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header action bar */}
        <div className="flex items-center justify-between border-b border-gray-900 bg-gray-950 px-6 py-4">
          <div className="flex items-center space-x-3">
            <h2 className="font-display text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
              {wallpaper.title}
            </h2>
            <span className="rounded-lg bg-indigo-500/15 border border-indigo-550/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
              {wallpaper.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="like-toggle-modal-btn"
              onClick={() => onLikeToggle(wallpaper.id)}
              className={`rounded-xl p-2.5 transition-all active:scale-95 border ${
                isLiked 
                  ? "bg-pink-600/10 border-pink-500 text-pink-500" 
                  : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isLiked ? "fill-pink-500" : ""}`} />
            </button>
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="rounded-xl bg-gray-900/60 p-2.5 text-gray-400 hover:text-white border border-gray-800/60 transition-all hover:scale-105"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Tab segmented buttons navigation bar */}
        <div className="flex border-b border-gray-900 bg-gray-950/40 px-6">
          <button
            id="tab-selector-view"
            onClick={() => setActiveTab('view')}
            className={`flex items-center space-x-1.5 py-3 text-xs sm:text-sm font-semibold border-b-2 px-3 transition-all ${
              activeTab === 'view' ? "border-indigo-550 border-indigo-550 text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>高清原影画布</span>
          </button>
          <button
            id="tab-selector-calibrate"
            onClick={() => setActiveTab('calibrate')}
            className={`flex items-center space-x-1.5 py-3 text-xs sm:text-sm font-semibold border-b-2 px-3 transition-all ${
              activeTab === 'calibrate' ? "border-indigo-550 border-indigo-550 text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>三端实效标定</span>
          </button>
          <button
            id="tab-selector-license"
            onClick={() => setActiveTab('license')}
            className={`flex items-center space-x-1.5 py-3 text-xs sm:text-sm font-semibold border-b-2 px-3 transition-all ${
              activeTab === 'license' ? "border-indigo-550 border-indigo-550 text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Info className="h-4 w-4" />
            <span>美学释义 & 许可</span>
          </button>
        </div>

        {/* Scrollable Content wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'view' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Photo representation pane */}
              <div className="md:col-span-7 flex flex-col items-center">
                <div className={`relative overflow-hidden rounded-2xl border border-gray-850 border-gray-800 shadow-2xl bg-gray-900 w-full max-w-md ${
                  wallpaper.defaultRatio === "9:16" ? "aspect-[9/16] max-h-[50vh]" : "aspect-[16/10]"
                }`}>
                  <img
                    src={getResponsivePreviewUrl()}
                    alt={wallpaper.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 pt-10 text-white backdrop-blur-[1px] text-xs">
                    <p className="font-semibold">{wallpaper.title}</p>
                    <p className="opacity-80 text-[10px] mt-0.5 italic">{wallpaper.description}</p>
                  </div>
                </div>

                {/* Palette visualizer overlay inside Details */}
                <div className="mt-6 w-full max-w-sm">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-gray-500 mb-2.5">
                    <Palette className="h-3.5 w-3.5" />
                    <span>原图美学主色板 [点击复制代码]</span>
                  </div>
                  <div className="flex rounded-xl overflow-hidden bg-gray-900 border border-gray-800/60 p-1">
                    {wallpaper.colors.map((hex, idx) => (
                      <button
                        id={`palette-copy-btn-${idx}`}
                        key={idx}
                        onClick={() => handleCopyColor(hex)}
                        title={`点击拷贝 ${hex} 代码`}
                        className="flex-1 h-10 group relative transition-transform hover:scale-105 active:scale-95"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/45 text-[9px] font-mono text-white">
                          {copiedColor === hex ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-white/80" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Resolution Downloader controls pane */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">智能无损多规格裁切下载</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    聚光壁纸支持云端裁切，可配合您当前需要适配的终端。选择对应规格后即刻开启无损极速格式下载：
                  </p>
                </div>

                {/* Selection list */}
                <div className="space-y-3">
                  {downloadOptions.map((opt, i) => (
                    <button
                      id={`dn-opt-btn-${i}`}
                      key={i}
                      disabled={downloadState === 'downloading'}
                      onClick={() => handleDownload(opt)}
                      className="w-full flex items-center justify-between bg-gray-900/65 hover:bg-indigo-650/15 hover:bg-indigo-600/10 hover:border-indigo-500/40 border border-gray-800 rounded-2xl p-4 text-left transition-all active:scale-99 disabled:opacity-50 pointer-events-auto"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-gray-200">{opt.label}</p>
                        <p className="text-[10px] font-mono text-gray-500 mt-1">比例: {opt.ratio} • 分辨率: {opt.width} x {opt.height}</p>
                      </div>
                      <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Download className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Live Download Status indicator */}
                {downloadState === 'downloading' && (
                  <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/20 px-4 py-3 text-xs flex items-center space-x-2 text-indigo-300">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>正在无损拉取并切裁：{selectedResolutionLabel}...</span>
                  </div>
                )}

                {downloadState === 'success' && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs flex items-center space-x-2 text-emerald-400">
                    <Check className="h-4 w-4" />
                    <span>下载适配完成！已存盘至本地。</span>
                  </div>
                )}

                {downloadState === 'error' && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>网络裁切下载通道忙碌，请稍后重试。</span>
                  </div>
                )}

                {/* Additional analytics details */}
                <div className="bg-gray-900/30 rounded-xl p-3.5 border border-gray-900 flex justify-around text-center text-xs font-mono text-gray-500">
                  <div>
                    <span className="block text-[10px] uppercase text-gray-600 mb-0.5">热度</span>
                    <span className="text-gray-300 font-bold">{wallpaper.views} 次</span>
                  </div>
                  <div className="border-r border-gray-900" />
                  <div>
                    <span className="block text-[10px] uppercase text-gray-600 mb-0.5">下载度</span>
                    <span className="text-gray-300 font-bold">{wallpaper.downloads} 次</span>
                  </div>
                  <div className="border-r border-gray-900" />
                  <div>
                    <span className="block text-[10px] uppercase text-gray-600 mb-0.5">点赞数</span>
                    <span className="text-gray-300 font-bold">{wallpaper.likes} 箱</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'calibrate' && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <PreviewDevice wallpaper={wallpaper} />
            </div>
          )}

          {activeTab === 'license' && (
            <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
              
              {/* Wallpaper description card */}
              <div className="rounded-2xl border border-gray-850 border-gray-800 bg-gray-900/30 p-6">
                <div className="flex items-center space-x-2 mb-3 text-indigo-400">
                  <Sparkles className="h-4.5 w-4.5" />
                  <h4 className="text-sm font-bold">美学构图讲解</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic border-l-2 border-indigo-550 pl-3">
                  “ {wallpaper.description} ”
                </p>
                
                {/* Wallpaper tags list */}
                <div className="mt-5">
                  <span className="block text-[10px] font-mono text-gray-500 mb-2 uppercase">关联关键词及索引标签:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {wallpaper.tags.map((t, idx) => (
                      <span key={idx} className="rounded-lg bg-gray-950 px-2 py-0.8 text-[10px] text-gray-400 border border-gray-850">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commons License card details */}
              <div className="rounded-2xl border border-gray-850 border-gray-800 bg-gray-900/30 p-6">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">Unsplash 开放式许可协议及致谢</h4>
                
                <div className="flex items-center space-x-3.5 mb-6">
                  <div className="h-10 w-10 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold tracking-tight border border-indigo-500/20 text-sm">
                    UT
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-200">源素材摄影师致鸣谢：{wallpaper.credit.name}</h5>
                    <p className="text-[10px] text-gray-500 mt-1">
                      访问摄影作品主页:{" "}
                      <a href={wallpaper.credit.profileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                        @{wallpaper.credit.username}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 space-y-2 leading-relaxed">
                  <p>
                    本站所收集采集的画册素材皆来自 Unsplash 著名共享画库项目。遵循极其友好的 <b>CC0 与 Unsplash 许可条款</b>：
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[10px] text-gray-500">
                    <li>所有壁纸图像均可免费下载和获取；</li>
                    <li>允许个人和商业摄影重塑用途，无需强制附带许可摄影师署名（但出于诚挚尊重，特此明示）；</li>
                    <li>严禁直接编译、打包为次级同类型壁纸网站进行收费出售转租。</li>
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
