<template>
  <x-app-layout :layoutEngine="layoutEngine" :isCollapse="isCollapse">
    <template v-slot:header>
      <x-app-header
        v-if="appInfo"
        :layoutEngine="layoutEngine"
        :appInfo="appInfo"
        :headerComponents="headerComponents"
      ></x-app-header>
    </template>
    <template v-slot:menu>
      <x-app-menu
        :menuConfig="menuConfig"
        :showMenu="showMenu && !!appInfo"
        :isCollapse="isCollapse"
        :layoutEngine="layoutEngine"
        @menu-add-click="menuAddClick"
        @change-collapse="changeCollapse"
      ></x-app-menu>
      <div v-if="!!pkgVersion" class="platform-version">
        <span>
          {{ pkgVersion }}
        </span>
      </div>
    </template>
    <template slot="appPage">
      <div class="menu-switch" @click="changeCollapse">
        <x-svg-icon v-if="isCollapse" name="arrow-right-icon"></x-svg-icon>
        <x-svg-icon v-else name="arrow-left-icon"></x-svg-icon>
      </div>
      <el-tabs
        v-if="showTab"
        v-model="editableTabsValue"
        :type="
          isUED()
            ? layoutEngine.layoutConfig.keepAliveComps.length < count
              ? 'border-card'
              : 'card'
            : 'border-card'
        "
        :closable="
          isUED()
            ? layoutEngine.layoutConfig.keepAliveComps.length === 1
              ? false
              : true
            : true
        "
        class="all-tabs-includes"
        :class="
          layoutEngine.layoutConfig.keepAliveComps.length < 2
            ? 'is-disabled-closed'
            : ''
        "
        @tab-remove="removeTab"
        @tab-click="getMenu"
      >
        <el-tab-pane
          v-for="menu of layoutEngine.layoutConfig.keepAliveComps"
          :key="menu.id + keyForRefresh"
          :label="menu.menuName"
          :name="menu.id"
        >
          <template #label>
            <x-ellipsis mode="origin" :label="menu.menuName"></x-ellipsis>
          </template>
        </el-tab-pane>
      </el-tabs>
      <slot name="appPage"></slot>
    </template>
  </x-app-layout>
</template>
<script>
import qs from "qs";
import logo from "./components/logo.vue";

function getAllMenus(menus) {
  let menuList = [];

  menus.forEach((item) => {
    if (item.menuType === "GROUP") {
      menuList.push(...getAllMenus(item.submenus));
    } else {
      menuList.push(item);
    }
  });

  return menuList;
}

