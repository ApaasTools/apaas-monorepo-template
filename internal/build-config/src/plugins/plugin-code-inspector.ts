import { codeInspectorPlugin } from "code-inspector-plugin";

export function pluginCodeInspector() {
	return codeInspectorPlugin({
		bundler: "rspack",
	});
}
