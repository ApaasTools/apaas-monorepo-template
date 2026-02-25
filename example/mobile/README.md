# CRM 自开发移动端

> 目前此项目只有移动端自开发组件。

## 项目说明

本项目使用了 `tailwindcss`和 `cube-ui` 作为前端样式库。


【文档】
- [tailwindcss](https://v2.tailwindcss.com/)
- [cube-ui](https://didi.github.io/cube-ui/#/zh-CN/docs/quick-start)

> 建议安装插件 `Tailwind CSS IntelliSense` 以更好的提示 `tailwindcss` 相关的类名。

## 环境说明

> ~~本项目采用 `volta` 来管理 `node` 版本，`node` 版本为 `v14.21.3`，请确保本地 `node` 版本为 `>= 14 <= 16`。~~
> 本项目已经去除 `node-sass`,不在强制要求 `node` 版本在 `14`, 建议使用 `pnpm` 安装依赖

## 安装依赖

建议直接使用下面该命令进行安装依赖：

```bash
pnpm ci
# 或
npm ci
# 或
yarn install --frozen-lockfile
```

如果安装不成功再使用

```shell
pnpm install
# 或
npm install
# 或
yarn install
```

> 以上方法安装都不成功，在 `package.json` 中删除所有私有包，再使用 `npm install` 或 `yarn install` 进行安装。安装完成后在粘贴回去，找开发人员复制私有包到 `node_modules` 中。【注意】：里面有引用了 `@x-ui`但没有在 `package.json` 中有声明，在复制时需要把 `@x-ui` 也复制进来。

【私有包】
- "@x-apaas/x-apaas-frontend-i18n": "3.3.4-rc.1"
- "@x-apaas/x-dcloud-bpm": "3.3.4-rc.1"
- "@x-apaas/x-dcloud-business-event": "3.3.4-rc.2"
- "@x-apaas/x-dcloud-business-object": "3.2.11-stable.1"
- "@x-apaas/x-dcloud-low-code-engine": "3.3.4-rc.1"
- "@x-apaas/x-dcloud-page-engine": "3.3.4-rc.2"
- "@x-apaas/x-dcloud-page-mobile": "rc"
- "@x-apaas/x-dcloud-page-web": "3.3.4-rc.2"
- "@x-apaas/x-lib-rule-engine": "3.3.4-rc.1"



## 运行

```bash
pnpm serve
# 或
npm run serve
# 或
yarn serve
```

## custom/apaas-custom-crmMobile 介绍

- 自开发页面请写在 `custom-page/pages` 目录下
- 自开发组件请写在 `custom-components/form-component/form-widget/edit/compoents` 目录下,配置写在 `custom-components/form-config/form-widget/config` 目录下

> 在以上目录下编写代码可减少许多配置

## 打包

> 【前提】：需全局安装有 `@x-apaas/x-apaas-cli`，如果没有请查阅[文档](https://edu.definesys.cn/community/document-center/?id=522836118572367872&typeId=482255568958914560&version=V1_0)进行安装。

`apaas-custom-crmMobile` 打包

```shell
pnpm build
# 或
npm run build
# 或
yarn build
```

