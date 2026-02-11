import { parseComponent, type SFCParserOptions } from "vue-template-compiler";

declare module "vue-template-compiler" {
	interface SFCDescriptor {
		scriptSetup: any;
	}
}

/**
 * 规范化 SFC 描对象，确保字段存在并统一默认值。
 * @param descriptor SFC 描对象
 * @returns 规范化后的 SFC 描对象
 */
export function normalizeDescriptor(descriptor: any) {
	return {
		...descriptor,
		template: descriptor?.template ?? null,
		script: descriptor?.script ?? null,
		styles: descriptor?.styles ?? [],
		customBlocks: descriptor?.customBlocks ?? [],
	};
}

/**
 * 解析 setup 上的 name 和 title 属性
 * @param {string} source 源码
 * @param {SFCParserOptions} options 选项
 */
export function parseComponentDescriptor(
	source: string,
	options?: SFCParserOptions,
) {
	const descriptor = parseComponent(source, options);

	if (!descriptor.script && descriptor.scriptSetup) {
		const scriptSetup = descriptor.scriptSetup as any;
		const name = scriptSetup?.attrs?.name ?? "";
		const title = scriptSetup?.attrs?.title ?? "";

		if (name) {
			const defaultScript = `<script>
import { defineComponent } from 'vue'
export default defineComponent({
    name: '${name}',
    title: '${title}',
})
</script>
`;
			const modifiedSource = defaultScript + source;
			return normalizeDescriptor(parseComponent(modifiedSource, options));
		}
	}

	return normalizeDescriptor(descriptor);
}
