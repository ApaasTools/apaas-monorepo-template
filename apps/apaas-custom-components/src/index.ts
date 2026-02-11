/**
 * @author: HongYu
 * @version: 1.0.0
 * @description: 自开发页面, 自开发页面，需要将页面文件放在 apaas-custom-components/widget 目录下
 */
import type { VueConstructor } from "vue";
import { readApaasCustomComponent, mergeI18n } from "@apaas/helper";
import i18nMessage from "./i18n";
import "@apaas/ui/style.css";

const install = (Vue: VueConstructor): void => {
	// ============================  注册自开发表单组件 ================================
	const context = require.context(
		"./components",
		false,
		/\.vue$/,
	) as ContextModule;
	const components = readApaasCustomComponent(context, true);

	components.forEach(({ name, component }) => {
		const compConfig: { widgetConfig: WidgetConfig } = {
			widgetConfig: {
				version: 1.0,
				code: name,
				component: {
					edit: name,
					read: name,
				},
			},
		};
		Vue.component(name, component);
		Vue.FormEngine.registerCustomComponentConfig(compConfig);
	});

	// ============================ 注册多语言 ===============================
	mergeI18n(i18nMessage);
};

export default {
	install,
};
