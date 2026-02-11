import type { SFCDescriptor } from "vue-template-compiler";
import fs from "node:fs";
import path from "node:path";

import { parseComponentDescriptor } from "./compiler";

/**
 * 转换为首字母大写的驼峰命名
 * @param str 要转换的字符串
 * @returns 转换后的字符串
 */
export function toPascalCase(str: string): string {
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

/**
 * 从 Vue 组件中提取属性值（支持多种写法）
 * @param sfcDescriptor Vue SFC 描述符
 * @param propName 属性名称（如 'name' 或 'title'）
 * @returns 属性值或 undefined
 */
export function extractComponentProperty(
	sfcDescriptor: SFCDescriptor,
	propName: string,
): string | undefined {
	// 1. 优先检查 <script setup name="xxx" title="xxx">
	if (sfcDescriptor.scriptSetup) {
		const attrs = (sfcDescriptor.scriptSetup as any).attrs || {};
		if (attrs[propName]) {
			return attrs[propName];
		}
	}

	// 2. 检查普通 <script> 标签
	if (sfcDescriptor.script?.content) {
		const scriptContent = sfcDescriptor.script.content;
		// 移除注释和字符串字面量（避免误匹配）
		const cleaned = scriptContent
			.replace(/\/\/.*$/gm, "") // 单行注释
			.replace(/\/\*[\s\S]*?\*\//g, "") // 多行注释
			.replace(/[`](?:\\.|[^`\\])*[`]/g, '""') // 模板字符串
			.replace(/['"](?:\\.|[^'"\\])*['"] /g, '"" '); // 普通字符串

		// 3种匹配模式，优先级从高到低
		const patterns = [
			// defineComponent({ name: 'xxx' })
			new RegExp(
				`defineComponent\\s*\\(\\s*\\{[\\s\\S]*?${propName}\\s*:\\s*['"]([^'"]+)['"]`,
				"i",
			),
			// export default { name: 'xxx' }
			new RegExp(
				`export\\s+default\\s*\\{[\\s\\S]*?${propName}\\s*:\\s*['"]([^'"]+)['"]`,
				"i",
			),
			// Vue.extend({ name: 'xxx' })
			new RegExp(
				`Vue\\.extend\\s*\\(\\s*\\{[\\s\\S]*?${propName}\\s*:\\s*['"]([^'"]+)['"]`,
				"i",
			),
			// defineAsyncComponent({ name: 'xxx' })
			new RegExp(
				`defineAsyncComponent\\s*\\(\\s*\\{[\\s\\S]*?${propName}\\s*:\\s*['"]([^'"]+)['"]`,
				"i",
			),
		];

		for (const pattern of patterns) {
			const match = cleaned.match(pattern);
			if (match?.[1]) {
				return match[1];
			}
		}
	}

	return undefined;
}

/**
 * 模拟require.context的功能，用于读取Vue组件
 * @param dirPath 目录路径
 * @returns 类似require.context的对象，包含keys和获取组件的功能
 */
export function createContextLike(dirPath: string) {
	console.info("createContextLike", dirPath);
	// 判断路径是否存在
	if (!fs.existsSync(dirPath)) {
		return null;
	}
	const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".vue"));
	const modules: Record<string, any> = {};

	// 解析Vue文件内容，提取组件信息
	files.forEach(async (filename) => {
		const filePath = path.join(dirPath, filename);
		const content = fs.readFileSync(filePath, "utf-8");

		const sfcDescriptor = parseComponentDescriptor(content, {
			pad: "line",
		});

		let name = filename.replace(/(.*)\.vue$/, "$1");
		name = toPascalCase(name);
		let title = name;

		// 使用统一的提取函数（支持多种写法）
		// const extractedName = extractComponentProperty(sfcDescriptor, 'name');
		const extractedTitle = extractComponentProperty(sfcDescriptor, "title");

		// if (extractedName) name = extractedName;
		if (extractedTitle) title = extractedTitle;

		// 构建类似于前端导入的组件对象
		modules[`./${filename}`] = {
			default: {
				name,
				title,
				render: () => {}, // 模拟渲染函数
				template: content, // 原始模板内容
				__file: path.relative(dirPath, filePath), // 相对路径
			},
		};
	});

	// 创建类似require.context的对象
	const contextLike = (id: string) => modules[id] || {};
	contextLike.keys = () => Object.keys(modules);
	contextLike.resolve = (key: string) => path.join(dirPath, key.slice(2)); // 去掉./前缀

	return contextLike;
}
