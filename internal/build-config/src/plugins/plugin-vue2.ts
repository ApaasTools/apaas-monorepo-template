import { pluginVue2 as rsbuildPluginVue2 } from "@rsbuild/plugin-vue2";
// import { compile, ssrCompile } from 'vue-template-compiler'
// import { parseComponentDescriptor } from './utils/compiler'

export function pluginVue2() {
	return rsbuildPluginVue2({
		// vueLoaderOptions: {
		//     compiler: {
		//         parseComponent: parseComponentDescriptor,
		//         compile,
		//         ssrCompile,
		//     }
		// }
	});
}
