import { createResolve, rsbuildConfig } from "@internal/build-config";
import { defineConfig, mergeRsbuildConfig, RsbuildConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginSass as rsbuildPluginSass } from "@rsbuild/plugin-sass";

/*
 * @description rsbuild 配置
 * @see https://lib.rsbuild.dev/zh/config/
 */
const buildConfig = defineConfig({
  plugins: [
    rsbuildPluginSass({
      sassLoaderOptions: {
        api: "legacy",
        sassOptions: {
          silenceDeprecations: ["legacy-js-api", "import", "mixed-decls"],
          includePaths: [
            "../node_modules/@x-apaas/x-dcloud-page-web/lib/theme-chalk/theme",
            "../node_modules/@x-ui/x-dcloud-ui/lib/theme-chalk/theme",
            "../node_modules/element-ui/packages/theme-chalk/src",
            "../node_modules/element-ui/lib/theme-chalk",
          ],
        },
        additionalData: `@import "@/assets/scss/variable.scss";`,
      },
    }),
    pluginBabel({
      babelLoaderOptions: {
        // 排除一些不需要被 babel 编译的文件，跳过 event 目录下所有 .js
        exclude: [/src[\\/]custom[\\/]common[\\/]event[\\/].*\.js$/],
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
              },
              useBuiltIns: "usage",
              corejs: 3,
            },
          ],
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              corejs: 3,
              helpers: true,
              regenerator: true,
              useESModules: false,
            },
          ],
        ],
        overrides: [
          {
            test: [
              "./src/components/input-code/identify-code/slide-block/index.vue",
              "./src/custom/apaas-custom-crmCustomPage/custom-page/components/BaseSearchSort.vue",
              "./src/assets/js/vuedraggable.js",
            ],
            plugins: ["@babel/plugin-transform-modules-commonjs"],
          },
        ],
      },
    }),
  ],
  html: {
    title: "web",
    template: createResolve(import.meta.url)("public/index.html"),
  },
  source: {
    define: {
      BASE_URL: JSON.stringify("/"),
    },
    entry: {
      index: [
        "core-js/stable",
        "regenerator-runtime/runtime",
        createResolve(import.meta.url)("src/main.js"),
      ],
    },
    exclude: [
      /src[\\/]custom[\\/]common[\\/]event[\\/].*\.js$/,
      /\.zip$/,
      /\.md$/,
      /\.txt$/,
    ],
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
  resolve: {
    alias: {
      "@": createResolve(import.meta.url)("src"),
    },
  },
} as RsbuildConfig);

export default mergeRsbuildConfig(rsbuildConfig, buildConfig);
