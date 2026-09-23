import type { VueConstructor } from "vue";
import type { LocaleMessageObject } from "vue-i18n";

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
 * 获取文件名
 * @param path 文件路径
 * @returns 文件名
 */
export function getFileName(path: string) {
	return path?.split("/")?.pop()?.replace(".vue", "") ?? "";
}

/**
 * 读取组件, 并返回组件列表
 * @param context 组件上下文
 * @param isPascalCase 是否转换为驼峰命名
 * @returns 组件列表
 */
export function readApaasComponent(
	context: ContextModule,
	isPascalCase = false,
) {
	return (
		context.keys().map((key: string) => {
			const component = context(key).default as VueConstructor<Vue> & {
				title: string;
			};
			let name = getFileName(key);
			name = toPascalCase(name);
			return {
				name: isPascalCase ? name : `apaas-${name}`,
				component,
			};
		}) ?? []
	);
}

/**
 * 读取组件, 并返回组件列表
 * @param context 组件上下文
 * @param isPascalCase 是否转换为驼峰命名
 * @returns 组件列表
 */

/**
 * 读取自定义组件, 并返回组件列表
 * @param context 组件上下文
 * @param isPascalCase 是否转换为驼峰命名
 * @returns 组件列表
 */
export function readApaasCustomComponent(
	context: ContextModule,
	isPascalCase = false,
) {
	return (
		context.keys().map((key: string) => {
			const component = context(key).default as VueConstructor<Vue> & {
				title: string;
			};
			// let name = key.replace(/^\.\/(.*?)\.vue$/, "$1");
			let name = getFileName(key);
			name = toPascalCase(name);
			return {
				name: isPascalCase ? name : `apaas-custom-${name}`,
				component,
			};
		}) ?? []
	);
}

/**
 * 合并 i18n 语言包
 *
 * @param {Object} messages - 要注册的语言包对象
 * @returns {void}
 * @example
 * mergeI18n({
 *   'en': {
 *     message: {
 *       hello: 'hello world'
 *     }
 *   },
 *   'zh': {
 *     message: {
 *       hello: '你好，世界'
 *     }
 *   }
 * })
 *
 * 在页面使用：
 * <template>
 *   <div>{{ $t('message.hello') }}</div>
 * </template>
 *
 * 在js中使用
 * this.$t('message.hello')
 */
export function mergeI18n(messages: {
	[key: string]: LocaleMessageObject;
}): void {
	const i18n = window?.APaaSSDK?.context?.globalVueI18n;
	if (i18n) {
		for (const key in messages) {
			i18n.mergeLocaleMessage(key, messages[key]);
		}
	}
}

/**
 * 为了避免重复引入 css，这里做一个全局控制
 * @returns void
 */
export let registerTailwind = () => {
	if (!window.__is_import_tailwind__) {
		window.__is_import_tailwind__ = true;
		registerTailwind = () => {};
	}
};

/**
 * 注册 composition API，避免重复注册
 * @param {VueConstructor} Vue 实例
 * @returns void
 */
// export let registerCompositionAPI = (Vue: VueConstructor) => {
//   if (!window.__is_import_composition_api__) {
//     Vue.use(VueCompositionAPI);
//     window.__is_import_composition_api__ = true;
//     registerCompositionAPI = () => {};
//   }
// };

/**
 * 获取平台全局环境变量 window.GLOBAL_ENV 上的指定字段
 * @param key GLOBAL_ENV 上的字段名
 * @returns 字段值（不存在时返回 undefined）
 * @example
 * const appId = getGlobalEnv('VUE_APP_APP_ID')
 */
export function getGlobalEnv<K extends keyof NonNullable<Window["GLOBAL_ENV"]>>(
	key: K,
): NonNullable<Window["GLOBAL_ENV"]>[K] {
	return window.GLOBAL_ENV?.[key];
}

/**
 * 获取自定义环境变量 window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV 中的指定字段
 *
 * 平台的业务开关 / 环境配置大多挂在 VUE_APP_CUSTOM_ENV 下，统一走此方法取值
 *
 * @param key VUE_APP_CUSTOM_ENV 上的字段名
 * @param defaultValue 可选，字段不存在时的默认值
 * @returns 字段值（不存在时返回 defaultValue）
 * @example
 * const asyncOp = getCustomEnv('LIST_TABLE_OPERATION_ASYNC', false)
 * const camera = getCustomEnv<string>('VUE_APP_CAMERA_SERVICE', '')
 */
export function getCustomEnv<T = any>(
	key: string,
	defaultValue?: T,
): T | undefined {
	const value = window.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.[key];
	return (value === undefined || value === null ? defaultValue : value) as
		| T
		| undefined;
}