export default {
  name: "CustomLayout",
  props: {
    layoutEngine: {
      type: Object,
      default: function () {
        return {};
      },
    },
    pkgVersion: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isCollapse: false,
      showMenu: true,
      keyForRefresh: new Date().getTime(),
    };
  },
  computed: {
    appInfo() {
      return (
        (this.layoutEngine &&
          this.layoutEngine.layoutDataControl &&
          this.layoutEngine.layoutDataControl.appInfo) ||
        {}
      );
    },
    menuConfig() {
      // canAddStatus
      const menuList =
        this.layoutEngine &&
        this.layoutEngine.layoutDataControl &&
        this.layoutEngine.layoutDataControl.menuConfig;
      console.warn("menuList", menuList);
      return (
        (this.layoutEngine &&
          this.layoutEngine.layoutDataControl &&
          this.layoutEngine.layoutDataControl.menuConfig) || {
          menu: [],
          defaultActive: null,
          menuTreeData: [],
        }
      );
    },
    editableTabsValue: {
      get() {
        return this.layoutEngine?.layoutConfig?.currentMenu?.id;
      },
      // set(val) {
      //     this.ditableTabsValue = val
      // }
    },
    count() {
      const CUSTOM_ENV = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV;
      if (CUSTOM_ENV) {
        const HOVER_CLOSED_ICON_COUNT = parseInt(
          CUSTOM_ENV["HOVER_CLOSED_ICON_COUNT"]
        );

        if (isNaN(HOVER_CLOSED_ICON_COUNT)) {
          return 15;
        } else {
          return HOVER_CLOSED_ICON_COUNT;
        }
      } else {
        return 15;
      }
    },
    headerComponents() {
      let components = [logo, "XAppLogo", "xLayoutAccountControl"];
      return components;
    },
    showTab() {
      return window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV.SHOW_LAYOUT_TABS === "ENABLE";
    },
    XEventBus() {
      return window?.APaaSSDK?.context?.XEventBus;
    },
    limit() {
      const CUSTOM_ENV = window.GLOBAL_ENV.VUE_APP_CUSTOM_ENV;
      if (CUSTOM_ENV) {
        const LIMIT_COUNT = parseInt(CUSTOM_ENV["LIMIT_COUNT"]);

        if (isNaN(LIMIT_COUNT)) {
          return 15;
        } else {
          return LIMIT_COUNT;
        }
      } else {
        return 15;
      }
    },
    allMenus() {
      return getAllMenus(this.layoutEngine.layoutDataControl.menuTreeData);
    },
  },
  watch: {
    $route(to, from) {
      this.handleMenuId(to.query.currentMenu);
    },
  },
  mounted() {
    const xAppMenuDom = document.querySelector(".x-app-menu");
    !this.pkgVersion && xAppMenuDom && (xAppMenuDom.style.height = "100%");
    if (this.XEventBus) {
      this.XEventBus.on("FLUSH_IDENTITY", this.refresh);
    }

    this.$watch(
      function () {
        return this.layoutEngine.layoutConfig.keepAliveComps.length;
      },
      function (value) {
        if (value > this.limit) {
          let componet = this.layoutEngine.layoutConfig.keepAliveComps.shift();
          this.clearKeepAliveCacheByMenuId(componet.id);
        }
      }
    ),
      window.addEventListener("popstate", this.handlerCurrentMenu, false);

    this.$once("hook:beforeDestroy", function () {
      window.removeEventListener("popstate", this.handlerCurrentMenu);
      this.XEventBus.off("FLUSH_IDENTITY", this.refresh);
    });
  },
  methods: {
    changeCollapse() {
      this.showMenu = false;
      this.$nextTick(() => {
        this.isCollapse = !this.isCollapse;
        this.showMenu = true;
      });
    },
    menuAddClick(e) {
      // console.error(e, 'e')
      this.$emit("menu-add-click", e);
    },
    // 点击切换tab
    getMenu(tab) {
      const menu = this.layoutEngine.layoutConfig.keepAliveComps.find(
        (value) => {
          return value.id === tab.name;
        }
      );
      this.layoutEngine.actionControl.executeActionWithSync(
        "CHANGE_ACTIVE_MENU",
        tab.name
      );
      this.layoutEngine.addKeepAliveComps(menu);
      this.layoutEngine.actionControl.executeActionWithSync("TO_ROUTER", {
        menu: this.layoutEngine.layoutConfig.currentMenu,
      });
      window.CustomLayoutVue.$emit("changeLayoutTab", "点击切换tab");
      // this.$nextTick(() => {
      //     const engine = this.$el.querySelector('.app-list-view').__vue__.listEngine
      //     Vue.prototype.$refreshList = () => {
      //         engine.actionControl.executeActionWithSync('REFRESH_LIST_ACTION')
      //     }
      // });
    },

    // 点击关闭选项卡
    removeTab(name) {
      const currentMenuId = this.layoutEngine.layoutConfig.currentMenu.id;
      // 注意卸载一定要在调转之前
      const menu = this.layoutEngine.layoutConfig.keepAliveComps.find(
        (value) => {
          return value.id === name;
        }
      );
      this.layoutEngine.removeKeepAliveComps(menu);
      if (name === currentMenuId) {
        this.layoutEngine.actionControl.executeActionWithSync("TO_ROUTER", {
          menu: this.layoutEngine.layoutConfig.currentMenu,
        });
      }
      window.CustomLayoutVue.$emit("closeLayoutTab", "点击关闭选项卡");
    },
    isUED() {
      return window.GLOBAL_ENV.VUE_APP_THEME_VERSION === "COMPACT";
    },
    handlerCurrentMenu(e) {
      let search = qs.parse(e.target.location.search.substring(1));
      this.handleMenuId(search.currentMenu);
    },
    handleMenuId(menuId) {
      const { layoutConfig } = this.layoutEngine;
      let currentMenu = this.allMenus.find((menu) => menu.id === menuId);

      const menu = this.layoutEngine.layoutConfig.keepAliveComps.find(
        (value) => {
          return value.id === menuId;
        }
      );

      if (!menu && currentMenu) {
        this.layoutEngine.addKeepAliveComps(currentMenu);
        layoutConfig.currentMenu = currentMenu;
        // layoutConfig.keepAliveComps.push(currentMenu);
      }
    },
    clearKeepAliveCacheByMenuId(menuId) {
      this.layoutEngine.actionControl.executeActionWithSync(
        "CLEAR_KEEP_ALIVE_CACHE_BY_MENU_ID",
        {
          menuId,
        }
      );
    },
    refresh() {
      this.keyForRefresh = new Date().getTime();
    },
  },
};
</script>
<style lang="scss">
.x-app-layout {
  .layout-middle {
    .layout-center {
      .menu-switch {
        width: 14px;
        height: 80px;
        padding-right: 2px;
        border-top-right-radius: 18px;
        border-bottom-right-radius: 18px;
        border: 1px solid #ffffff;
        border-left: 0;
        background-color: #ffffff;
        position: absolute;
        top: calc(50vh - 87px);
        left: -20px;
        transform: translateX(120%);
        cursor: pointer;
        opacity: 0.5;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 500;
        border: 1px solid #dcdfe6;
        border-left: none;
      }

      .menu-switch:hover {
        background-color: #ffffff;
        opacity: 1;
        box-shadow: 2px 0px 4px 0px #dcdfe6;
      }
    }
  }
}
</style>
