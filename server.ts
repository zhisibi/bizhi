/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY missing in environment variables. AI features may fall back.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Database for curated high-resolution wallpapers utilizing premium Unsplash IDs
// We include photorealistic coordinates, precise color palettes, detailed poetical descriptions, views, etc.
let wallpapersDb = [
  {
    id: "wall-landscape-1",
    title: "迷雾苍翠群山",
    category: "自然风光",
    views: 4209,
    downloads: 1250,
    likes: 384,
    photoId: "photo-1470071459604-3b5ec3a7fe05",
    credit: {
      name: "Lukasz Szmigiel",
      username: "szmigieldesign",
      profileUrl: "https://unsplash.com/@szmigieldesign"
    },
    defaultRatio: "16:9",
    tags: ["山峦", "森林", "晨雾", "绿色", "旭日", "唯美", "清晨"],
    colors: ["#1e291b", "#4a5d4e", "#8da399", "#b9c2b1", "#0d1b15"],
    description: "薄雾初升的茫茫苍山，晨曦柔和洒在针叶林梢上，大自然最宁静清朗的破晓瞬间。"
  },
  {
    id: "wall-landscape-2",
    title: "深秋斑斓小径",
    category: "自然风光",
    views: 3102,
    downloads: 894,
    likes: 219,
    photoId: "photo-1447752875215-b2761acb3c5d",
    credit: {
      name: "Luke Stackpoole",
      username: "withluke",
      profileUrl: "https://unsplash.com/@withluke"
    },
    defaultRatio: "16:9",
    tags: ["秋天", "枫林", "小径", "落叶", "金色", "治愈", "漫步"],
    colors: ["#4a2c11", "#a65d1d", "#d9a05b", "#6b7d5a", "#1a130b"],
    description: "金黄与艳红交织的林间幽径，脚踩落叶沙沙作响，将秋意暖阳化作永恒的桌面风景。"
  },
  {
    id: "wall-landscape-3",
    title: "冰川湖影霞光",
    category: "自然风光",
    views: 5930,
    downloads: 2011,
    likes: 673,
    photoId: "photo-1469474968028-56623f02e42e",
    credit: {
      name: "David Marcu",
      username: "davidmarcu",
      profileUrl: "https://unsplash.com/@davidmarcu"
    },
    defaultRatio: "16:9",
    tags: ["湖泊", "雪山", "红霞", "倒影", "宁静", "壮丽", "冰川"],
    colors: ["#1c2d37", "#445964", "#7b8d96", "#df9571", "#fee4ca"],
    description: "晚霞如火般燃烧在天际，雪山与湖水相映成趣，倒影荡漾中洗涤心灵的都市烦恼。"
  },
  {
    id: "wall-landscape-4",
    title: "林间晨曦破晓",
    category: "自然风光",
    views: 2981,
    downloads: 710,
    likes: 188,
    photoId: "photo-1511497584788-876760111969",
    credit: {
      name: "Sebastian Unrau",
      username: "sebastian_unrau",
      profileUrl: "https://unsplash.com/@sebastian_unrau"
    },
    defaultRatio: "16:9",
    tags: ["松林", "丁达尔", "阳光", "树影", "治愈系", "空气感"],
    colors: ["#131c0e", "#565830", "#adb581", "#e3dfcc", "#2c3321"],
    description: "清风穿过森林，洒下完美的丁达尔光效。置身其间，仿佛能闻到松针与草地的清香。"
  },
  {
    id: "wall-cyber-1",
    title: "赛博霓虹新宿",
    category: "赛博霓虹",
    views: 8904,
    downloads: 3820,
    likes: 1102,
    photoId: "photo-1545239351-ef35f43d514b",
    credit: {
      name: "Alex Knight",
      username: "agkdesign",
      profileUrl: "https://unsplash.com/@agkdesign"
    },
    defaultRatio: "16:9",
    tags: ["霓虹", "雨夜", "未来城市", "反射", "涩谷", "潮流", "朋克"],
    colors: ["#020b14", "#cf035a", "#0da0c4", "#5b1caf", "#16447c"],
    description: "雨夜积水倒映着高饱和度的霓虹招牌，充满未来科幻与高科技低生活的视觉冲击感。"
  },
  {
    id: "wall-cyber-2",
    title: "雨夜迷幻街头",
    category: "赛博霓虹",
    views: 4591,
    downloads: 1421,
    likes: 549,
    photoId: "photo-1515621061946-eff1c2a352bd",
    credit: {
      name: "Sohail Na",
      username: "sohail_7",
      profileUrl: "https://unsplash.com/@sohail_7"
    },
    defaultRatio: "16:9",
    tags: ["街头", "霓虹", "迷幻", "雨水", "出租车", "冷暖对比", "都市"],
    colors: ["#070714", "#d01348", "#22bcca", "#782be1", "#b39fae"],
    description: "青碧色与红紫色的冷暖交汇，让平凡的城市一隅浸透在赛博朋克的电光幻影中。"
  },
  {
    id: "wall-cyber-3",
    title: "复古红蓝街机厅",
    category: "赛博霓虹",
    views: 3810,
    downloads: 1202,
    likes: 471,
    photoId: "photo-1509198397868-475647b2a1e5",
    credit: {
      name: "Carl Raw",
      username: "carldaw",
      profileUrl: "https://unsplash.com/@carldaw"
    },
    defaultRatio: "16:9",
    tags: ["街机", "复古潮", "游戏", "红蓝", "像素", "怀旧", "潮玩"],
    colors: ["#0d0510", "#e10e49", "#1129b0", "#8d169d", "#fff0fa"],
    description: "霓虹氤氲的街机厅，红蓝光影渲染，带你一秒穿越回80年代的蒸汽波幻想。"
  },
  {
    id: "wall-cyber-4",
    title: "云端天际矩阵",
    category: "赛博霓虹",
    views: 6103,
    downloads: 1990,
    likes: 588,
    photoId: "photo-1519501025264-65ba15a82390",
    credit: {
      name: "Sven-Erik Arndt",
      username: "sea_concept",
      profileUrl: "https://unsplash.com/@sea_concept"
    },
    defaultRatio: "16:9",
    tags: ["天际线", "摩天楼", "蓝色", "赛博极客", "高级冷", "秩序"],
    colors: ["#020b1a", "#0f2142", "#2e70b8", "#a6d6fc", "#040911"],
    description: "极具工业几何质感的蓝色摩天大楼矩阵，深邃冷静，极客最爱的桌面上佳构图。"
  },
  {
    id: "wall-space-1",
    title: "恒古银河拱桥",
    category: "星空深空",
    views: 7490,
    downloads: 3120,
    likes: 912,
    photoId: "photo-1419242902214-272b3f66ee7a",
    credit: {
      name: "Vincentiu Solomon",
      username: "vincentiusolomon",
      profileUrl: "https://unsplash.com/@vincentiusolomon"
    },
    defaultRatio: "16:9",
    tags: ["银河", "星海", "夜空", "群山", "巍峨", "科幻", "宇宙"],
    colors: ["#030510", "#0f162c", "#2d3460", "#695982", "#d4bbd5"],
    description: "巍峨山巅上横跨的璀璨银河拱桥，星尘璀璨，记录人类面对宇宙浩瀚时的敬畏之美。"
  },
  {
    id: "wall-space-2",
    title: "深邃梦幻星云",
    category: "星空深空",
    views: 5219,
    downloads: 1730,
    likes: 541,
    photoId: "photo-1506318137071-a8e063b4bec0",
    credit: {
      name: "Alexander Andrews",
      username: "alex_andrews",
      profileUrl: "https://unsplash.com/@alex_andrews"
    },
    defaultRatio: "16:9",
    tags: ["星云", "超新星", "瑰丽", "星空", "紫色", "天体", "唯美"],
    colors: ["#0b0c16", "#281b3d", "#53336d", "#153051", "#dca7c5"],
    description: "星光、紫雾与星际介质谱写的宏伟乐章，绚烂壮丽，仿佛能够触摸深空心跳。"
  },
  {
    id: "wall-space-3",
    title: "蓝色母星黎明",
    category: "星空深空",
    views: 8901,
    downloads: 4031,
    likes: 1205,
    photoId: "photo-1446776811953-b23d57bd21aa",
    credit: {
      name: "NASA",
      username: "nasa",
      profileUrl: "https://unsplash.com/@nasa"
    },
    defaultRatio: "16:9",
    tags: ["地球", "空间站", "大气层", "星河", "蓝色", "高级", "写实"],
    colors: ["#010207", "#0d1f3d", "#235ca2", "#b1cfea", "#070b13"],
    description: "从外太空边缘俯瞰，晨线轻抚深蓝地球的曲线，闪烁着代表生命与未知的微光。"
  },
  {
    id: "wall-minimal-1",
    title: "粉蓝流体波纹",
    category: "极简主义",
    views: 3820,
    downloads: 1109,
    likes: 310,
    photoId: "photo-1618005182384-a83a8bd57fbe",
    credit: {
      name: "Google DeepMind",
      username: "googledeepmind",
      profileUrl: "https://unsplash.com/@googledeepmind"
    },
    defaultRatio: "16:9",
    tags: ["极简", "流线", "3D", "波纹", "莫兰迪", "舒适", "治愈"],
    colors: ["#d9b8b0", "#abb3cc", "#e9ecef", "#8e9aaf", "#4a4e69"],
    description: "温润如玉的3D抽象曲线流体，采用治愈系马卡龙配色，给双眼放个轻柔小假。"
  },
  {
    id: "wall-minimal-2",
    title: "炫酷油墨流动",
    category: "极简主义",
    views: 5201,
    downloads: 1890,
    likes: 622,
    photoId: "photo-1541701494587-cb58502866ab",
    credit: {
      name: "Joel Filipe",
      username: "joelfilipe",
      profileUrl: "https://unsplash.com/@joelfilipe"
    },
    defaultRatio: "16:9",
    tags: ["油墨", "彩色", "流体", "艺术", "色彩斑斓", "高饱和", "抽象"],
    colors: ["#020b12", "#e83162", "#2b10ab", "#00dfaa", "#f7ef42"],
    description: "动态张力十足的斑斓色彩在水面舒展扭转，强烈的现代艺术风情，个性桌面的首选。"
  },
  {
    id: "wall-minimal-3",
    title: "纯净海浪沙滩",
    category: "极简主义",
    views: 4510,
    downloads: 1391,
    likes: 389,
    photoId: "photo-1507525428034-b723cf961d3e",
    credit: {
      name: "Sean Oulashin",
      username: "oulashin",
      profileUrl: "https://unsplash.com/@oulashin"
    },
    defaultRatio: "16:9",
    tags: ["沙滩", "海浪", "纯净", "蔚蓝", "航拍", "日系", "惬意"],
    colors: ["#014f76", "#1ea1cb", "#dff4fc", "#cfbd9c", "#8ca7b5"],
    description: "澄澈如翡翠的海浪缓缓抚平洁白的细沙。无边无际的清爽，让人身临其境感受椰风细浪。"
  },
  {
    id: "wall-anime-1",
    title: "梦幻海边铁轨",
    category: "动漫壁纸",
    views: 9289,
    downloads: 4190,
    likes: 1290,
    photoId: "photo-1534447677768-be436bb09401",
    credit: {
      name: "Kalen Emsley",
      username: "kalenemsley",
      profileUrl: "https://unsplash.com/@kalenemsley"
    },
    defaultRatio: "16:9",
    tags: ["二次元", "新海诚", "海边铁轨", "蓝色", "夏日", "唯美", "梦境"],
    colors: ["#162a45", "#325c8a", "#629bbf", "#a3cbd8", "#dfebed"],
    description: "波平如镜的海面上延展而出的轨道。蔚蓝的天际交汇在终点，静享来自动漫世界的温存与空灵。"
  },
  {
    id: "wall-anime-2",
    title: "霞光云海岫岫",
    category: "动漫壁纸",
    views: 6502,
    downloads: 2311,
    likes: 712,
    photoId: "photo-1478760329108-5c3ed9d495a0",
    credit: {
      name: "Ales Krivec",
      username: "aleskrivec",
      profileUrl: "https://unsplash.com/@aleskrivec"
    },
    defaultRatio: "16:9",
    tags: ["云彩", "夕阳", "橘粉色", "漫画风", "波澜壮阔", "治愈"],
    colors: ["#2d112d", "#601b3a", "#ab4b54", "#e8997a", "#ffeed6"],
    description: "浪漫粉橘调的天空漂浮着蓬松的云朵，像极了大友克洋或宫崎骏动画里的唯美天幕。"
  },
  {
    id: "wall-anime-3",
    title: "密林巫师城堡",
    category: "动漫壁纸",
    views: 5210,
    downloads: 1690,
    likes: 489,
    photoId: "photo-1518709268805-4e9042af9f23",
    credit: {
      name: "Sohail Na",
      username: "sohail_7",
      profileUrl: "https://unsplash.com/@sohail_7"
    },
    defaultRatio: "16:9",
    tags: ["古堡", "魔法", "童话", "绿野仙踪", "清晨", "神秘", "插画"],
    colors: ["#10211d", "#284b43", "#698379", "#becdc4", "#0a100f"],
    description: "高耸云端的神秘古堡，在清晨茂密的森林雾海中若隐若现。带你探寻一封消逝的魔法遗书。"
  },
  {
    id: "wall-cute-1",
    title: "治愈神秘溪流",
    category: "治愈可爱",
    views: 4101,
    downloads: 1390,
    likes: 362,
    photoId: "photo-1513836279014-a89f7a76ae86",
    credit: {
      name: "John Towner",
      username: "john_towner",
      profileUrl: "https://unsplash.com/@john_towner"
    },
    defaultRatio: "9:16",
    tags: ["溪流", "童话", "绿色", "精灵", "清新", "斑驳光影", "水珠"],
    colors: ["#142718", "#385d39", "#82a87d", "#d1edd1", "#09120b"],
    description: "绿溪潺潺，精灵踩过的鹅卵石闪烁着幽光，森林中最舒解焦虑的一湾温凉水色。"
  },
  {
    id: "wall-cute-2",
    title: "慵懒午后暖猫",
    category: "治愈可爱",
    views: 8904,
    downloads: 3291,
    likes: 1201,
    photoId: "photo-1548247416-ec66f4900b2e",
    credit: {
      name: "Paul Hanaoka",
      username: "plhnk",
      profileUrl: "https://unsplash.com/@plhnk"
    },
    defaultRatio: "9:16",
    tags: ["萌宠", "小猫", "毛茸茸", "治愈", "舒适", "阳光", "温暖"],
    colors: ["#2d1d13", "#744b31", "#b98863", "#ede0d4", "#ddb892"],
    description: "晒着金黄色阳光伸懒腰的小猫。粉嫩的鼻尖与暖乎的手感，给你毫无戒备的温馨抚慰。"
  },
  {
    id: "wall-cute-3",
    title: "清润绿罗露珠",
    category: "治愈可爱",
    views: 3106,
    downloads: 911,
    likes: 298,
    photoId: "photo-1518531933037-91b2f5f229cc",
    credit: {
      name: "Aron Visuals",
      username: "aronvisuals",
      profileUrl: "https://unsplash.com/@aronvisuals"
    },
    defaultRatio: "9:16",
    tags: ["露珠", "微距", "护眼", "植物", "晶莹", "绿叶", "雨后"],
    colors: ["#09170e", "#1b3f27", "#4b7f52", "#a3cfab", "#ecf7ed"],
    description: "草叶尖端垂坠的亮晶晶露珠，映照出微缩的碧叶世界，完美保护双眼的纯粹绿色壁纸。"
  },
  {
    id: "wall-cute-4",
    title: "暖意雨窗咖啡馆",
    category: "治愈可爱",
    views: 4902,
    downloads: 1610,
    likes: 543,
    photoId: "photo-1573480813647-552e9b7b5394",
    credit: {
      name: "Zoran Borojevic",
      username: "zoranborojevic",
      profileUrl: "https://unsplash.com/@zoranborojevic"
    },
    defaultRatio: "9:16",
    tags: ["窗户", "雨滴", "咖啡馆", "温暖", "氛围感", "舒适", "冬日"],
    colors: ["#141118", "#3b2a3a", "#7a586e", "#ddb1cb", "#f9ebe2"],
    description: "咖啡馆内烛光摇曳，窗外雨幕婆娑。冷雨与暖香仅凭一窗之隔，满溢怀旧温润的诗意。"
  }
];

