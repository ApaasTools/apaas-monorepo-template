/**
 * @author: HongYu
 * @version: 1.0.0
 * @description: 自开发布局, 需要将页面文件放在 apaas-custom-layout/layout 目录下
 */
import type { VueConstructor } from "vue";
import { mergeI18n } from "@apaas/helper";
import i18nMessage from "./i18n";
import "@apaas/ui/style.css";
import Layout from "./layout/index.vue";
import "./style.scss";

const install = (Vue: VueConstructor): void => {
  // ============================ 注册自定义布局 ===============================
  const layoutEngine = Vue?.LayoutEngine?.getInstance(
    Vue?.LayoutEngine?.currentLayoutId
  );
  // 是否缓存路由
  layoutEngine.layoutConfig.keepAliveRouter = true;
  layoutEngine.registerLayoutComponent(Layout);
  window.CustomLayoutVue = new Vue()

  // ============================ 注册多语言 ===============================
  mergeI18n(i18nMessage);
};

export default {
  install,
};
