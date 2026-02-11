# 自开发组件

## 说明

自开发页面，需要将页面文件放在 `components` 目录下，不需要手动维护 `apaas.josn`，已经编写有插件自动注入，你只需要把组件写在 `components` 目录下即可，插件会自动帮你注入到 `apaas.json` 中

> 此项目可以使用 `tailwind` v4 编写样式，大大提升开发效率。

## 相关资料及工具

- [`rsbuild 配置`](https://rsbuild.rs/zh/config/)：rsbuild 配置文档，用于本地启动开发，不参与生产打包。
- [`rslib 配置`](https://rslib.rs/zh/config/)：rslib 配置文档，打包主要使用这个，如果有定制话打包需求可以使用这个。
- [`volta`](https://volta.sh/): 用于管理 `node` 版本, 本项目采用 `node v18.20.7`
- [`pnpm`](https://pnpm.io/): 用于管理 `npm` 包, 推荐使用这个，比 `npm` 快很多
- [`apaas` 替换插件](https://av7ieo7ha48.feishu.cn/wiki/TcfMwSz6vixFikkcC1zcChsNnne): 用于在线替换网页上的自开发包，不用每次都要打包上传发布才能验证，搭配此插件可以直接编写后刷新网页就可以看到最新效果。


## 编写方法

```vue
<script>
export default {
    name: 'Basic',
    title: "此标题会被注入 apaas.json",
    data() {
        return {
            count: 0
        }
    },
    methods: {
        increment() {
            this.count++
        }
    }
}
</script>
```

## 构建

### 运行

```bash
# 搭配开发插件使用
pnpm dev:page
```

### 打包

```bash
pnpm build:page
```

## 结语

如果你在使用过程中遇到问题或者发现有不足，你可以提供宝贵的建议到 `ymzdjiang@qq.com`


