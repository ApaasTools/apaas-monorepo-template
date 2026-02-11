import type Vue from "vue";
import type { VueConstructor, ComponentOptions } from "vue";
import type { IVueI18n } from "vue-i18n";
import type VueRouter from "vue-router";

declare module "vue" {
	interface VueConstructor {
		FormEngine: {
			/**
			 * @description 注册自定义组件配置
			 * @param config
			 * @returns
			 */
			registerCustomComponentConfig: <T>(config: T) => void;
		};
	}
}

declare global {
	type VueComponent = ComponentOptions<Vue> | VueConstructor<Vue>;

	interface ContextModule {
		keys(): string[];
		(id: string): { default: VueComponent };
	}

	interface ApaasRouterInfo {
		name: string;
		path: string;
		meta: {
			title: string;
			[key: string]: any;
		};
	}

	interface ApaasCustomWidgetInfo {
		code: string;
		text: string;
	}

	interface ApaasJson {
		entry: string;
		copyAssets: string[];
		router: Record<string, ApaasRouterInfo>;
		customWidgetList: ApaasCustomWidgetInfo[];
		outputName: string;
	}

	interface WidgetConfig {
		version: number;
		code: string;
		component: {
			edit: string;
			read: string;
		};
	}

	/**
	 * @description Window 扩展
	 */
	interface Window {
		__APAAS_CONFIG__?: {
			pages?: ApaasJson;
			[key: string]: any;
		};
		/**
		 * @description Apaas SDK
		 * @see https://edu.definesys.cn/community/document-center/?id=522836116991115264&typeId=482255568958914560
		 */
		APaaSSDK?: {
			context: {
				globalVueContext: {
					$store: any;
					$root: Record<string, any>;
					$router: VueRouter;
				};
				globalVueI18n: IVueI18n;
				[key: string]: any;
			};
		};
		/**
		 * @description 是否已经引入了 tailwind css
		 */
		__is_import_tailwind__?: boolean;
		/**
		 * @description 是否已经引入了 composition api
		 */
		__is_import_composition_api__?: boolean;
		/**
		 * @description 是否已经引入了 web component
		 */
		__web_component_loaded__?: boolean;
	}
}