// 1. API: Get wallpapers with customizable filtering & searching
app.get("/api/wallpapers", (req, res) => {
  const { category, aspectRatio, search, sort } = req.query;
  let results = [...wallpapersDb];

  if (category && category !== "全部") {
    results = results.filter(w => w.category === category);
  }

  if (aspectRatio) {
    // If we request 16:9, we prioritize landscape wallpapers or return the scaled url
    // Since all Unsplash images can be fetched as both, the frontend will handle appending appropriate w / h attributes.
    // So the aspectRatio parameter allows filtering native default ratios or just general layout hints.
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(w => 
      w.title.toLowerCase().includes(q) || 
      w.description.toLowerCase().includes(q) ||
      w.tags.some(t => t.toLowerCase().includes(q)) ||
      w.category.toLowerCase().includes(q)
    );
  }

  // Sort mechanism
  if (sort === "最新") {
    // Treat ID ending digit or order as chronological
    results.reverse();
  } else if (sort === "热门") {
    results.sort((a, b) => b.views - a.views);
  } else if (sort === "下载") {
    results.sort((a, b) => b.downloads - a.downloads);
  } else if (sort === "点赞") {
    results.sort((a, b) => b.likes - a.likes);
  }

  res.json(results);
});

// 2. API: Increment download count
app.post("/api/wallpapers/:id/download", (req, res) => {
  const { id } = req.params;
  const wallpaper = wallpapersDb.find(w => w.id === id);
  if (wallpaper) {
    wallpaper.downloads += 1;
    wallpaper.views += 11; // simulate passive organic views
    return res.json({ success: true, downloads: wallpaper.downloads });
  }
  res.status(404).json({ error: "Wallpaper not found" });
});

