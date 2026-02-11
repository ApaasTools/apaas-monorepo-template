## 项目简介

本项目是一个面向得帆云(Apaas)的自定义组件开发工具集，采用 Turborepo + pnpm workspace 的 Monorepo 架构。

### 项目结构

```
.
├── apps/                          # 应用目录
│   └── apaas-custom-components/   # 自定义组件
│       ├── src/
│       │   ├── components/        # 自定义组件（如 yc-editor.vue）
│       │   ├── utils/             # 工具函数
│       │   ├── i18n/              # 国际化配置
│       │   └── index.ts           # 入口文件
│       └── rslib.config.ts        # Rslib 构建配置
├── packages/                      # 共享包目录
│   ├── editor/                    # Umo Editor 富文本编辑器包（源码，修改了一丢丢，具体自己看官方文档）
│   ├── helper/                    # 辅助工具包（mixins、directives 等）
│   └── ui/                        # UI 组件库（暂时没用到）
├── internal/                      # 内部配置包
│   ├── build-config/              # 构建配置
│   └── typescript-config/         # TypeScript 配置
├── scripts/                       # 构建和开发脚本
└── zip/                           # 打包输出目录（压缩包、开发缓存目录）
```

## 前期准备

### 1、环境要求

- **Node.js** >= 18（推荐 18.20.7）
- **pnpm** >= 10

> 💡 建议使用 [`volta`](https://volta.sh/) 来管理 Node.js 环境，确保团队环境一致性。

#### Volta 使用示例

```bash
# 安装指定 Node 版本
volta install node@18.20.7

# 全局安装 pnpm
volta install pnpm
```

### 2、相关资料

- [得帆云开发文档](https://edu.definesys.cn/community/document-center/?id=520252052773797888&typeId=481474084123705344&version=V1_0)
- [Apaas 调试插件下载](https://github.com/xie392/apaas-crx/releases/tag/v0.0.5)
- [Apaas 调试插件使用方法](https://av7ieo7ha48.feishu.cn/wiki/TcfMwSz6vixFikkcC1zcChsNnne?from=from_copylink)

## 快速开始

### 1、安装依赖

```bash
pnpm install
```

### 2、配置得帆云调试插件（必须）

本项目需要配合得帆云调试插件进行在线调试：

1. 下载并安装 [Apaas 调试插件](https://github.com/xie392/apaas-crx/releases/tag/v0.0.5)
2. 参考[使用文档](https://av7ieo7ha48.feishu.cn/wiki/TcfMwSz6vixFikkcC1zcChsNnne?from=from_copylink)配置插件

> 📌 项目已迁移到 Rsbuild（开发）和 Rslib（打包），插件配置方式保持不变。

### 3、开发调试

```bash
# 启动自定义组件开发服务
pnpm dev:comp
```

启动后，通过得帆云调试插件即可在开发环境中实时预览(需要手动刷新页面)和调试组件。

## 开发指南

### 创建自定义组件

1. 在 `apps/apaas-custom-components/src/components/` 目录下创建 `.vue` 文件
2. 组件需要使用 `FormWidgetMixin` 混入以获得表单组件能力
3. 组件会自动注册到得帆云表单引擎（apaas.json）

示例组件结构：

```vue
<template>
  <div>
    <!-- 组件内容 -->
  </div>
</template>

<script>
import { FormWidgetMixin } from "@apaas/helper";

export default {
  title: "组件名称",
  mixins: [FormWidgetMixin],
  // 组件逻辑
};
</script>
```

### 可用命令

```bash
# 开发
pnpm dev:comp              # 启动自定义组件开发服务

# 构建
pnpm build:comp            # 构建自定义组件（包含 Web Component）

# 代码质量
pnpm lint                  # 代码检查
pnpm format                # 代码格式化

# 清理
pnpm clean                 # 清理构建产物
pnpm clean:deps            # 清理依赖
```

## 技术栈

### 得帆云 SDK

- `@x-apaas/x-dcloud-page-engine` - 页面引擎
- `@x-apaas/x-dcloud-low-code-engine` - 低代码引擎
- `@x-apaas/x-dcloud-business-object` - 业务对象
- `@x-ui/x-dcloud-ui` - UI 组件库

### 编辑器

- **Umo Editor** - 基于 Tiptap 的富文本编辑器
- **Tiptap** - 无头编辑器框架

### 工具库

- **Lodash** - JavaScript 实用工具库
- **CryptoJS** - 加密库
- **Tailwind CSS** - 原子化 CSS 框架

## 包说明

### @apaas/helper

提供开发自定义组件所需的辅助工具：

- `FormWidgetMixin` - 表单组件混入
- `readApaasCustomComponent` - 组件读取工具
- `registerCompositionAPI` - Composition API 注册
- `mergeI18n` - 国际化合并工具

### @apaas/ui

UI 组件库，提供通用的 UI 组件和样式。

### @umoteam/editor

基于 Umo Editor 的富文本编辑器包，支持：

- 丰富的文档编辑功能
- Markdown 语法支持
- 多种节点类型插入
- 文件上传和管理
- 导出和打印功能
- Web Component 模式

## 注意事项

1. **Composition API 兼容性**：目前 Composition API 与自开发组件原有的 mixin 结合使用可能存在问题，建议优先使用 Options API
2. **插件依赖**：开发调试必须配合得帆云调试插件使用
3. **Node 版本**：严格使用 Node 18.20.7 以确保构建一致性

## 常见问题

### Q: 如何添加新的自定义组件？

A: 在 `apps/apaas-custom-components/src/components/` 目录下创建 `.vue` 文件，组件会自动注册。

### Q: 如何调试组件？

A: 运行 `pnpm dev:comp` 启动开发服务，配合得帆云调试插件在平台中实时预览。

### Q: 构建产物在哪里？

A: 构建后的文件会输出到 `zip/` 目录，可直接上传到得帆云平台。


## 联系方式

如有问题或建议，可以向我发送消息。我的邮箱为 ymzdjiang@qq.com
