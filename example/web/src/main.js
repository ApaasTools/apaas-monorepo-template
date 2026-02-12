import "./assets/scss/index.scss";
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import i18n from "./locale/index.js";
import "./vendor/element-ui.js";
import "./vendor/x-lib-ui.js";
import "./icons/index.js"; // icon
import "./plugins/index.js";
import "./vendor/x-dcloud-layout-engine/x-dcloud-layout-engine.js";
import "./vendor/x-dcloud-list-engine/x-dcloud-list-engine.js";
import XProxyFormItem from "@/components/x-proxy-form-item/x-proxy-form-item.vue";

import pages from "apaas-custom-pages";
import pagesJson from "apaas-custom-pages/apaas.json";

Vue.component(XProxyFormItem.name, XProxyFormItem);

Vue.prototype.$envUrl = function(url) {
  return `${process.env.VUE_APP_PUBLIC_PATH}${url}`;
};

Vue.config.productionTip = false;

store.state.menuModule.customListViewMap = {};

Vue.use(pages);

const r = router;
if (pagesJson.router) {
  Object.keys(pagesJson.router).forEach((key) => {
    const routerConfig = pagesJson.router[key];
    store.commit("menuModule/ADD_CUSTOM_MENU_ROUTER", routerConfig);
    r.addRoute("admin", {
      name: routerConfig.name,
      path: routerConfig.path,
      component: Vue.component(key),
    });
  });
}

// requireContext.keys().map((key) => {
//   const rc = requireContext(key);
//   if (rc && rc.entry) {
//     // 装载JS
//     const entryJs = key
//       .replace("apaas.json", rc.entry.replace("./", ""))
//       .replace("./", "");
//     console.info(
//       "entryJs",
//       entryJs,
//       path.resolve(
//         "../../../apps/apaas-custom-pages/",
//         entryJs
//       )
//     );
// const entryModule = require(process + entryJs)
// loadScript
// console.info("entryModule",entryModule)

// Vue.use(entryModule.default)

// // 动态添加路由
// const r = router

// if (rc.router) {
//   Object.keys(rc.router).forEach((key) => {
//     const routerConfig = rc.router[key]
//     store.commit('menuModule/ADD_CUSTOM_MENU_ROUTER', routerConfig)
//     r.addRoute('admin', {
//       name: routerConfig.name,
//       path: routerConfig.path,
//       component: Vue.component(key)
//     })
//   })
// }

//     // if (rc.list) {
//     //   Object.keys(rc.list).forEach((key) => {
//     //     const customListViewMap = store.state.menuModule.customListViewMap || {}
//     //     const index = Object.keys(customListViewMap).length
//     //     const routerConfig = {
//     //       ...rc.list[key],
//     //       name: 'app-list-view' + index,
//     //       meta: {
//     //         title: key
//     //       },
//     //       path: 'app-list-view'
//     //     }
//     //     store.commit('menuModule/ADD_CUSTOM_LIST_VIEW_ROUTER', routerConfig)
//     //   })
//     // }

//     // r.addRoute('admin', {
//     //   name: router.name,
//     //   path: router.path,
//     //   component: Vue.component()
//     // })
//   }
//   return rc;
// });

// 事件总线
Vue.prototype.$bus = new Vue();

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
