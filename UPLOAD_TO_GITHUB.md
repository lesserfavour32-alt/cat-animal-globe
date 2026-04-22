# 上传到 GitHub（快速版）

## 1) 本地已准备内容

- 已初始化本地仓库：`.git/`
- 已配置忽略：`.gitignore`（`node_modules`、`dist` 等不会被上传）
- 已整理分类数据导出：`public/data/animals-by-category.json`
- 可随时重新导出分类数据：

```bash
npm run data:export
```

## 2) 推荐上传流程

在项目根目录执行：

```bash
git add .
git commit -m "init: animal globe project with categorized data export"
git branch -M main
git remote add origin <你的GitHub仓库地址>
git push -u origin main
```

> 如果你已经添加过 `origin`，请跳过 `git remote add origin ...`。

## 3) 可选：上传前再检查一次

```bash
npm run lint
npm run build
```

## 4) 分类数据文件说明

- 文件：`public/data/animals-by-category.json`
- 结构：
  - `generatedAt`：导出时间
  - `total`：总条目数
  - `counts`：各分类数量
  - `data.cat` / `data.dog` / `data.wildlife`：分类数据数组
