import { defineConfig, mergeRsbuildConfig } from "@rsbuild/core";
import type { RsbuildConfig } from "@rsbuild/core";

import { rsbuildCommonConfig } from "./rsbuild.common.config";
import { pluginEnv, pluginCodeInspector } from "./plugins";

/**
 * @description rsbuild 配置
 * @see https://rsbuild.dev/zh/config/
 */
const devConfig: RsbuildConfig = defineConfig({
	plugins: [pluginEnv()],
	source: {
		entry: {
			index: ["core-js/stable", "regenerator-runtime/runtime"],
		},
	},
	tools: {
		rspack: {
			plugins: [pluginCodeInspector()],
		},
	},
});

export const rsbuildConfig = mergeRsbuildConfig(
	defineConfig(rsbuildCommonConfig),
	devConfig,
);
