import { loadEnv } from "@rsbuild/core";
import type { RsbuildConfig, ServerConfig } from "@rsbuild/core";
import { fileURLToPath } from "url";

import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginBabel, pluginSass, pluginVue2, pluginApaas } from "./plugins";
import scriptSetup from "unplugin-vue2-script-setup/webpack";

import postcss from "@tailwindcss/postcss";

export const resolve = (dir: string) =>
	fileURLToPath(new URL(dir, import.meta.url));

/**
 * 创建相对于指定 URL 的 resolve 函数
 * @param baseUrl - 基础 URL，通常传入 import.meta.url
 * @returns resolve 函数
 */
export const createResolve = (baseUrl: string) => {
	return (dir: string) => fileURLToPath(new URL(dir, baseUrl));
};

/** 兼容环境变量 */
export const { publicVars } = loadEnv({ prefixes: ["VUE_APP_"] });
/** 入口文件 */
export const entry = process.env.PUBLIC_ENTRY || resolve("./src/index.ts");
/** 构建输出名 */
export const outputName = process.env.PUBLIC_OUTPUT_NAME || "dist";
/** 是否为 main.js 构建 */
export const isBuildDist = process.env.BUILD_TYPE === "dist";
/** 是否为开发环境 */
export const isDev = process.env.NODE_ENV === "development";

/**
 * @description 代理配置
 * @see https://rsbuild.dev/zh/config/server/proxy
 */
export const proxy: ServerConfig = {
	// '/api': {
	//   target: 'http://172.16.90.67:7011', // server地址
	//   pathRewrite: {
	//     '^/api': ''
	//   }
	// }
};

/**
 * @description rsbuild 通用配置
 * @see https://rsbuild.dev/zh/config/
 */
export const rsbuildCommonConfig: RsbuildConfig = {
	plugins: [
		pluginNodePolyfill(),
		pluginBabel(),
		pluginSass(),
		// pluginApaas(),
		pluginVue2(),
	],
	source: {
		define: publicVars,
		transformImport: [
			{
				libraryName: "element-ui",
				libraryDirectory: "lib",
				styleLibraryDirectory: "lib/theme-chalk",
			},
			{
				libraryName: "@x-ui/x-dcloud-ui",
				libraryDirectory: "lib",
				styleLibraryDirectory: "lib/theme-chalk/theme",
			},
			{
				libraryName: "@x-apaas/x-dcloud-page-web",
				libraryDirectory: "lib",
				styleLibraryDirectory: "lib/theme-chalk/theme",
			},
		],
	},
	server: {
		port: 8081,
		publicDir: {
			copyOnBuild: false,
		},
		open: false,
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			vue$: "vue/dist/vue.esm.js",
			lodash$: require.resolve("lodash"),
			canvas: require.resolve("empty-module"),
		},
		extensions: [".js", ".vue", ".json", ".css", ".scss", ".ts", ".tsx"],
	},
	tools: {
		bundlerChain: (chain) => {
			//  svg 处理， 对标得帆之前使用的 svg 方式
			chain.module.rules.delete("svg");
			chain.module
				.rule("svg")
				.test(/\.svg$/)
				.include.add([
					resolve("src/assets/icon"),
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
		rspack: {
			resolveLoader: {
				alias: {
					// 修改内联 loader 中 worker-loader 的指向，如 `worker-loader!pdfjs-dist/es5/build/pdf.worker.js`
					"worker-loader": `${require.resolve("worker-rspack-loader")}?esModule=false`,
				},
			},
			module: {
				rules: [
					{
						test: /\.worker\.js$/,
						use: {
							loader: require.resolve("worker-rspack-loader"),
							options: {
								inline: "no-fallback",
							},
						},
					},
					{
						test: /\.wasm$/,
						type: "asset/resource",
					},
				],
			},
			plugins: [scriptSetup({})],
		},
		postcss: {
			postcssOptions: {
				plugins: [postcss()],
			},
		},
	},
};
