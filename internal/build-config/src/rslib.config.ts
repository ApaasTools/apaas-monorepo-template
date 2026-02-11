import { defineConfig } from "@rslib/core";
import { mergeRsbuildConfig } from "@rsbuild/core";
import type { LibConfig, RslibConfig } from "@rslib/core";
import {
	rsbuildCommonConfig,
	entry,
	outputName,
	isBuildDist,
	isDev,
} from "./rsbuild.common.config";

export const libConfig: LibConfig = {
	format: "umd",
	umdName: outputName,
	syntax: ["es5"],
	output: {
		target: "web",
		filename: {
			js: isBuildDist ? "[name].[contenthash].js" : `${outputName}.umd.js`,
			css: isBuildDist ? "[name].[contenthash].css" : `${outputName}.css`,
		},
	},
};

/**
 * @description rslib 配置
 * @see https://lib.rsbuild.dev/zh/config/
 */
const buildConfig: RslibConfig = defineConfig({
	source: {
		entry: {
			index: entry,
		},
	},
	lib: [libConfig],
	output: {
		charset: "utf8",
		distPath: {
			root: `zip/${outputName}`,
			assets: "public",
			js: "",
			css: "",
			font: "public/font",
			image: "public/img",
		},
		filenameHash: false,
		assetPrefix: `/app/${outputName}/`,
		minify: {
			js: false,
			css: true,
		},
		cleanDistPath: true,
		dataUriLimit: 8 * 1024,
		legalComments: "none",
		externals: [
			"@x-ui/x-dcloud-ui",
			"@x-apaas/x-lib-rule-engine",
			"@x-apaas/x-dcloud-page-web",
			"x-extension",
		],
	},
	performance: {
		buildCache: isDev,
		printFileSize: true, // 打印文件大小
		// chunkSplit: {
		//   strategy: isBuildDist ? "split-by-experience" : "all-in-one",
		// },
		// 移除所有 log
		// removeConsole: true,
	},
});

export const rslibConfig = mergeRsbuildConfig(
	defineConfig(rsbuildCommonConfig as RslibConfig),
	buildConfig,
);
