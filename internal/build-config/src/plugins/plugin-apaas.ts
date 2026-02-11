import type { RsbuildPlugin, RsbuildPluginAPI } from "@rsbuild/core";
import fs from "node:fs";
import path from "node:path";
import { readApaasCustomComponent } from "@apaas/helper";
import { createContextLike } from "./utils/apaas-helper";
import chalk from "chalk";

enum ApaasType {
  Editor = "apaas-custom-editor",
  Pages = "apaas-custom-pages",
  Components = "apaas-custom-components",
  List = "list",
  Layout = "layout",
}

const resolve = (dirPath: string) => path.resolve(__dirname, dirPath);
const rootPath = resolve("../../../../");

const resolveApaasPath = (type: ApaasType, apaasJson = "apaas.json") =>
  path.join(rootPath, `apps/${type}/${apaasJson}`);
const resolveComponentsPath = (type: ApaasType) =>
  path.join(rootPath, `apps/${type}/src/components`);

function getApaasJson(type: ApaasType, apaasJsonFile: string) {
  try {
    const apaasJson = fs.readFileSync(
      resolveApaasPath(type, apaasJsonFile),
      "utf-8"
    );
    return JSON.parse(apaasJson);
  } catch {
    // 返回包含默认结构的配置对象
    const defaultConfig: any = {
      entry: "index.js",
      copyAssets: [],
      outputName: "apaas-custom-editor",
    };

    // 根据不同的 ApaasType 返回适当的默认配置
    if (type === ApaasType.Pages) {
      defaultConfig.router = {};
    } else if (type === ApaasType.Components) {
      defaultConfig.customWidgetList = [];
    } else if (type === ApaasType.List) {
      defaultConfig.customWidgetList = [];
    } else if (type === ApaasType.Layout) {
      defaultConfig.router = {};
    }

    return defaultConfig;
  }
}

function writeApaasJson(absolutePath: string, data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  try {
    const existingContent = fs.readFileSync(absolutePath, "utf-8");
    if (existingContent === jsonString) {
      return;
    }
  } catch {
    console.log(chalk.red("文件不存在或读取失败，继续写入"));
  }
  fs.writeFileSync(absolutePath, jsonString);
}

/**
 * 将 JavaScript 对象以格式化的 JSON 字符串形式写入指定路径的文件中。
 * @param relativePath 相对于当前模块目录的文件路径，用于指定要写入的文件位置。
 * @param data 要写入文件的 JavaScript 对象，该对象将被转换为 JSON 字符串。
 */
function processApaasConfig(
  type: ApaasType,
  updateConfigFn: (apaasJson: any, components: any[]) => any,
  apaasJsonFile: string = "apaas.json"
) {
  const apaasJson = getApaasJson(type, apaasJsonFile);
  const context = createContextLike(resolveComponentsPath(type));

  if (!context) {
    console.log(
      chalk.yellow(
        `[Apaas Config Sync] 组件目录不存在: packages/custom/${type}/src/components，跳过同步`
      )
    );
    return;
  }

  const components = readApaasCustomComponent(
    context,
    type === ApaasType.Components
  );

  // 计算变更统计
  const oldEntries = getConfigEntries(apaasJson, type);
  const newEntries = components.map((c) => c.name);

  const added = newEntries.filter((name) => !oldEntries.includes(name));
  const deleted = oldEntries.filter(
    (name: string) => !newEntries.includes(name)
  );
  const updated = newEntries.filter((name) => oldEntries.includes(name));

  const updatedJson = updateConfigFn(apaasJson, components);
  writeApaasJson(resolveApaasPath(type, apaasJsonFile), updatedJson);

  // 输出处理成功的日志
  console.log(
    chalk.green(
      `[Apaas Config Sync] ${type} 配置同步完成: ${components.length} 个组件 (新增: ${added.length}, 更新: ${updated.length}, 删除: ${deleted.length})`
    )
  );
}

/**
 * 从配置对象中提取现有的组件条目名称列表
 */
function getConfigEntries(apaasJson: any, type: ApaasType): string[] {
  if (type === ApaasType.Pages || type === ApaasType.Layout) {
    return Object.keys(apaasJson.router || {});
  } else if (type === ApaasType.Components || type === ApaasType.List) {
    return (apaasJson.customWidgetList || []).map((item: any) => item.code);
  }
  return [];
}

function updatePagesConfig(apaasJson: any, components: any[]) {
  const newRouter: Record<string, any> = {};

  components.forEach(({ name, component }) => {
    newRouter[name] = {
      name: name,
      path: name,
      meta: {
        title: component?.title || name,
      },
    };
  });

  return { ...apaasJson, router: newRouter };
}

function updateComponentsConfig(apaasJson: any, components: any[]) {
  const newWidgets: { code: string; text: string }[] = [];

  components.forEach(({ name, component }) => {
    newWidgets.push({
      code: name,
      text: component?.title ?? name,
    });
  });

  return { ...apaasJson, customWidgetList: newWidgets };
}

function writeApaasAllJson(type: ApaasType, customArgs: Record<string, any>) {
  let apaasJsonFile: string;

  if (customArgs?.name) {
    // 如果已包含 .json 后缀则直接使用，否则加上后缀
    if (customArgs.name.endsWith(".json")) {
      apaasJsonFile = customArgs.name;
    } else {
      apaasJsonFile = `apaas-${customArgs.name}.json`;
    }
  } else {
    apaasJsonFile = "apaas.json";
  }

  try {
    processApaasConfig(type, updateComponentsConfig, apaasJsonFile);
    // if (type === ApaasType.Pages) {
    // 	processApaasConfig(type, updatePagesConfig, apaasJsonFile);
    // }

    // if ([ ApaasType.Components,ApaasType.Editor	].includes(type)) {
    // 	processApaasConfig(
    // 		type,
    // 		updateComponentsConfig,
    // 		apaasJsonFile,
    // 	);
    // }
  } catch (error) {
    console.log("写入 apaas.json 失败", error);
  }
}

export function pluginApaas(): RsbuildPlugin {
  return {
    name: "plugin-apaas",
    post: ["rsbuild:vue2"],
    setup(api: RsbuildPluginAPI) {
      const entryPath = process.env.PUBLIC_ENTRY;
      const type = entryPath?.split("/")?.at(-3) as ApaasType;

      // 从环境变量读取自定义参数
      const customArgsStr = process.env.PUBLIC_CUSTOM_ARGS;
      const customArgs = customArgsStr ? JSON.parse(customArgsStr) : {};

      api.onBeforeStartDevServer(() => {
        writeApaasAllJson(type, customArgs);
      });

      api.onBeforeBuild(() => {
        writeApaasAllJson(type, customArgs);
      });
    },
  };
}
