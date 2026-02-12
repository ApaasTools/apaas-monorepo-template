import { defineConfig } from "@rslib/core";
import { mergeRsbuildConfig } from "@rsbuild/core";
import {
  rslibConfig,
  createResolve,
} from "@internal/build-config";

/*
 * @description rslib 配置
 * @see https://lib.rsbuild.dev/zh/config/
 */
const buildConfig = defineConfig({
  lib: [],
  resolve: {
    alias: {
      "@": createResolve(import.meta.url)("src"),
    },
  },
});

export default mergeRsbuildConfig(defineConfig(rslibConfig), buildConfig);
