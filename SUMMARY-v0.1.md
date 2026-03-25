# Blog v0.1 — 阶段性总结

> 创建时间：2026-03-25
> 状态：v0.1 骨架完成，平台成熟度 > 内容成熟度

---

## 一、技术选型与理由

| 选择 | 具体方案 | 理由 |
|------|----------|------|
| 框架 | Astro 5 (静态输出) | 模板接近原生 HTML，学习成本低；内置 Markdown/代码高亮；不需要读任何第三方主题代码 |
| UI 框架 | 无（纯 .astro 组件） | 用户要完全掌控设计，不想依赖 React/Vue |
| CSS 方案 | CSS 自定义属性 + 组件 scoped 样式 | 无框架依赖，设计系统集中在 global.css 一个文件 |
| 内容管理 | Astro Content Collections + glob loader | 文件系统即信息架构：加文件夹和 .md 就能扩展，无需改配置 |
| 客户端 JS | 仅主题切换 + 手机端菜单/侧边栏（`<script is:inline>`） | 尽可能零 JS，用原生 HTML（`<details>/<summary>`）替代交互 |
| 字体 | 系统字体栈 + PingFang SC/Noto Sans SC + Playfair Display（签名） | 系统字体保证性能和中文渲染；签名用衬线体做视觉锚点 |
| 部署 | 静态构建到 dist/，目标 GitHub Pages/Vercel/Netlify | 免费托管，构建产物是纯 HTML |

---

## 二、架构设计决策（不应轻易修改）

### 2.1 单一 books 集合 + 文件系统驱动

```
src/content/books/
  java/hashmap/deep-dive.md  →  entry.id = "java/hashmap/deep-dive"
  mysql/indexing/b-tree.md   →  entry.id = "mysql/indexing/b-tree"
```

- **entry.id 直接作为 URL slug**——不需要额外转换
- **树形导航从 entry.id 自动生成**——`src/utils/tree.ts` 的 `buildTree()` 是核心函数
- **新增内容只需创建文件夹和 .md 文件**——零配置变更
- ⚠️ 如果改为多集合或改变 ID 生成策略，路由、树形导航、面包屑全部需要重写

### 2.2 暗色模式机制

- `<html data-theme="dark|light">` + CSS 自定义属性切换
- `<head>` 中的内联脚本在首次渲染前读取 `localStorage`，防止闪烁
- 同时支持 `prefers-color-scheme` 自动检测
- ⚠️ 不要改为 class-based 方案或移除 `<head>` 中的内联脚本

### 2.3 树形侧边栏

- 使用 `<details>/<summary>` 原生 HTML 实现展开/折叠——**零 JavaScript**
- 当前页面高亮和祖先节点自动展开通过 slug 字符串比较在**构建时**计算
- `TreeNode.astro` 使用 `Astro.self` 递归渲染
- ⚠️ 不要引入客户端状态管理来替代这个方案

### 2.4 导航栏居中

- 导航链接通过 `position: absolute; left: 50%; transform: translateX(-50%)` 实现真正视觉居中
- Logo 在左侧正常流，Actions（主题切换/汉堡菜单）通过 `margin-left: auto` 靠右
- ⚠️ 不要改回 `justify-content: space-between`

---

## 三、设计系统

### 3.1 设计令牌（src/styles/global.css）

所有视觉决策集中在 CSS 自定义属性中：

- 颜色：Apple 官方色系（`#1d1d1f`, `#f5f5f7`, `#0071e3` 等）
- 毛玻璃：`--glass-bg`, `--glass-border`, `--glass-blur` — 用于导航栏、卡片、移动端侧边栏
- 阴影：四级阴影系统 `--shadow-xs/sm/md/lg`，暗色模式有独立覆盖值
- 过渡：`--transition-fast/normal/bounce/smooth`
- 间距：8 级 `--space-1` 到 `--space-16`

### 3.2 Apple 设计元素

| 元素 | 位置 | 实现方式 |
|------|------|----------|
| 毛玻璃 | 导航栏、分类卡片、Hero 卡片、移动端侧边栏 | `backdrop-filter: blur(20px) saturate(180%)` + 半透明背景 |
| 渐变文字 | 首页 Hero 标题 | `background: linear-gradient(...)` + `-webkit-background-clip: text` |
| 交错动画 | 分类卡片、Hero 元素 | `@keyframes fade-up` + `animation-delay` |
| 悬浮抬升 | 分类卡片 | `translateY(-4px) scale(1.005)` + 阴影加深 |
| 下划线动画 | 导航链接 | `::after` 伪元素从中心展开 |
| 图标旋转 | 主题切换 | `opacity` + `rotate` + `scale` 过渡 |
| 侧边栏滑入 | 移动端树形目录 | `backdrop-filter: blur(4px)` 遮罩层（iOS 风格） |

### 3.3 无障碍

- `prefers-reduced-motion: reduce` 禁用所有动画
- 汉堡菜单使用 `aria-expanded` / `aria-label`
- 面包屑和树形导航有 `aria-label`

---

## 四、文件结构与职责

```
src/
├── content.config.ts          # 集合 schema（glob loader + Zod）
├── content/books/             # 多层级 Markdown 内容
│   ├── java/hashmap/*.md
│   ├── java/concurrency/*.md
│   └── mysql/indexing/*.md
├── layouts/
│   ├── BaseLayout.astro       # HTML 外壳：<head> + Navbar + <slot>
│   └── BooksLayout.astro      # 双栏布局：TreeNav + Breadcrumbs + 文章内容
├── components/
│   ├── Navbar.astro           # 导航栏：签名 + emoji链接 + 主题切换 + 汉堡菜单
│   ├── ThemeToggle.astro      # 暗色模式按钮（旋转动画）
│   ├── TreeNav.astro          # 树形导航容器
│   ├── TreeNode.astro         # 递归树节点（details/summary）
│   └── Breadcrumbs.astro      # 面包屑
├── pages/
│   ├── index.astro            # 首页（Hero + 毛玻璃卡片 + 渐变标题）
│   ├── about.astro            # 关于页（占位）
│   └── books/
│       ├── index.astro        # 分类列表（按顶级文件夹分组）
│       └── [...slug].astro    # 文章页（catch-all 路由）
├── styles/
│   └── global.css             # 设计令牌 + 重置 + 关键帧动画
└── utils/
    └── tree.ts                # buildTree() 纯函数
```

---

## 五、已知局限（v0.2 可改进方向）

1. **分类链接死链**：`/books/java` 这样的中间路径没有对应页面，面包屑和分类卡片可能指向 404
2. **首页无内容发现**：没有最近文章、热门话题或文章摘要
3. **内容为占位符**：4 篇示例文章都标注了"实际内容待补充"
4. **关于页为空壳**：只有一行占位文字
5. **无 RSS / Sitemap / SEO meta**：部署前需要补充
6. **无搜索功能**：随着内容增长需要考虑
7. **Google Fonts 外部依赖**：Playfair Display 通过 CDN 加载，离线或国内访问可能受影响
8. **无 git 仓库**：项目尚未初始化 git

---

## 六、Frontmatter 约定

```yaml
---
title: "必填 — 文章标题"
description: "可选 — 用于 SEO 和摘要"
pubDate: 2025-01-15          # 可选 — 发布日期
order: 1                     # 可选 — 同级排序（小数字在前）
draft: false                 # 可选 — 默认 false，true 时构建跳过
---
```

---

## 七、构建与开发

```bash
npm run dev      # 开发服务器 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

Node.js 22+ 必需（通过 nvm-windows 管理）。唯一依赖：`astro@^5.7.10`。
