import type { RsbuildPlugin, RsbuildPluginAPI } from "@rsbuild/core";
import fs from "node:fs";
import { createContextLike } from "./utils/apaas-helper";
import { readApaasCustomComponent } from "@apaas/helper";

export enum ApaasType {
  Components = "components",
  Pages = "pages",
  List = "list",
  Layout = "layout",
}

export interface PluginApaasOptions {
  /**
   * apaas.json 文件路径
   */
  path: string;
  /**
   * 类型
   */
  type: ApaasType;
  /**
   * 组件目录路径
   */
  dir: string;
}

export function pluginApaas(options: PluginApaasOptions): RsbuildPlugin {
  return {
    name: "plugin-apaas2",
    post: ["rsbuild:vue2"],
    setup(api: RsbuildPluginAPI) {
      api.onBeforeStartDevServer(() => {
        writeApaasAllJson(options);
      });

      api.onBeforeBuild(() => {
        writeApaasAllJson(options);
      });
    },
  };
}

function getApaasJson(path: string) {
  try {
    const apaasJson = fs.readFileSync(path, "utf-8");
    return JSON.parse(apaasJson);
  } catch {
    return null;
  }
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

function writeApaasAllJson(options: PluginApaasOptions) {
  try {
    const { path, type, dir } = options;

    // 读取 apaas.json 文件
    const apaasJson = getApaasJson(path);
    if (!apaasJson) {
      console.log("没有找到 apaas.json文件");
      return;
    }

    // 读取 dir 目录下的所有 vue 文件
    const ctx = createContextLike(dir);
    if (!ctx) {
      console.log("组件目录不存在：", dir);
      return;
    }

    const components = readApaasCustomComponent(
      ctx,
      ![ApaasType.List, ApaasType.Pages].includes(type)
    );

    // 计算变更统计
    const oldEntries = getConfigEntries(apaasJson, type);
    const newEntries = components.map((c: any) => c.name);

    const added = newEntries.filter(
      (name: string) => !oldEntries.includes(name)
    );
    const deleted = oldEntries.filter(
      (name: string) => !newEntries.includes(name)
    );
    const updated = newEntries.filter((name: string) =>
      oldEntries.includes(name)
    );

    let updatedJson = apaasJson;

    if (type === ApaasType.Pages) {
      updatedJson = updatePagesConfig(apaasJson, components);
    }

    if (type === ApaasType.Components) {
      updatedJson = updateComponentsConfig(apaasJson, components);
    }

    // TODO: 添加 list / layout

    writeApaasJson(path, updatedJson);

    // 输出处理成功的日志
    console.log(
      `[Apaas Config Sync] ${type} 配置同步完成: ${components.length} 个组件 (新增: ${added.length}, 更新: ${updated.length}, 删除: ${deleted.length})`
    );
  } catch (error) {}
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

function writeApaasJson(absolutePath: string, data: any) {
  const jsonString = JSON.stringify(data, null, 2);
  try {
    const existingContent = fs.readFileSync(absolutePath, "utf-8");
    if (existingContent === jsonString) {
      return;
    }
  } catch {
    console.log("文件不存在或读取失败，继续写入");
  }
  fs.writeFileSync(absolutePath, jsonString);
}
