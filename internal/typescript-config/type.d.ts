/// <reference types="./global.d.ts" />
/// <reference types="./env.d.ts" />
/// <reference types="./apaas.d.ts" />
/// <reference types="./window.d.ts" />
/// <reference types="./vue-shim.d.ts" />

declare module "*.css" {
	const content: string;
	export default content;
}

declare module "*.scss" {
	const content: string;
	export default content;
}