// 3. API: Toggle like count
app.post("/api/wallpapers/:id/like", (req, res) => {
  const { id } = req.params;
  const { liked } = req.body; // boolean
  const wallpaper = wallpapersDb.find(w => w.id === id);
  if (wallpaper) {
    if (liked) {
      wallpaper.likes += 1;
    } else {
      wallpaper.likes = Math.max(0, wallpaper.likes - 1);
    }
    return res.json({ success: true, likes: wallpaper.likes });
  }
  res.status(404).json({ error: "Wallpaper not found" });
});

// 4. API: AI-Powered Wallpaper Artist Expansion (Using Gemini 3.5 Flash)
app.post("/api/ai/suggest", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const promptString = String(prompt).trim();

  try {
    const ai = getGeminiClient();
    
    // Request a structured JSON detailing visual attributes to help construct incredible wallpaper concepts.
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `你是一位殿堂级的壁纸美学大师和AI构图专家。
用户提出了一个壁纸创意构想：\"${promptString}\"

请为用户解析此设想，并拓展为一个极具画面张力的**超高清壁纸描述方案**。
请使用JSON格式返回，包含以下属性：
1. "expandedPrompt": 拓展后的中文专业AI绘画/设计关键词提示词，注重细节描写，包括光影、构图（如：黄金分割、大景深）、画风等。
2. "colorPalette": 包含4-5种符合该意境的色卡组合，每种色卡提供"name"（中文美学色名，如'黛绿', '暮山紫'）和"hex"（标准十六进制颜色代码）。
3. "tags": 6个相关的标签关键词（用于匹配采集分类，如'科幻', '治愈系', '极简'等）。
4. "aestheticAnalysis": 约100字的美学构图讲解与意境评析，语气优美、治愈、富有诗意。
5. "matchingKeywords": 用于在采集数据库中检索的核心中文检索词列表（3个，例如['山峦', '晨曦', '绿色']）。

注意：格式请严格遵循规范的JSON结构，不要包含额外的Markdown标记或代码块包围（只返回纯合法的JSON文本）。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["expandedPrompt", "colorPalette", "tags", "aestheticAnalysis", "matchingKeywords"],
          properties: {
            expandedPrompt: {
              type: Type.STRING,
              description: "Detailed Chinese design prompt expanding on the original input."
            },
            colorPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "hex"],
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING }
                }
              }
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            aestheticAnalysis: {
              type: Type.STRING,
              description: "Beautiful paragraph explaining composition style and visual poetry."
            },
            matchingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 simple search terms to browse database items."
            }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    res.json(data);
  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    // Fallback response if API key is missing or encounters issues
    const fallbacks: Record<string, any> = {
      expandedPrompt: `${promptString} - 高级感3D艺术渲染，浅卡其色与松石绿的清澈碰撞，柔焦大景深，空气丁达尔散射，超高分辨率细节。`,
      colorPalette: [
        { name: "雨林黛绿", hex: "#122a22" },
        { name: "霓虹幻紫", hex: "#4d2375" },
        { name: "晨曦沙金", hex: "#dfb072" },
        { name: "冰川浅碧", hex: "#a4cfcf" }
      ],
      tags: ["AI拓展", "质感设计", "氛围光斑", "艺术", "护眼", "插画"],
      aestheticAnalysis: `围绕“${promptString}”，营造了一种空灵、深邃的极致留白空间。色彩上冷淡与温暖碰撞，带来如风掠过山谷般拂拭双眸的清纯治愈体验，是一帧绝佳的桌面画布。`,
      matchingKeywords: ["绿色", "星空", "治愈"]
    };
    res.json(fallbacks);
  }
});

// Dynamic mounting points
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Handle development with Vite HMR
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Wallpaper Curation Server running on http://localhost:${PORT}`);
  });
}

startServer();
