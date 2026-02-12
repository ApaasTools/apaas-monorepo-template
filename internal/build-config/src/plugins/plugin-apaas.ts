import type { RsbuildPlugin, RsbuildPluginAPI } from "@rsbuild/core";
import fs from "node:fs";
import { readApaasCustomComponent } from "@apaas/helper";
import { createContextLike } from "./utils/apaas-helper";

/**
 * Apaas 配置同步的目标类别。
 * 不同类型会投射到 apaas.json 的不同区域（router / customWidgetList 等）。
 */
export enum ApaasType {
  Components = "components",
  Pages = "pages",
  List = "list",
  Layout = "layout",
}

/**
 * 插件运行时所需的最小上下文：
 *  - path：目标 apaas.json 的绝对路径
 *  - type：当前需要同步的配置维度
 *  - dir：扫描 Vue 组件的物理目录
 */
export interface PluginApaasOptions {
  /** apaas.json 文件路径（建议使用绝对路径，避免 cwd 变化带来的不确定性） */
  path: string;
  /** 本次同步所处理的配置类型 */
  type: ApaasType;
  /** 扫描用的组件目录路径 */
  dir: string;
}

/**
 * 创建 Apaas 同步插件。
 *
 * 在开发服务器启动前与构建前各执行一次同步流程，
 * 将磁盘中的 Vue 组件信息折叠进 apaas.json，
 * 保证运行时读取到的是一份“当下”的目录。
 */
export function pluginApaas(options: PluginApaasOptions): RsbuildPlugin {
  return {
    name: "plugin-apaas",
    post: ["rsbuild:vue2"],
    setup(api: RsbuildPluginAPI) {
      // 开发启动与构建前都做一次同步，确保 apaas.json 始终与组件目录保持一致。
      const sync = () => syncApaasConfig(options);

      api.onBeforeStartDevServer(sync);
      api.onBeforeBuild(sync);
    },
  };
}

type ApaasComponentEntry = {
  name: string;
  component?: {
    title?: string;
  };
};

type ApaasConfig = {
  router?: Record<string, unknown>;
  customWidgetList?: Array<{ code: string; text?: string }>;
  list?: Record<string, unknown>;
};

/**
 * 读取并解析 apaas.json。
 *
 * 若文件不存在或内容不合法，则返回 null，让调用方以更从容的方式结束流程。
 *
 * @param filePath apaas.json 的绝对路径
 * @returns 解析后的配置对象；失败则返回 null
 */
function readApaasJson(filePath: string): ApaasConfig | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ApaasConfig;
  } catch {
    return null;
  }
}

/**
 * 从 apaas.json 中提取“已登记”的条目名称。
 *
 * 同步时我们需要知道：
 *  - 旧名单里有哪些名字（来自 apaas.json）
 *  - 新名单里有哪些名字（来自组件目录）
 * 这样才能算出新增、删除与仍在场的条目。
 *
 * @param apaasJson 已解析的 apaas.json
 * @param type 同步类型（决定读取 router 还是 customWidgetList）
 * @returns 条目名称列表
 */
function getConfigEntries(apaasJson: ApaasConfig, type: ApaasType): string[] {
  switch (type) {
    case ApaasType.Pages:
      return Object.keys(apaasJson.router || {});
    case ApaasType.Components:
      return (apaasJson.customWidgetList || []).map((item) => item.code);
    case ApaasType.List:
      return Object.keys(apaasJson.list || {});
    default:
      return [];
  }
}

/**
 * 计算条目差异（added / deleted / updated）。
 *
 * 这里的 "updated" 并不表示内容一定发生了变化，
 * 它只意味着：这个名字在旧名单与新名单中都出现了——
 * 像是熟悉的标题，仍然留在目录里。
 *
 * @param oldEntries 旧名单
 * @param newEntries 新名单
 */
function diffEntries(oldEntries: string[], newEntries: string[]) {
  const oldSet = new Set(oldEntries);
  const newSet = new Set(newEntries);

  const added = newEntries.filter((name) => !oldSet.has(name));
  const deleted = oldEntries.filter((name) => !newSet.has(name));
  const updated = newEntries.filter((name) => oldSet.has(name));

  return { added, deleted, updated };
}

/**
 * 按类型将组件信息“投影”到 apaas.json 的不同字段。
 *
 * 你可以把它理解为一个分发器：
 * Pages -> router
 * Components -> customWidgetList
 * List/Layout 目前保持原样（后续可在这里扩展）。
 *
 * @param apaasJson 原始配置
 * @param type 同步类型
 * @param components 组件条目
 */
