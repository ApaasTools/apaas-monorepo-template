import { defineConfig } from "@rslib/core";
import { mergeRsbuildConfig } from "@rsbuild/core";
import {
  rslibConfig,
  createResolve,
  pluginApaas,
  ApaasType,
} from "@internal/build-config";

/*
 * @description rslib 配置
 * @see https://lib.rsbuild.dev/zh/config/
 */
const buildConfig = defineConfig({
  plugins: [
    pluginApaas({
      path: createResolve(import.meta.url)("./apaas.json"),
      type: ApaasType.Components,
      dir: createResolve(import.meta.url)("src/components"),
    }),
  ],
  lib: [],
  resolve: {
    alias: {
      "@": createResolve(import.meta.url)("src"),
    },
  },
});

export default mergeRsbuildConfig(defineConfig(rslibConfig), buildConfig);
