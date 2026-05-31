<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app
https://pic.zsb.hidns.co/

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/25e0a5e2-4b99-4fdf-8278-2dc620b8ec68

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

这个网站怎么部署到vps
Gemini 3.5 Flash
Ran for 10s
lightbulb
Thought for 10 seconds
部署我们的聚光壁纸网站（采用 Express + Vite 打造的高性能全栈架构）到 VPS 非常简单直观。下面为您整理了最标准、安全的 VPS 生产部署操作指南：
第一步：开启 VPS 服务器环境准备
登录您的 VPS，执行以下基础依赖包安装（以常见的 Ubuntu/Debian 系统为例）：
安装 Node.js 运行环境（推荐使用 Node.js 18 或 20 LTS 版本）：
code
Bash
# 使用 Nodesource 快速安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装是否成功
node -v
npm -v
全局安装 PM2 进程管理器：
PM2 可以保证网站在后台 7x24 小时稳定运行，在服务器意外重启或代码崩溃时自动拉起。
code
Bash
sudo npm install -y pm2 -g
安装 Web 服务器 Nginx（用于反向代理与配置 SSL/HTTPS）：
code
Bash
sudo apt-get update
sudo apt-get install -y nginx
第二步：上传项目代码并配置环境变量
上传代码到 VPS：
您可以直接将代码推送到您的私有 GitHub / Gitee 仓库，然后使用 git clone 拉取到 VPS，或者通过 SFTP 工具直接打包上传至服务器（比如 /var/www/wallpaper-site 目录下）。
安装生产环境依赖：
在项目根目录下，执行安装：
code
Bash
npm install
创建核心生产环境变量配置文件 .env：
在服务器项目根目录下新建名为 .env 的文件，填入您的生产凭数：
code
Env
# 替换为您自有的谷歌 Gemini API 秘钥 (AI 绘意助手功能必需)
GEMINI_API_KEY="你的_GEMINI_API_KEY_在这里"

# 设置 Node.js 运行为生产模式
NODE_ENV="production"
第三步：高性能生产环境打包编译
运行项目中为您配置完成的生产编译命令。它会完成以下两个高效率转化：
将前端 React 界面压缩编译进 dist 目录；
使用 esbuild 将服务器端后端代码完美打包成单一、兼容性极强的 dist/server.cjs 部署脚本。
code
Bash
npm run build
第四步：使用 PM2 守护启动服务
在项目根目录下通过 PM2 唤醒部署。我们将极速启动编译好的 .cjs 入口，并自动分配内部端口 3000：
code
Bash
# 启动网站守护进程，并将它命名为 "wallpaper-studio"
pm2 start dist/server.cjs --name "wallpaper-studio"

# 将其添加到开机自启
pm2 save
pm2 startup
您可以使用 pm2 status 或 pm2 logs wallpaper-studio 随时监视运行状态。
第五步：配置 Nginx 代理与 SSL（完美适配 HTTPS）
为了让用户能通过常规的 80 (HTTP) 或 443 (HTTPS) 端口访问网站，我们需要用 Nginx 把 3000 端口映射出去：
新建并编辑 Nginx 网站配置：
code
Bash
sudo nano /etc/nginx/sites-available/wallpaper
粘贴下方标准配置（将 yourdomain.com 替换为您的域名，如果要配合 IP 直接访问可改为 IP）：
code
Nginx
server {
    listen 80;
    server_name yourdomain.com; # 填入您的域名或公网 IP

    # 设定上传大小限制，保障极清大图流畅传输
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
启用配置并重载 Nginx 服务：
code
Bash
sudo ln -s /etc/nginx/sites-available/wallpaper /etc/nginx/sites-enabled/
sudo nginx -t # 检查配置语法是否正确
sudo systemctl restart nginx
（可选，强烈推荐）一键安装免费的 HTTPS/SSL 证书：
使用 Let's Encrypt / Certbot 工具，在后台输入两行命令即可完成一键部署：
code
Bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
至此，您的聚光壁纸网站已在 VPS 服务器上开机后台守护、带有多模态 AI 高级采集与三端标定裁切功能的专属平台就成功上线了！
