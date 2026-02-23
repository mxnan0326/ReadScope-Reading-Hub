# 自动更新的网站

本项目通过 Python 脚本从飞书多维表格同步内容数据，并使用 React (Vite) 前端展示数据。通过结合 GitHub Actions 与飞书 Webhook，本项目可以实现**飞书状态更改后网页内容秒级全自动同步**。

## 📁 核心文件结构说明

这套源码里并不是所有文件都需要你修改，为了方便理解，这里列出核心文件的作用：

```text
自动更新的网站/
├── .github/
│   └── workflows/
│       └── auto-update.yml   # 🤖 自动化核心：告诉 GitHub 怎么接管原本需要人工运行的更新任务，以及接收飞书的“唤醒”信号
├── scripts/
│   └── fetch_feishu.py       # 🐍 数据引擎：负责和飞书老家联系，下载最新“已发布”的数据并持久化存入前端 src/data 目录
└── frontend/                 # 🖥️ 前端展示项目主目录
    ├── src/
    │   ├── data/
    │   │   └── data.json     # 📦 数据仓库：脚本从飞书抓下来的所有内容都在这，网页直接读取它显示
    │   ├── main.tsx          # 🚀 网页入口：整个 React 网站启动的第一个起点
    │   └── ...组件代码等
    └── public/
        └── images/           # 🖼️ 图片仓库：从飞书抓下来的所有封面图存放在这，供网页调用
```

> **注意：** 像 `.gitignore`, `package.json`, `tsconfig.json` 等文件属于环境配置清单，通常不需要人工修改，除非需要添加新的技术栈或库。

## 🚀 自动更新配置教程 (飞书直连 GitHub 方案)

本方案不仅支持定时静默更新，还可以实现**当你把飞书记录调为“已发布”时，网页在几秒钟后自动触发发布**。(零成本，无需购置服务器)

### 前置准备：将代码托管至 GitHub

本页面的完整代码必须首先推送到 GitHub 线上仓库。

### 获得 GitHub 通行钥匙 (Personal Access Token)

1. 登录 GitHub，点击右上角头像 -> `Settings` -> 左侧最下方 `Developer settings`
2. 选择 `Personal access tokens` -> `Tokens (classic)`
3. 点击 `Generate new token (classic)`
4. 为 Token 命名（如 Feishu Webhook），**勾选 `repo` 权限范围** (重要)
5. 点击生成后，妥善复制并保存这串长字符（钥匙）。

### 飞书端配置：安装触发器

1. 打开飞书多维表格，点击右上角的 **“自动化”** -> **“创建自定义流程”**。
2. **第一步（触发器）：** 选择 `记录发生符合条件的变更时` -> 监控字段选 `状态` -> 条件为 `等于` "已发布"。
3. **第二步（执行动作）：** 选择 `发送 Webhook`：
   - **网址** 填写: `https://api.github.com/repos/【你的Github账号】/【你的仓库名】/dispatches` (注意替换为您自己的)
   - **请求头 (Headers)** 设置：
     - 添加一行：键填 `Accept`，值填 `application/vnd.github+json`
     - 添加一行：键填 `Authorization`，值填 `Bearer 【你刚才申请的钥匙字符串】` (Bearer与钥匙之间有个空格)
   - **主体 (Body)** 以 JSON 格式写入唤醒暗号：

     ```json
     {
       "event_type": "feishu_update"
     }
     ```

4. 保存启用。大功告成！

---

## 🛠️ 本地手动开发/测试指南

如果你要在本地修改网页样式或主动进行数据拉取，可参照以下命令：

### 手动抓取数据（如果不用自动更新）

```bash
cd scripts
pip install requests
python fetch_feishu.py
```

> 同步完成后会在 `frontend/src/data/data.json` 看到最新数据，`frontend/public/images` 也会存入本地封面图。

### 启动本地前端查看网页样式

```bash
cd frontend
npm install  # 仅首次需要
npm run dev
```