function updateConfigByType(
  apaasJson: ApaasConfig,
  type: ApaasType,
  components: ApaasComponentEntry[]
): ApaasConfig {
  switch (type) {
    case ApaasType.Pages:
      return updatePagesConfig(apaasJson, components);
    case ApaasType.Components:
      return updateComponentsConfig(apaasJson, components);
    case ApaasType.List:
      return updateListConfig(apaasJson, components);
    case ApaasType.Layout:
    default:
      return apaasJson;
  }
}

/**
 * 执行一次 apaas.json 同步。
 *
 * 流程很短，但很确定：
 *  - 读 apaas.json（旧世界）
 *  - 扫组件目录（新世界）
 *  - 计算差异并按类型生成新配置
 *  - 如内容确有变化再落盘
 *
 * 失败不会抛出异常中断构建：
 *  - 找不到 apaas.json / 找不到组件目录 -> 直接打印日志并返回。
 *
 * @param options 同步所需参数
 */
function syncApaasConfig(options: PluginApaasOptions) {
  const { path, type, dir } = options;

  const apaasJson = readApaasJson(path);
  if (!apaasJson) {
    console.log("没有找到 apaas.json文件");
    return;
  }

  const ctx = createContextLike(dir);
  if (!ctx) {
    console.log("组件目录不存在：", dir);
    return;
  }

  const components = readApaasCustomComponent(
    ctx,
    ![ApaasType.List, ApaasType.Pages].includes(type)
  ) as ApaasComponentEntry[];

  const oldEntries = getConfigEntries(apaasJson, type);
  const newEntries = components.map((c) => c.name);
  const { added, deleted, updated } = diffEntries(oldEntries, newEntries);

  const updatedJson = updateConfigByType(apaasJson, type, components);
  
  writeApaasJson(path, updatedJson);

  console.log(
    `[Apaas Config Sync] ${type} 配置同步完成: ${components.length} 个组件 (新增: ${added.length}, 更新: ${updated.length}, 删除: ${deleted.length})`
  );
}

/**
 * 生成 Pages 类型的 router 配置。
 *
 * 每个组件名都会成为一条路由的 key：
 *  - name/path 使用组件名
 *  - title 优先取组件元信息中的 title，否则回落到 name
 *
 * @param apaasJson 原始配置
 * @param components 从目录读到的组件条目
 */
function updatePagesConfig(
  apaasJson: ApaasConfig,
  components: ApaasComponentEntry[]
): ApaasConfig {
  const router: Record<string, unknown> = {};

  components.forEach(({ name, component }) => {
    router[name] = {
      name,
      path: name,
      meta: {
        title: component?.title || name,
      },
    };
  });

  return { ...apaasJson, router };
}

/**
 * 生成 Components 类型的 customWidgetList 配置。
 *
 * 这里把组件清单“排成队”：
 *  - code 使用组件名
 *  - text 优先取 title，否则回落到 name
 *
 * @param apaasJson 原始配置
 * @param components 从目录读到的组件条目
 */
function updateComponentsConfig(
  apaasJson: ApaasConfig,
  components: ApaasComponentEntry[]
): ApaasConfig {
  const customWidgetList = components.map(({ name, component }) => ({
    code: name,
    text: component?.title ?? name,
  }));

  return { ...apaasJson, customWidgetList };
}

/**
 * 生成 List 类型的 list 配置。
 * @param apaasJson 原始配置
 * @param components 从目录读到的组件条目
 * @returns List 类型的 list 配置
 */
function updateListConfig(
  apaasJson: ApaasConfig,
  components: ApaasComponentEntry[]
): ApaasConfig {
  const list: Record<string, unknown> = {};

  components.forEach(({ name, component }) => {
    console.info("name", name);
    list[name] = {
      renderLogic: "FORM_LIST_DEMO",
      desc: component?.title ?? name,
      status: "ENABLE",
    };
  });

  return { ...apaasJson, list };
}
/**
 * 将配置写回到 apaas.json。
 *
 * 只有当内容发生变化时才会落盘，
 * 避免无意义的写入触发 watcher
 *
 * @param absolutePath apaas.json 绝对路径
 * @param data 要写入的配置对象
 */
function writeApaasJson(absolutePath: string, data: unknown) {
  const jsonString = JSON.stringify(data, null, 2);

  try {
    const existingContent = fs.readFileSync(absolutePath, "utf-8");
    if (existingContent === jsonString) {
      return;
    }
  } catch {
    // 文件不存在或暂时不可读时，继续尝试写入即可。
  }

  fs.writeFileSync(absolutePath, jsonString);
}
