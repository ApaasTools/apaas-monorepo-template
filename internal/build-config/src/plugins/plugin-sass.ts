import { pluginSass as rsbuildPluginSass } from "@rsbuild/plugin-sass";

export function pluginSass() {
	return rsbuildPluginSass();
	// return rsbuildPluginSass({
	//   sassLoaderOptions: {
	//     api: 'legacy',
	//     sassOptions: {
	//       silenceDeprecations: ['legacy-js-api', 'import', 'mixed-decls'],
	//       includePaths: [
	//         '../node_modules/@x-apaas/x-dcloud-page-web/lib/theme-chalk/theme',
	//         '../node_modules/@x-ui/x-dcloud-ui/lib/theme-chalk/theme',
	//         '../node_modules/element-ui/packages/theme-chalk/src',
	//         '../node_modules/element-ui/lib/theme-chalk'
	//       ]
	//     },
	//     additionalData: `@import "@/assets/scss/variable.scss";`
	//   }
	// })
}
