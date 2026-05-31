/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Laptop, Smartphone, Tablet, Clock, Sliders, Eye, EyeOff, LayoutGrid, RotateCcw, Calendar } from "lucide-react";
import { Wallpaper } from "../types";

interface PreviewDeviceProps {
  wallpaper: Wallpaper;
}

type DeviceType = 'desktop' | 'tablet' | 'phone';
type ClockStyle = 'modern' | 'minimal' | 'serif' | 'classic';

export default function PreviewDevice({ wallpaper }: PreviewDeviceProps) {
  const [device, setDevice] = useState<DeviceType>('phone');
  const [clockStyle, setClockStyle] = useState<ClockStyle>('modern');
  const [showIcons, setShowIcons] = useState(true);
  const [dimValue, setDimValue] = useState(0); // 0 to 80% opacity overlay
  const [blurValue, setBlurValue] = useState(0); // 0 to 16px blur
  const [time, setTime] = useState("13:09");
  const [date, setDate] = useState("5月31日 星期日");

  // Keep simulated time updated
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = String(now.getHours()).padStart(2, '0');
      let minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      // Chinese date format
      const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
      const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      setDate(`${months[now.getMonth()]}${now.getDate()}日 ${days[now.getDay()]}`);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Standard high resolution Image with custom proportions adaptivity
  const getSimulatedUrl = () => {
    let w = 1920;
    let h = 1080;
    if (device === 'phone') {
      w = 1080;
      h = 1920;
    } else if (device === 'tablet') {
      w = 1440;
      h = 1080; // 4:3 ratio
    }
    return `https://images.unsplash.com/${wallpaper.photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;
  };

  const resetControls = () => {
    setDimValue(0);
    setBlurValue(0);
    setShowIcons(true);
  };

  // Mock Desktop Icons list
  const desktopIcons = [
    { name: "我的电脑", icon: "📁" },
    { name: "回收站", icon: "🗑️" },
    { name: "Google Chrome", icon: "🌐" },
    { name: "VS Code", icon: "💻" },
    { name: "壁纸创意库", icon: "🎨" }
  ];

  // Mock Phone Apps list
  const phoneIcons = [
    { name: "相机", icon: "📷" },
    { name: "照片", icon: "🖼️" },
    { name: "Safari", icon: "🌐" },
    { name: "音乐", icon: "🎵" },
    { name: "设置", icon: "⚙️" },
    { name: "微信", icon: "💬" },
    { name: "App Store", icon: "🏪" },
    { name: "VS Code Mobile", icon: "👾" }
  ];

  return (
    <div className="rounded-3xl border border-gray-900 bg-gray-950 p-6 md:p-8 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Mock Device Screen Frame */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
          
          {/* Device Type Selectors */}
          <div className="flex rounded-2xl bg-gray-900/60 p-1 mb-6 border border-gray-800">
            <button
              id="device-selector-phone"
              onClick={() => setDevice('phone')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                device === 'phone' ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>智能手机 (9:16)</span>
            </button>
            <button
              id="device-selector-tablet"
              onClick={() => setDevice('tablet')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                device === 'tablet' ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>平板电脑 (4:3)</span>
            </button>
            <button
              id="device-selector-desktop"
              onClick={() => setDevice('desktop')}
              className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                device === 'desktop' ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>电脑桌面 (16:9)</span>
            </button>
          </div>

          {/* Interactive Screen Frame */}
          <div className="relative w-full max-w-sm sm:max-w-md flex items-center justify-center transition-all duration-300">
            
            {/* Phone Bezel */}
            {device === 'phone' && (
              <div className="relative w-[280px] h-[540px] rounded-[40px] border-8 border-gray-800 bg-black shadow-2xl p-2.5 overflow-hidden ring-4 ring-gray-900">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-28 rounded-full bg-black z-30 flex items-center justify-around px-4">
                  <div className="h-1 w-8 rounded-full bg-gray-800" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-900" />
                </div>
                
                {/* Screen Canvas wrapper */}
                <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-gray-900">
                  <img
                    src={getSimulatedUrl()}
                    alt="Mock phone background"
                    className="absolute inset-0 h-full w-full object-cover transition-all"
                    style={{
                      filter: `blur(${blurValue}px)`
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Dim cover */}
                  <div className="absolute inset-0 bg-black" style={{ opacity: dimValue / 100 }} />

                  {/* Lock Screen/Home Screen Overlays */}
                  <div className="absolute inset-x-0 top-12 flex flex-col items-center text-center text-white z-25 drop-shadow-md">
                    <p className="text-xs font-medium tracking-wide opacity-90">{date}</p>
                    <h2 className={`font-display font-light text-4xl mt-1 tracking-tight ${
                      clockStyle === 'serif' ? 'font-serif' : clockStyle === 'mono' ? 'font-mono' : 'font-sans'
                    }`}>
                      {time}
                    </h2>
                  </div>

                  {/* App Icons Overlay */}
                  {showIcons && (
                    <div className="absolute inset-x-4 bottom-14 grid grid-cols-4 gap-y-4 gap-x-2.5 text-center text-white text-[10px] drop-shadow">
                      {phoneIcons.map((app, i) => (
                        <div key={i} className="flex flex-col items-center space-y-1 group/app cursor-pointer">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950/45 border border-white/5 backdrop-blur-sm text-lg hover:scale-115 transition-transform">
                            {app.icon}
                          </div>
                          <span className="line-clamp-1 scale-90 tracking-wide text-white font-medium">{app.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-white/70" />
                </div>
              </div>
            )}

            {/* Tablet Bezel */}
            {device === 'tablet' && (
              <div className="relative w-[340px] h-[453px] rounded-[30px] border-[10px] border-gray-800 bg-black shadow-2xl p-2 overflow-hidden ring-4 ring-gray-900">
                <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-gray-900">
                  <img
                    src={getSimulatedUrl()}
                    alt="Mock tablet background"
                    className="absolute inset-0 h-full w-full object-cover transition-all"
                    style={{
                      filter: `blur(${blurValue}px)`
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black" style={{ opacity: dimValue / 100 }} />

                  {/* Center Time */}
                  <div className="absolute left-6 top-6 flex flex-col text-white drop-shadow-lg text-left pl-2">
                    <h2 className={`font-display text-4xl font-bold tracking-tight ${
                      clockStyle === 'serif' ? 'font-serif' : 'font-sans'
                    }`}>
                      {time}
                    </h2>
                    <p className="text-[10px] opacity-80 uppercase tracking-widest">{date}</p>
                  </div>

                  {/* Icons Grid */}
                  {showIcons && (
                    <div className="absolute inset-x-6 top-24 grid grid-cols-5 gap-4 text-center text-white text-[9px] drop-shadow-sm">
                      {phoneIcons.slice(0, 5).map((app, i) => (
                        <div key={i} className="flex flex-col items-center space-y-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950/50 hover:bg-gray-950/70 border border-white/5 backdrop-blur-sm text-lg transition-all">
                            {app.icon}
                          </div>
                          <span className="text-white/95 font-medium">{app.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom iPad Dock bar */}
                  {showIcons && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-2xl bg-white/10 backdrop-blur-md px-3 py-1.5 flex space-x-3.5 border border-white/10">
                      {["📷", "🎵", "💬", "⚙️", "🌐"].map((emoji, i) => (
                        <div key={i} className="h-7.5 w-7.5 flex items-center justify-center text-sm rounded bg-gray-950/20">
                          {emoji}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Screen Frame */}
            {device === 'desktop' && (
              <div className="flex flex-col items-center w-full max-w-[420px]">
                {/* Screen bezel */}
                <div className="relative w-full aspect-[16/9] rounded-2xl border-6 border-gray-800 bg-black shadow-2xl overflow-hidden ring-4 ring-gray-900">
                  <div className="relative w-full h-full overflow-hidden bg-gray-900">
                    <img
                      src={getSimulatedUrl()}
                      alt="Mock desktop background"
                      className="absolute inset-0 h-full w-full object-cover transition-all"
                      style={{
                        filter: `blur(${blurValue}px)`
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black" style={{ opacity: dimValue / 100 }} />

                    {/* Desktop directory icons */}
                    {showIcons && (
                      <div className="absolute left-4 top-4 flex flex-col space-y-4 text-white text-[8px] drop-shadow text-center">
                        {desktopIcons.map((file, i) => (
                          <div key={i} className="flex flex-col items-center space-y-0.5 w-11">
                            <span className="text-sm">{file.icon}</span>
                            <span className="text-[7px] text-white/95 leading-tight select-none truncate w-full">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom PC Taskbar */}
                    <div className="absolute bottom-0 inset-x-0 h-6 bg-gray-900/70 backdrop-blur-md flex items-center justify-between px-3 text-[8px] text-gray-300 border-t border-white/5">
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-400 font-bold font-mono">⚡ Start</span>
                        <span className="h-3 w-[1px] bg-gray-700" />
                        <div className="flex space-x-1 grayscale opacity-75">
                          <span>🌐</span>
                          <span>📂</span>
                          <span>💻</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 font-mono opacity-85">
                        <span>🔋 100%</span>
                        <span>📶</span>
                        <span>{time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* iMac bottom stand base */}
                <div className="w-16 h-8 bg-gray-850 rounded-b-xl border-x-4 border-b-4 border-gray-800 flex justify-center shadow-lg" />
                <div className="w-28 h-1 bg-gray-750 rounded-full" />
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Smart Calibration Controls Slider Box */}
        <div className="w-full lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-900 pt-6 lg:pt-0 lg:pl-8">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-4">
              <Sliders className="h-4.5 w-4.5" />
              <span className="text-sm font-semibold tracking-wide">高级屏幕实效标定</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              调整下方参数，模拟系统桌面的实际显示效果。例如，设置“模糊”可以体验应用抽屉毛玻璃质感，调高“暗度”测试图标反差与护眼效果。
            </p>

            {/* Slider 1: Dimension Tint dimValue */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-400">暗度遮罩 (Dim Mode)</span>
                <span className="font-mono text-indigo-400">{dimValue}%</span>
              </div>
              <input
                id="dim-value-range"
                type="range"
                min="0"
                max="80"
                value={dimValue}
                onChange={(e) => setDimValue(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none"
              />
            </div>

            {/* Slider 2: Backdrop Blur blurValue */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-400">毛玻璃模糊 (Acrylic Blur)</span>
                <span className="font-mono text-indigo-400">{blurValue}px</span>
              </div>
              <input
                id="blur-value-range"
                type="range"
                min="0"
                max="16"
                value={blurValue}
                onChange={(e) => setBlurValue(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-500 h-1 bg-gray-800 rounded-lg appearance-none"
              />
            </div>

            {/* Clock Typography theme selector */}
            <div className="mb-6">
              <span className="block text-xs font-medium text-gray-400 mb-2">时钟美学字体</span>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-medium">
                <button
                  id="clock-style-modern"
                  onClick={() => setClockStyle('modern')}
                  className={`rounded-lg py-2 border transition-all ${
                    clockStyle === 'modern' ? "bg-indigo-600/10 border-indigo-500 text-indigo-300" : "border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  无衬线现代 (Sans)
                </button>
                <button
                  id="clock-style-serif"
                  onClick={() => setClockStyle('serif')}
                  className={`rounded-lg py-2 border transition-all font-serif ${
                    clockStyle === 'serif' ? "bg-indigo-600/10 border-indigo-500 text-indigo-300" : "border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  典雅衬线 (Serif)
                </button>
              </div>
            </div>

            {/* Toggle Overlay widgets */}
            <div className="space-y-3.5 mb-6">
              <button
                id="toggle-sim-icons-btn"
                onClick={() => setShowIcons(!showIcons)}
                className="w-full flex items-center justify-between rounded-xl bg-gray-900/60 border border-gray-800 px-4 py-2.5 text-xs text-gray-300 hover:text-white transition-all"
              >
                <span className="flex items-center space-x-2">
                  <LayoutGrid className="h-3.5 w-3.5 text-gray-500" />
                  <span>模拟系统 App 图标 & 状态栏</span>
                </span>
                {showIcons ? (
                  <Eye className="h-4 w-4 text-indigo-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-gray-900 pt-5 mt-6">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{wallpaper.id}</span>
            <button
              id="reset-calibrator-btn"
              onClick={resetControls}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-indigo-400 font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>还原设置</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
