var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("\u26A0\uFE0F GEMINI_API_KEY missing in environment variables. AI features may fall back.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var wallpapersDb = [
  {
    id: "wall-landscape-1",
    title: "\u8FF7\u96FE\u82CD\u7FE0\u7FA4\u5C71",
    category: "\u81EA\u7136\u98CE\u5149",
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
    tags: ["\u5C71\u5CE6", "\u68EE\u6797", "\u6668\u96FE", "\u7EFF\u8272", "\u65ED\u65E5", "\u552F\u7F8E", "\u6E05\u6668"],
    colors: ["#1e291b", "#4a5d4e", "#8da399", "#b9c2b1", "#0d1b15"],
    description: "\u8584\u96FE\u521D\u5347\u7684\u832B\u832B\u82CD\u5C71\uFF0C\u6668\u66E6\u67D4\u548C\u6D12\u5728\u9488\u53F6\u6797\u68A2\u4E0A\uFF0C\u5927\u81EA\u7136\u6700\u5B81\u9759\u6E05\u6717\u7684\u7834\u6653\u77AC\u95F4\u3002"
  },
  {
    id: "wall-landscape-2",
    title: "\u6DF1\u79CB\u6591\u6593\u5C0F\u5F84",
    category: "\u81EA\u7136\u98CE\u5149",
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
    tags: ["\u79CB\u5929", "\u67AB\u6797", "\u5C0F\u5F84", "\u843D\u53F6", "\u91D1\u8272", "\u6CBB\u6108", "\u6F2B\u6B65"],
    colors: ["#4a2c11", "#a65d1d", "#d9a05b", "#6b7d5a", "#1a130b"],
    description: "\u91D1\u9EC4\u4E0E\u8273\u7EA2\u4EA4\u7EC7\u7684\u6797\u95F4\u5E7D\u5F84\uFF0C\u811A\u8E29\u843D\u53F6\u6C99\u6C99\u4F5C\u54CD\uFF0C\u5C06\u79CB\u610F\u6696\u9633\u5316\u4F5C\u6C38\u6052\u7684\u684C\u9762\u98CE\u666F\u3002"
  },
  {
    id: "wall-landscape-3",
    title: "\u51B0\u5DDD\u6E56\u5F71\u971E\u5149",
    category: "\u81EA\u7136\u98CE\u5149",
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
    tags: ["\u6E56\u6CCA", "\u96EA\u5C71", "\u7EA2\u971E", "\u5012\u5F71", "\u5B81\u9759", "\u58EE\u4E3D", "\u51B0\u5DDD"],
    colors: ["#1c2d37", "#445964", "#7b8d96", "#df9571", "#fee4ca"],
    description: "\u665A\u971E\u5982\u706B\u822C\u71C3\u70E7\u5728\u5929\u9645\uFF0C\u96EA\u5C71\u4E0E\u6E56\u6C34\u76F8\u6620\u6210\u8DA3\uFF0C\u5012\u5F71\u8361\u6F3E\u4E2D\u6D17\u6DA4\u5FC3\u7075\u7684\u90FD\u5E02\u70E6\u607C\u3002"
  },
  {
    id: "wall-landscape-4",
    title: "\u6797\u95F4\u6668\u66E6\u7834\u6653",
    category: "\u81EA\u7136\u98CE\u5149",
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
    tags: ["\u677E\u6797", "\u4E01\u8FBE\u5C14", "\u9633\u5149", "\u6811\u5F71", "\u6CBB\u6108\u7CFB", "\u7A7A\u6C14\u611F"],
    colors: ["#131c0e", "#565830", "#adb581", "#e3dfcc", "#2c3321"],
    description: "\u6E05\u98CE\u7A7F\u8FC7\u68EE\u6797\uFF0C\u6D12\u4E0B\u5B8C\u7F8E\u7684\u4E01\u8FBE\u5C14\u5149\u6548\u3002\u7F6E\u8EAB\u5176\u95F4\uFF0C\u4EFF\u4F5B\u80FD\u95FB\u5230\u677E\u9488\u4E0E\u8349\u5730\u7684\u6E05\u9999\u3002"
  },
  {
    id: "wall-cyber-1",
    title: "\u8D5B\u535A\u9713\u8679\u65B0\u5BBF",
    category: "\u8D5B\u535A\u9713\u8679",
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
    tags: ["\u9713\u8679", "\u96E8\u591C", "\u672A\u6765\u57CE\u5E02", "\u53CD\u5C04", "\u6DA9\u8C37", "\u6F6E\u6D41", "\u670B\u514B"],
    colors: ["#020b14", "#cf035a", "#0da0c4", "#5b1caf", "#16447c"],
    description: "\u96E8\u591C\u79EF\u6C34\u5012\u6620\u7740\u9AD8\u9971\u548C\u5EA6\u7684\u9713\u8679\u62DB\u724C\uFF0C\u5145\u6EE1\u672A\u6765\u79D1\u5E7B\u4E0E\u9AD8\u79D1\u6280\u4F4E\u751F\u6D3B\u7684\u89C6\u89C9\u51B2\u51FB\u611F\u3002"
  },
  {
    id: "wall-cyber-2",
    title: "\u96E8\u591C\u8FF7\u5E7B\u8857\u5934",
    category: "\u8D5B\u535A\u9713\u8679",
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
    tags: ["\u8857\u5934", "\u9713\u8679", "\u8FF7\u5E7B", "\u96E8\u6C34", "\u51FA\u79DF\u8F66", "\u51B7\u6696\u5BF9\u6BD4", "\u90FD\u5E02"],
    colors: ["#070714", "#d01348", "#22bcca", "#782be1", "#b39fae"],
    description: "\u9752\u78A7\u8272\u4E0E\u7EA2\u7D2B\u8272\u7684\u51B7\u6696\u4EA4\u6C47\uFF0C\u8BA9\u5E73\u51E1\u7684\u57CE\u5E02\u4E00\u9685\u6D78\u900F\u5728\u8D5B\u535A\u670B\u514B\u7684\u7535\u5149\u5E7B\u5F71\u4E2D\u3002"
  },
  {
    id: "wall-cyber-3",
    title: "\u590D\u53E4\u7EA2\u84DD\u8857\u673A\u5385",
    category: "\u8D5B\u535A\u9713\u8679",
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
    tags: ["\u8857\u673A", "\u590D\u53E4\u6F6E", "\u6E38\u620F", "\u7EA2\u84DD", "\u50CF\u7D20", "\u6000\u65E7", "\u6F6E\u73A9"],
    colors: ["#0d0510", "#e10e49", "#1129b0", "#8d169d", "#fff0fa"],
    description: "\u9713\u8679\u6C24\u6C32\u7684\u8857\u673A\u5385\uFF0C\u7EA2\u84DD\u5149\u5F71\u6E32\u67D3\uFF0C\u5E26\u4F60\u4E00\u79D2\u7A7F\u8D8A\u56DE80\u5E74\u4EE3\u7684\u84B8\u6C7D\u6CE2\u5E7B\u60F3\u3002"
  },
  {
    id: "wall-cyber-4",
    title: "\u4E91\u7AEF\u5929\u9645\u77E9\u9635",
    category: "\u8D5B\u535A\u9713\u8679",
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
    tags: ["\u5929\u9645\u7EBF", "\u6469\u5929\u697C", "\u84DD\u8272", "\u8D5B\u535A\u6781\u5BA2", "\u9AD8\u7EA7\u51B7", "\u79E9\u5E8F"],
    colors: ["#020b1a", "#0f2142", "#2e70b8", "#a6d6fc", "#040911"],
    description: "\u6781\u5177\u5DE5\u4E1A\u51E0\u4F55\u8D28\u611F\u7684\u84DD\u8272\u6469\u5929\u5927\u697C\u77E9\u9635\uFF0C\u6DF1\u9083\u51B7\u9759\uFF0C\u6781\u5BA2\u6700\u7231\u7684\u684C\u9762\u4E0A\u4F73\u6784\u56FE\u3002"
  },
  {
    id: "wall-space-1",
    title: "\u6052\u53E4\u94F6\u6CB3\u62F1\u6865",
    category: "\u661F\u7A7A\u6DF1\u7A7A",
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
    tags: ["\u94F6\u6CB3", "\u661F\u6D77", "\u591C\u7A7A", "\u7FA4\u5C71", "\u5DCD\u5CE8", "\u79D1\u5E7B", "\u5B87\u5B99"],
    colors: ["#030510", "#0f162c", "#2d3460", "#695982", "#d4bbd5"],
    description: "\u5DCD\u5CE8\u5C71\u5DC5\u4E0A\u6A2A\u8DE8\u7684\u7480\u74A8\u94F6\u6CB3\u62F1\u6865\uFF0C\u661F\u5C18\u7480\u74A8\uFF0C\u8BB0\u5F55\u4EBA\u7C7B\u9762\u5BF9\u5B87\u5B99\u6D69\u701A\u65F6\u7684\u656C\u754F\u4E4B\u7F8E\u3002"
  },
  {
    id: "wall-space-2",
    title: "\u6DF1\u9083\u68A6\u5E7B\u661F\u4E91",
    category: "\u661F\u7A7A\u6DF1\u7A7A",
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
    tags: ["\u661F\u4E91", "\u8D85\u65B0\u661F", "\u7470\u4E3D", "\u661F\u7A7A", "\u7D2B\u8272", "\u5929\u4F53", "\u552F\u7F8E"],
    colors: ["#0b0c16", "#281b3d", "#53336d", "#153051", "#dca7c5"],
    description: "\u661F\u5149\u3001\u7D2B\u96FE\u4E0E\u661F\u9645\u4ECB\u8D28\u8C31\u5199\u7684\u5B8F\u4F1F\u4E50\u7AE0\uFF0C\u7EDA\u70C2\u58EE\u4E3D\uFF0C\u4EFF\u4F5B\u80FD\u591F\u89E6\u6478\u6DF1\u7A7A\u5FC3\u8DF3\u3002"
  },
  {
    id: "wall-space-3",
    title: "\u84DD\u8272\u6BCD\u661F\u9ECE\u660E",
    category: "\u661F\u7A7A\u6DF1\u7A7A",
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
    tags: ["\u5730\u7403", "\u7A7A\u95F4\u7AD9", "\u5927\u6C14\u5C42", "\u661F\u6CB3", "\u84DD\u8272", "\u9AD8\u7EA7", "\u5199\u5B9E"],
    colors: ["#010207", "#0d1f3d", "#235ca2", "#b1cfea", "#070b13"],
    description: "\u4ECE\u5916\u592A\u7A7A\u8FB9\u7F18\u4FEF\u77B0\uFF0C\u6668\u7EBF\u8F7B\u629A\u6DF1\u84DD\u5730\u7403\u7684\u66F2\u7EBF\uFF0C\u95EA\u70C1\u7740\u4EE3\u8868\u751F\u547D\u4E0E\u672A\u77E5\u7684\u5FAE\u5149\u3002"
  },
  {
    id: "wall-minimal-1",
    title: "\u7C89\u84DD\u6D41\u4F53\u6CE2\u7EB9",
    category: "\u6781\u7B80\u4E3B\u4E49",
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
    tags: ["\u6781\u7B80", "\u6D41\u7EBF", "3D", "\u6CE2\u7EB9", "\u83AB\u5170\u8FEA", "\u8212\u9002", "\u6CBB\u6108"],
    colors: ["#d9b8b0", "#abb3cc", "#e9ecef", "#8e9aaf", "#4a4e69"],
    description: "\u6E29\u6DA6\u5982\u7389\u76843D\u62BD\u8C61\u66F2\u7EBF\u6D41\u4F53\uFF0C\u91C7\u7528\u6CBB\u6108\u7CFB\u9A6C\u5361\u9F99\u914D\u8272\uFF0C\u7ED9\u53CC\u773C\u653E\u4E2A\u8F7B\u67D4\u5C0F\u5047\u3002"
  },
  {
    id: "wall-minimal-2",
    title: "\u70AB\u9177\u6CB9\u58A8\u6D41\u52A8",
    category: "\u6781\u7B80\u4E3B\u4E49",
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
    tags: ["\u6CB9\u58A8", "\u5F69\u8272", "\u6D41\u4F53", "\u827A\u672F", "\u8272\u5F69\u6591\u6593", "\u9AD8\u9971\u548C", "\u62BD\u8C61"],
    colors: ["#020b12", "#e83162", "#2b10ab", "#00dfaa", "#f7ef42"],
    description: "\u52A8\u6001\u5F20\u529B\u5341\u8DB3\u7684\u6591\u6593\u8272\u5F69\u5728\u6C34\u9762\u8212\u5C55\u626D\u8F6C\uFF0C\u5F3A\u70C8\u7684\u73B0\u4EE3\u827A\u672F\u98CE\u60C5\uFF0C\u4E2A\u6027\u684C\u9762\u7684\u9996\u9009\u3002"
  },
  {
    id: "wall-minimal-3",
    title: "\u7EAF\u51C0\u6D77\u6D6A\u6C99\u6EE9",
    category: "\u6781\u7B80\u4E3B\u4E49",
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
    tags: ["\u6C99\u6EE9", "\u6D77\u6D6A", "\u7EAF\u51C0", "\u851A\u84DD", "\u822A\u62CD", "\u65E5\u7CFB", "\u60EC\u610F"],
    colors: ["#014f76", "#1ea1cb", "#dff4fc", "#cfbd9c", "#8ca7b5"],
    description: "\u6F84\u6F88\u5982\u7FE1\u7FE0\u7684\u6D77\u6D6A\u7F13\u7F13\u629A\u5E73\u6D01\u767D\u7684\u7EC6\u6C99\u3002\u65E0\u8FB9\u65E0\u9645\u7684\u6E05\u723D\uFF0C\u8BA9\u4EBA\u8EAB\u4E34\u5176\u5883\u611F\u53D7\u6930\u98CE\u7EC6\u6D6A\u3002"
  },
  {
    id: "wall-anime-1",
    title: "\u68A6\u5E7B\u6D77\u8FB9\u94C1\u8F68",
    category: "\u52A8\u6F2B\u58C1\u7EB8",
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
    tags: ["\u4E8C\u6B21\u5143", "\u65B0\u6D77\u8BDA", "\u6D77\u8FB9\u94C1\u8F68", "\u84DD\u8272", "\u590F\u65E5", "\u552F\u7F8E", "\u68A6\u5883"],
    colors: ["#162a45", "#325c8a", "#629bbf", "#a3cbd8", "#dfebed"],
    description: "\u6CE2\u5E73\u5982\u955C\u7684\u6D77\u9762\u4E0A\u5EF6\u5C55\u800C\u51FA\u7684\u8F68\u9053\u3002\u851A\u84DD\u7684\u5929\u9645\u4EA4\u6C47\u5728\u7EC8\u70B9\uFF0C\u9759\u4EAB\u6765\u81EA\u52A8\u6F2B\u4E16\u754C\u7684\u6E29\u5B58\u4E0E\u7A7A\u7075\u3002"
  },
  {
    id: "wall-anime-2",
    title: "\u971E\u5149\u4E91\u6D77\u5CAB\u5CAB",
    category: "\u52A8\u6F2B\u58C1\u7EB8",
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
    tags: ["\u4E91\u5F69", "\u5915\u9633", "\u6A58\u7C89\u8272", "\u6F2B\u753B\u98CE", "\u6CE2\u6F9C\u58EE\u9614", "\u6CBB\u6108"],
    colors: ["#2d112d", "#601b3a", "#ab4b54", "#e8997a", "#ffeed6"],
    description: "\u6D6A\u6F2B\u7C89\u6A58\u8C03\u7684\u5929\u7A7A\u6F02\u6D6E\u7740\u84EC\u677E\u7684\u4E91\u6735\uFF0C\u50CF\u6781\u4E86\u5927\u53CB\u514B\u6D0B\u6216\u5BAB\u5D0E\u9A8F\u52A8\u753B\u91CC\u7684\u552F\u7F8E\u5929\u5E55\u3002"
  },
  {
    id: "wall-anime-3",
    title: "\u5BC6\u6797\u5DEB\u5E08\u57CE\u5821",
    category: "\u52A8\u6F2B\u58C1\u7EB8",
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
    tags: ["\u53E4\u5821", "\u9B54\u6CD5", "\u7AE5\u8BDD", "\u7EFF\u91CE\u4ED9\u8E2A", "\u6E05\u6668", "\u795E\u79D8", "\u63D2\u753B"],
    colors: ["#10211d", "#284b43", "#698379", "#becdc4", "#0a100f"],
    description: "\u9AD8\u8038\u4E91\u7AEF\u7684\u795E\u79D8\u53E4\u5821\uFF0C\u5728\u6E05\u6668\u8302\u5BC6\u7684\u68EE\u6797\u96FE\u6D77\u4E2D\u82E5\u9690\u82E5\u73B0\u3002\u5E26\u4F60\u63A2\u5BFB\u4E00\u5C01\u6D88\u901D\u7684\u9B54\u6CD5\u9057\u4E66\u3002"
  },
  {
    id: "wall-cute-1",
    title: "\u6CBB\u6108\u795E\u79D8\u6EAA\u6D41",
    category: "\u6CBB\u6108\u53EF\u7231",
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
    tags: ["\u6EAA\u6D41", "\u7AE5\u8BDD", "\u7EFF\u8272", "\u7CBE\u7075", "\u6E05\u65B0", "\u6591\u9A73\u5149\u5F71", "\u6C34\u73E0"],
    colors: ["#142718", "#385d39", "#82a87d", "#d1edd1", "#09120b"],
    description: "\u7EFF\u6EAA\u6F7A\u6F7A\uFF0C\u7CBE\u7075\u8E29\u8FC7\u7684\u9E45\u5375\u77F3\u95EA\u70C1\u7740\u5E7D\u5149\uFF0C\u68EE\u6797\u4E2D\u6700\u8212\u89E3\u7126\u8651\u7684\u4E00\u6E7E\u6E29\u51C9\u6C34\u8272\u3002"
  },
  {
    id: "wall-cute-2",
    title: "\u6175\u61D2\u5348\u540E\u6696\u732B",
    category: "\u6CBB\u6108\u53EF\u7231",
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
    tags: ["\u840C\u5BA0", "\u5C0F\u732B", "\u6BDB\u8338\u8338", "\u6CBB\u6108", "\u8212\u9002", "\u9633\u5149", "\u6E29\u6696"],
    colors: ["#2d1d13", "#744b31", "#b98863", "#ede0d4", "#ddb892"],
    description: "\u6652\u7740\u91D1\u9EC4\u8272\u9633\u5149\u4F38\u61D2\u8170\u7684\u5C0F\u732B\u3002\u7C89\u5AE9\u7684\u9F3B\u5C16\u4E0E\u6696\u4E4E\u7684\u624B\u611F\uFF0C\u7ED9\u4F60\u6BEB\u65E0\u6212\u5907\u7684\u6E29\u99A8\u629A\u6170\u3002"
  },
  {
    id: "wall-cute-3",
    title: "\u6E05\u6DA6\u7EFF\u7F57\u9732\u73E0",
    category: "\u6CBB\u6108\u53EF\u7231",
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
    tags: ["\u9732\u73E0", "\u5FAE\u8DDD", "\u62A4\u773C", "\u690D\u7269", "\u6676\u83B9", "\u7EFF\u53F6", "\u96E8\u540E"],
    colors: ["#09170e", "#1b3f27", "#4b7f52", "#a3cfab", "#ecf7ed"],
    description: "\u8349\u53F6\u5C16\u7AEF\u5782\u5760\u7684\u4EAE\u6676\u6676\u9732\u73E0\uFF0C\u6620\u7167\u51FA\u5FAE\u7F29\u7684\u78A7\u53F6\u4E16\u754C\uFF0C\u5B8C\u7F8E\u4FDD\u62A4\u53CC\u773C\u7684\u7EAF\u7CB9\u7EFF\u8272\u58C1\u7EB8\u3002"
  },
  {
    id: "wall-cute-4",
    title: "\u6696\u610F\u96E8\u7A97\u5496\u5561\u9986",
    category: "\u6CBB\u6108\u53EF\u7231",
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
    tags: ["\u7A97\u6237", "\u96E8\u6EF4", "\u5496\u5561\u9986", "\u6E29\u6696", "\u6C1B\u56F4\u611F", "\u8212\u9002", "\u51AC\u65E5"],
    colors: ["#141118", "#3b2a3a", "#7a586e", "#ddb1cb", "#f9ebe2"],
    description: "\u5496\u5561\u9986\u5185\u70DB\u5149\u6447\u66F3\uFF0C\u7A97\u5916\u96E8\u5E55\u5A46\u5A11\u3002\u51B7\u96E8\u4E0E\u6696\u9999\u4EC5\u51ED\u4E00\u7A97\u4E4B\u9694\uFF0C\u6EE1\u6EA2\u6000\u65E7\u6E29\u6DA6\u7684\u8BD7\u610F\u3002"
  }
];
app.get("/api/wallpapers", (req, res) => {
  const { category, aspectRatio, search, sort } = req.query;
  let results = [...wallpapersDb];
  if (category && category !== "\u5168\u90E8") {
    results = results.filter((w) => w.category === category);
  }
  if (aspectRatio) {
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (w) => w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.tags.some((t) => t.toLowerCase().includes(q)) || w.category.toLowerCase().includes(q)
    );
  }
  if (sort === "\u6700\u65B0") {
    results.reverse();
  } else if (sort === "\u70ED\u95E8") {
    results.sort((a, b) => b.views - a.views);
  } else if (sort === "\u4E0B\u8F7D") {
    results.sort((a, b) => b.downloads - a.downloads);
  } else if (sort === "\u70B9\u8D5E") {
    results.sort((a, b) => b.likes - a.likes);
  }
  res.json(results);
});
app.post("/api/wallpapers/:id/download", (req, res) => {
  const { id } = req.params;
  const wallpaper = wallpapersDb.find((w) => w.id === id);
  if (wallpaper) {
    wallpaper.downloads += 1;
    wallpaper.views += 11;
    return res.json({ success: true, downloads: wallpaper.downloads });
  }
  res.status(404).json({ error: "Wallpaper not found" });
});
app.post("/api/wallpapers/:id/like", (req, res) => {
  const { id } = req.params;
  const { liked } = req.body;
  const wallpaper = wallpapersDb.find((w) => w.id === id);
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
app.post("/api/ai/suggest", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  const promptString = String(prompt).trim();
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `\u4F60\u662F\u4E00\u4F4D\u6BBF\u5802\u7EA7\u7684\u58C1\u7EB8\u7F8E\u5B66\u5927\u5E08\u548CAI\u6784\u56FE\u4E13\u5BB6\u3002
\u7528\u6237\u63D0\u51FA\u4E86\u4E00\u4E2A\u58C1\u7EB8\u521B\u610F\u6784\u60F3\uFF1A"${promptString}"

\u8BF7\u4E3A\u7528\u6237\u89E3\u6790\u6B64\u8BBE\u60F3\uFF0C\u5E76\u62D3\u5C55\u4E3A\u4E00\u4E2A\u6781\u5177\u753B\u9762\u5F20\u529B\u7684**\u8D85\u9AD8\u6E05\u58C1\u7EB8\u63CF\u8FF0\u65B9\u6848**\u3002
\u8BF7\u4F7F\u7528JSON\u683C\u5F0F\u8FD4\u56DE\uFF0C\u5305\u542B\u4EE5\u4E0B\u5C5E\u6027\uFF1A
1. "expandedPrompt": \u62D3\u5C55\u540E\u7684\u4E2D\u6587\u4E13\u4E1AAI\u7ED8\u753B/\u8BBE\u8BA1\u5173\u952E\u8BCD\u63D0\u793A\u8BCD\uFF0C\u6CE8\u91CD\u7EC6\u8282\u63CF\u5199\uFF0C\u5305\u62EC\u5149\u5F71\u3001\u6784\u56FE\uFF08\u5982\uFF1A\u9EC4\u91D1\u5206\u5272\u3001\u5927\u666F\u6DF1\uFF09\u3001\u753B\u98CE\u7B49\u3002
2. "colorPalette": \u5305\u542B4-5\u79CD\u7B26\u5408\u8BE5\u610F\u5883\u7684\u8272\u5361\u7EC4\u5408\uFF0C\u6BCF\u79CD\u8272\u5361\u63D0\u4F9B"name"\uFF08\u4E2D\u6587\u7F8E\u5B66\u8272\u540D\uFF0C\u5982'\u9EDB\u7EFF', '\u66AE\u5C71\u7D2B'\uFF09\u548C"hex"\uFF08\u6807\u51C6\u5341\u516D\u8FDB\u5236\u989C\u8272\u4EE3\u7801\uFF09\u3002
3. "tags": 6\u4E2A\u76F8\u5173\u7684\u6807\u7B7E\u5173\u952E\u8BCD\uFF08\u7528\u4E8E\u5339\u914D\u91C7\u96C6\u5206\u7C7B\uFF0C\u5982'\u79D1\u5E7B', '\u6CBB\u6108\u7CFB', '\u6781\u7B80'\u7B49\uFF09\u3002
4. "aestheticAnalysis": \u7EA6100\u5B57\u7684\u7F8E\u5B66\u6784\u56FE\u8BB2\u89E3\u4E0E\u610F\u5883\u8BC4\u6790\uFF0C\u8BED\u6C14\u4F18\u7F8E\u3001\u6CBB\u6108\u3001\u5BCC\u6709\u8BD7\u610F\u3002
5. "matchingKeywords": \u7528\u4E8E\u5728\u91C7\u96C6\u6570\u636E\u5E93\u4E2D\u68C0\u7D22\u7684\u6838\u5FC3\u4E2D\u6587\u68C0\u7D22\u8BCD\u5217\u8868\uFF083\u4E2A\uFF0C\u4F8B\u5982['\u5C71\u5CE6', '\u6668\u66E6', '\u7EFF\u8272']\uFF09\u3002

\u6CE8\u610F\uFF1A\u683C\u5F0F\u8BF7\u4E25\u683C\u9075\u5FAA\u89C4\u8303\u7684JSON\u7ED3\u6784\uFF0C\u4E0D\u8981\u5305\u542B\u989D\u5916\u7684Markdown\u6807\u8BB0\u6216\u4EE3\u7801\u5757\u5305\u56F4\uFF08\u53EA\u8FD4\u56DE\u7EAF\u5408\u6CD5\u7684JSON\u6587\u672C\uFF09\u3002`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["expandedPrompt", "colorPalette", "tags", "aestheticAnalysis", "matchingKeywords"],
          properties: {
            expandedPrompt: {
              type: import_genai.Type.STRING,
              description: "Detailed Chinese design prompt expanding on the original input."
            },
            colorPalette: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                required: ["name", "hex"],
                properties: {
                  name: { type: import_genai.Type.STRING },
                  hex: { type: import_genai.Type.STRING }
                }
              }
            },
            tags: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            aestheticAnalysis: {
              type: import_genai.Type.STRING,
              description: "Beautiful paragraph explaining composition style and visual poetry."
            },
            matchingKeywords: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING },
              description: "3 simple search terms to browse database items."
            }
          }
        }
      }
    });
    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error) {
    console.error("Gemini API error:", error);
    const fallbacks = {
      expandedPrompt: `${promptString} - \u9AD8\u7EA7\u611F3D\u827A\u672F\u6E32\u67D3\uFF0C\u6D45\u5361\u5176\u8272\u4E0E\u677E\u77F3\u7EFF\u7684\u6E05\u6F88\u78B0\u649E\uFF0C\u67D4\u7126\u5927\u666F\u6DF1\uFF0C\u7A7A\u6C14\u4E01\u8FBE\u5C14\u6563\u5C04\uFF0C\u8D85\u9AD8\u5206\u8FA8\u7387\u7EC6\u8282\u3002`,
      colorPalette: [
        { name: "\u96E8\u6797\u9EDB\u7EFF", hex: "#122a22" },
        { name: "\u9713\u8679\u5E7B\u7D2B", hex: "#4d2375" },
        { name: "\u6668\u66E6\u6C99\u91D1", hex: "#dfb072" },
        { name: "\u51B0\u5DDD\u6D45\u78A7", hex: "#a4cfcf" }
      ],
      tags: ["AI\u62D3\u5C55", "\u8D28\u611F\u8BBE\u8BA1", "\u6C1B\u56F4\u5149\u6591", "\u827A\u672F", "\u62A4\u773C", "\u63D2\u753B"],
      aestheticAnalysis: `\u56F4\u7ED5\u201C${promptString}\u201D\uFF0C\u8425\u9020\u4E86\u4E00\u79CD\u7A7A\u7075\u3001\u6DF1\u9083\u7684\u6781\u81F4\u7559\u767D\u7A7A\u95F4\u3002\u8272\u5F69\u4E0A\u51B7\u6DE1\u4E0E\u6E29\u6696\u78B0\u649E\uFF0C\u5E26\u6765\u5982\u98CE\u63A0\u8FC7\u5C71\u8C37\u822C\u62C2\u62ED\u53CC\u7738\u7684\u6E05\u7EAF\u6CBB\u6108\u4F53\u9A8C\uFF0C\u662F\u4E00\u5E27\u7EDD\u4F73\u7684\u684C\u9762\u753B\u5E03\u3002`,
      matchingKeywords: ["\u7EFF\u8272", "\u661F\u7A7A", "\u6CBB\u6108"]
    };
    res.json(fallbacks);
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Wallpaper Curation Server running on http://localhost:${PORT}`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
