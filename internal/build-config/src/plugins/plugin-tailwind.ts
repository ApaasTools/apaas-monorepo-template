import type { AcceptedPlugin, Plugin } from "postcss";
import tailwindcss from "tailwindcss";

/**
 * 工具类类名前缀，对应 tailwind.config.cjs 的 prefix。
 * 选择器里引用了它，就说明这条规则是本仓库生成的工具类。
 */
const CLASS_PREFIX_TOKEN = "yc-";

/**
 * 命中这些属性的规则不做降特异性处理。
 * padding / margin / box-sizing 是刻意要压过宿主应用的（宿主常见的
 * `* { margin: 0; padding: 0; box-sizing: content-box }` 这类 reset 特异性为 0），
 * 保持裸类 0,1,0 才能自然胜出。
 * 其中 box-sizing 来自 packages/ui/style.css 里手写的 `[class*="yc-"]` 兜底规则，
 * 它只作用于自开发组件自身，不会污染宿主，因此没有降特异性的必要。
 */
const KEEP_SPECIFICITY_RE = /^(padding|margin|box-sizing)/;

/**
 * Tailwind v4 原本靠 `@layer` 让工具类整体让位给宿主样式，但 Chrome 98 不支持
 * 级联层（`@layer` 会整块被丢弃导致样式全失效）。这里在去掉 layer 之后，
 * 用 `:where()` 把工具类特异性降到 0,0,0，效果等价：宿主任何类选择器都能覆盖它。
 *
 * `:where()` 自 Chrome 88 起支持，兼容目标浏览器。
 */
const scopeUtilities: Plugin = {
	postcssPlugin: "apaas-scope-tailwind-utilities",
	Rule(rule) {
		if (!rule.selector.includes(CLASS_PREFIX_TOKEN)) return;
		if (rule.selector.startsWith(":where(")) return;

		const keepsSpecificity = (rule.nodes ?? []).some(
			(node) => node.type === "decl" && KEEP_SPECIFICITY_RE.test(node.prop),
		);
		if (keepsSpecificity) return;

		rule.selector = `:where(${rule.selector})`;
	},
};

/**
 * 自开发样式使用的 postcss 插件链。
 *
 * - `tailwindcss()` 使用根目录 tailwind.config.cjs（v3 会自动向上查找），
 *   该配置只输出 utilities、不输出 base，避免元素级 reset 污染宿主样式。
 * - `scopeUtilities` 负责把工具类特异性降到 0，替代原来 `@layer` 的作用。
 */
export function tailwindPostcssPlugins(): AcceptedPlugin[] {
	return [tailwindcss(), scopeUtilities];
}
