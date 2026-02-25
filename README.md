# apaas-custom-commmon-plugins

面向 **得帆云（Apaas）** 的自定义扩展开发工具集（自定义组件 / 页面 / 列表 / 布局），采用 **Turborepo + pnpm workspace** 的 Monorepo 架构。

> 本仓库主要解决两件事：
>
> 1. 统一的开发/构建脚手架（Rsbuild 用于本地开发，Rslib 用于打包产物）
> 2. 配合「Apaas 调试插件」实现**在线替换调试**（无需反复打包上传即可验证）

---

## 目录结构

```text
.
├── apps/                          # 业务应用（可独立 dev/build）
│   ├── apaas-custom-components/   # 自定义组件（表单组件）
│   ├── apaas-custom-pages/        # 自定义页面
│   ├── apaas-custom-list/         # 自定义列表
│   ├── apaas-custom-layout/       # 自定义布局
│   ├── apaas-custom-mobile-components/ # 移动端自定义组件
│   └── apaas-custom-mobile-pages/      # 移动端自定义页面
├── packages/                      # 共享包
│   ├── helper/                    # 辅助工具（mixins、utils、i18n 等）
│   ├── ui/                        # UI 组件库（如有）
│   └── h5-ui/                     # H5 相关 UI（如有）
├── internal/                      # 内部配置包
│   ├── build-config/              # 构建配置
│   └── typescript-config/         # TypeScript 配置
├── scripts/                       # 仓库脚本
└── zip/                           # 打包输出目录（压缩包、开发缓存目录）
```

> 提示：示例工程位于仓库根目录的 `example/`（web/mobile），通常用于参考平台侧集成方式与页面工程结构。

---

## 前期准备

### 环境要求

- **Node.js**：推荐 `18.20.7`（仓库已通过 `volta` 固定）
- **pnpm**：`pnpm@10`（根 `package.json` 中 `packageManager` 为 `pnpm@10.20.0`）

推荐使用 [Volta](https://volta.sh/) 管理 Node 环境：

```bash
# 安装指定 Node 版本
volta install node@18.20.7

# 安装 pnpm
volta install pnpm@10.20.0
```

### 相关资料

- 得帆云开发文档：
  https://edu.definesys.cn/community/document-center/?id=520252052773797888&typeId=481474084123705344&version=V1_0
- Apaas 调试插件下载：
  https://github.com/xie392/apaas-crx/releases/tag/v0.0.5
- Apaas 调试插件使用方法：
  https://av7ieo7ha48.feishu.cn/wiki/TcfMwSz6vixFikkcC1zcChsNnne?from=from_copylink

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置调试插件（必须）

本仓库的本地开发调试依赖「Apaas 调试插件」进行在线替换。

1. 安装插件（见上方下载链接）
2. 按使用文档完成插件配置
3. 启动本地开发服务后，在浏览器打开得帆云页面，通过插件将资源指向本地

> 说明：项目已迁移到 **Rsbuild（开发）** 与 **Rslib（打包）**，插件配置方式保持一致。

### 3. 启动开发服务

以自定义组件为例：

```bash
pnpm dev:comp
```

启动后在得帆云页面刷新，即可看到最新代码效果（通常需要手动刷新页面）。

---

## 常用命令

根目录脚本（`package.json`）：

```bash
# 格式化 / 校验
pnpm format                 # biome format --write
pnpm lint                   # biome check

# 清理
pnpm clean                  # turbo clean
pnpm clean:deps             # 清理 node_modules / lock 等（见 scripts/clean-deps.cjs）

# 开发
pnpm dev:comp               # 自定义组件
pnpm dev:page               # 自定义页面
pnpm dev:list               # 自定义列表
pnpm dev:layout             # 自定义布局

# 构建（产物输出到 zip/）
pnpm build:comp
pnpm build:page
pnpm build:list
pnpm build:layout
```

---

## 开发指南（以自定义组件为例）

### 组件放置位置

在目录 `apps/apaas-custom-components/src/components/` 下创建 `.vue` 组件文件。

### 组件元信息（title）

组件 `export default` 中的 `title` 会被用于注入到 `apaas.json`（无需你手动维护 `apaas.json`）。

示例：

```vue
<template>
  <div>hello</div>
</template>

<script>
import { FormWidgetMixin } from "@apaas/helper";

export default {
  name: "Basic",
  title: "此标题会被注入 apaas.json",
  mixins: [FormWidgetMixin],
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

### 自动注册 / 注入机制

- 约定：组件放入 `components/` 目录
- 构建/开发时会有插件扫描并将组件信息自动注入到 `apaas.json`
- 你只需要维护组件文件本身

> 更细节的实现请查看：`apps/apaas-custom-components/README.md` 以及构建配置（Rsbuild/Rslib 插件链路）。

### i18n（国际化）

各应用通常存在 `src/i18n/lang/` 目录，用于维护多语言资源。

---

## 构建与产物

- 开发：Rsbuild（只用于本地启动，不参与生产打包）
- 打包：Rslib（最终可上传平台的产物）
- 构建产物：默认输出到根目录 `zip/`

一般流程：

1. `pnpm build:comp`（或 page/list/layout）
2. 从 `zip/` 目录获取压缩包
3. 上传到得帆云对应的自定义扩展入口

---

## 技术栈概览

- Vue 2.x（`vue@^2.6.14`）
- Turborepo / pnpm workspace
- Rsbuild / Rslib
- Biome（lint/format）
- 得帆云相关 SDK（见根 `package.json` dependencies）

---

## 注意事项 / 排错

1. **Composition API 兼容性**：Composition API 与旧版 mixin 结合可能存在兼容问题；若遇到问题建议优先使用 Options API。
2. **必须使用调试插件**：不配置插件只能打包上传验证，效率较低。
3. **Node 版本一致性**：推荐使用 Volta 固定 `18.20.7`。

---

## FAQ

### Q: 如何新增一个自定义组件？

在 `apps/apaas-custom-components/src/components/` 新建 `.vue`，写好 `title`，并按需混入 `FormWidgetMixin`。

### Q: 为什么我写了代码但页面没更新？

通常需要：
- 确认 `pnpm dev:comp` 正在运行
- 确认调试插件已经将资源替换到本地地址
- 手动刷新得帆云页面

### Q: 构建产物在哪里？

在根目录 `zip/`。

---

## 联系方式

如有问题或建议，请联系：`ymzdjiang@qq.com`
