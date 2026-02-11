import type { RsbuildPlugin, RsbuildPluginAPI } from "@rsbuild/core";
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";
import fs from "node:fs";

export function pluginEnv(): RsbuildPlugin {
	return {
		name: "plugin-env",
		setup(api: RsbuildPluginAPI) {
			// 通过接口获取环境变量并注入到 window 上
			api.onAfterStartDevServer(async () => {
				const envUrl = process.env.RSBUILD_ENV_URL;
				if (!envUrl) return;
				const parsedUrl = new URL(envUrl + "/app/config/env.tmpl.js");
				// 根据协议选择模块
				const requestModule = parsedUrl.protocol === "https:" ? https : http;

				try {
					requestModule
						.get(parsedUrl, (res) => {
							let data = "";
							res.on("data", (chunk) => {
								data += chunk;
							});
							res.on("end", () => {
								// 写入到 public/env.js
								fs.writeFileSync("public/env.js", data);
								console.log("\x1b[32m%s\x1b[0m", "plugin-env env.js 写入成功");
							});
						})
						.on("error", (err) => {
							console.log(
								"\x1b[31m%s\x1b[0m",
								"plugin-env env.js 写入失败, 请检查环境变量 RSBUILD_ENV_URL 是否正确配置",
							);
						});
				} catch (error) {
					console.log("error", error);
				}
			});
		},
	};
}
