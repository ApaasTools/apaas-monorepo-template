# BPM 工作流引擎 API 文档

> 包名：`@x-apaas/x-dcloud-bpm`  
> 入口：`lib/es/index.js`

## 概述

BPM 工作流引擎基于 `@antv/x6` 图编辑框架，提供流程设计器的核心能力，包括流程图绘制、节点配置、画布操作等。

---

## 导出模块

```js
import BpmnEngine from '@x-apaas/x-dcloud-bpm';

// 解构使用
const { 
  install,
  BpmnEngine,
  BpmnConfigBlock,
  BpmnGraphBlock,
  BpmnNodeBlock,
  BpmnWorkspace,
  BpmnFormItem,
  BpmnCurrentGraph
} = BpmnEngine;
```

---

## 一、BpmnEngine（流程引擎）

BPM 流程引擎核心类，负责流程图的整体管理和操作。

**主要能力：**
- 流程图初始化与渲染
- 节点和边的增删改查
- 流程数据的导入导出

---

## 二、BpmnWorkspace（工作区组件）

流程设计器工作区 Vue 组件，提供完整的流程设计画布。

**使用方式：**
```html
<BpmnWorkspace ref="workspace" :graph-data="graphData" @on-change="handleChange" />
```

**Props：**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `graphData` | `Object` | - | 流程图数据 |

**Events：**

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `on-change` | `graphData: Object` | 流程图数据变更时触发 |

---

## 三、BpmnGraphBlock（画布区块组件）

流程设计器画布区块 Vue 组件，承载 @antv/x6 画布实例。

---

## 四、BpmnNodeBlock（节点区块组件）

流程节点区块 Vue 组件，用于渲染流程中的各类节点。

---

## 五、BpmnConfigBlock（配置区块组件）

节点/边配置面板 Vue 组件，提供属性编辑表单。

---

## 六、BpmnFormItem（表单项组件）

流程配置表单项 Vue 组件，用于配置面板中的表单字段。

---

## 七、BpmnCurrentGraph（当前画布）

当前画布实例管理，提供对活跃画布的访问和操作。

---

## 插件安装

```js
import BpmnEngine from '@x-apaas/x-dcloud-bpm';

Vue.use(BpmnEngine);
```

安装后注册以下全局组件：
- `BpmnWorkspace`
- `BpmnGraphBlock`
- `BpmnNodeBlock`
- `BpmnConfigBlock`
- `BpmnFormItem`
