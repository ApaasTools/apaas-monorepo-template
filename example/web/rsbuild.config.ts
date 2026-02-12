import { createResolve, rsbuildConfig } from "@internal/build-config";
import { defineConfig, mergeRsbuildConfig } from "@rsbuild/core";

/*
 * @description rsbuild 配置
 * @see https://lib.rsbuild.dev/zh/config/
 */
const buildConfig = defineConfig({
  html: {
    title: "web",
    template: createResolve(import.meta.url)("public/index.html"),
  },
  source: {
    define: {
      BASE_URL: JSON.stringify("/"),
    },
    entry: {
      index: ["core-js/stable", "regenerator-runtime/runtime", createResolve(import.meta.url)("src/main.js")],
    },
    exclude: [/src[\\/]custom[\\/]common[\\/]event[\\/].*\.js$/, /\.zip$/, /\.md$/, /\.txt$/],
  },
  tools: {
    bundlerChain: (chain) => {
      //  svg 处理， 对标得帆之前使用的 svg 方式
      chain.module.rules.delete("svg");
      chain.module
        .rule("svg")
        .test(/\.svg$/)
        .include.add([
          createResolve(import.meta.url)("src/assets/icon"),
          /@x-apaas\/x-dcloud-page-web\/lib\/assets\/icon/,
          /@x-ui\/x-dcloud-ui\/lib\/assets\/icon/,
          /x-dcloud-page-web[\\/]lib[\\/]assets[\\/]icon/,
          /x-dcloud-ui[\\/]lib[\\/]assets[\\/]icon/,
        ])
        .end()
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options({ symbolId: "svg-[name]" })
        .end()
        .use("svgo-loader")
        .loader("svgo-loader")
        .options({
          plugins: [
            "removeDoctype",
            "removeXMLProcInst",
            "removeComments",
            "removeMetadata",
            "removeTitle",
            "removeDesc",
            "removeUselessDefs",
            "removeEmptyAttrs",
          ],
        });
    },
  },
});

export default mergeRsbuildConfig(rsbuildConfig, buildConfig);
