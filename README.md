# Cat Globe Project（全球动物百科）

一个基于 **Vite + React + TypeScript + react-globe.gl** 的 3D 地球动物图谱项目，支持猫/狗分类、移动端底部抽屉详情、镜头追踪与星际数据轨道（Arcs）特效。

## 目录结构

- `src/`：业务源码
  - `components/`：核心组件（`GlobeView`、`AnimalPanel`、`LoadingScreen`）
  - `data/`：动物数据（`animals.ts`，含 `CAT_ANIMALS` / `DOG_ANIMALS` / `ANIMALS_BY_CATEGORY` 分类导出）
  - `lib/`：工具/库代码（如有）
- `public/`：静态资源（favicon 等）
- `index.html`：应用 HTML 模板（已做分区）

## 本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000/`

## 生产打包 / 预览

```bash
npm run build
npm run preview
```

## 上传 GitHub（推荐流程）

项目已配置好 `.gitignore`（会忽略 `node_modules`、`dist` 等不需要上传的目录）。

```bash
git init
git add .
git commit -m "Initial commit: cat animal globe app"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

