import { pluginBabel as rsbuildPluginBabel } from "@rsbuild/plugin-babel";

export function pluginBabel() {
	return rsbuildPluginBabel({
		babelLoaderOptions: {
			presets: [
				[
					"@babel/preset-env",
					{
						targets: {
							browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
						},
						useBuiltIns: "usage",
						corejs: 3,
					},
				],
				"@babel/preset-typescript",
			],
			plugins: [
				[
					"@babel/plugin-transform-runtime",
					{
						corejs: 3,
						helpers: true,
						regenerator: true,
						useESModules: false,
					},
				],
			],
			// overrides: [
			//   {
			//     test: [
			//       './src/components/input-code/identify-code/slide-block/index.vue',
			//       // './src/custom/apaas-custom-crmCustomPage/custom-page/components/BaseSearchSort.vue',
			//     ],
			//     plugins: ['@babel/plugin-transform-modules-commonjs']
			//   }
			// ]
		},
	});
}
