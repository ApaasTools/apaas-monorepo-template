const path = require("node:path");
// 需要时在启用
// const defaultTheme = require("tailwindcss/defaultTheme");

/**
 * 间距、字号、圆角固定为 px：Tailwind v3 默认刻度基于 rem，
 * 会被宿主应用缩小 html 根字号影响导致组件整体变小，这里整体换算成 px。
 */
// const remToPx = (value) =>
// 	typeof value === "string" && value.endsWith("rem")
// 		? `${Number.parseFloat(value) * 16}px`
// 		: value;

// const toPxScale = (scale) =>
// 	Object.fromEntries(
// 		Object.entries(scale).map(([key, value]) => [
// 			key,
// 			Array.isArray(value)
// 				? [
// 						remToPx(value[0]),
// 						value[1] ? { ...value[1], lineHeight: remToPx(value[1].lineHeight) } : undefined,
// 					]
// 				: remToPx(value),
// 		])
// 	);

module.exports = {
	// 前缀避免与宿主应用类名冲突。
	// 注意 v3 与 v4 的变体顺序相反：v3 是「变体在前、前缀在后」，如 hover:yc-bg-blue-500、before:yc-content-['x']
	prefix: "yc-",
	content: [
		path.join(__dirname, "apps/*/src/**/*.{vue,js,ts,jsx,tsx}"),
		path.join(__dirname, "packages/*/src/**/*.{vue,js,ts,jsx,tsx}"),
	],
	// theme: {
	// 	spacing: toPxScale(defaultTheme.spacing),
	// 	fontSize: toPxScale(defaultTheme.fontSize),
	// 	borderRadius: toPxScale(defaultTheme.borderRadius),
	// },
};