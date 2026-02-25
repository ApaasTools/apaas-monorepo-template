<template>
  <div class="app-engine-menu">
    <!-- <div v-if="oneLevelMenus.length > 0" class="menu-group":style="calcStyle">
      <menu-panel key="oneLevelMenus" :menuList="oneLevelMenus" @select="handleSelect"></menu-panel>
    </div>
    <template v-for="group in menuGroup">
      <menu-group :key="group.id" :group="group" @select="handleSelect"></menu-group>
    </template> -->
    <template v-for="(list, index) in splitMenus">
      <div v-if="list[0].menuType !== 'GROUP'" :key="index" class="menu-group" :style="calcStyle">
        <menu-panel key="list" :menuList="list" @select="handleSelect"></menu-panel>
      </div>
      <template v-else>
        <menu-group
          v-for="group in list"
          :key="group.id"
          :group="group"
          @select="handleSelect"
        ></menu-group>
      </template>
    </template>
    <template v-if="isEmpty">
      <x-empty></x-empty>
    </template>
  </div>
</template>

<script>
import MenuPanel from '@/components/menu-panel/menu-panel'
import MenuGroup from '@/components/menu-group/menu-group'
import { mapGetters } from 'vuex'

export default {
  components: {
    MenuPanel,
    MenuGroup
  },
  data() {
    return {
      menuTree: [
        {
          index: 'config-zikaifa',
          menuType: 'GROUP',
          menuName: '自开发',
          submenus: []
        }
      ]
    }
  },
  computed: {
    ...mapGetters('menuModule', {
      customMenuList: 'customMenuList'
    }),
    menuGroup() {
      return this.menuTree.filter((menu) => menu.menuType === 'GROUP')
    },
    oneLevelMenus() {
      return this.menuTree.filter(
        (menu) =>
          menu.menuType === 'MENU' || menu.menuType === 'MODEL' || menu.menuType === 'REPORT'
      )
    },
    splitMenus() {
      const newMenus = []
      console.log(this.menuTree)
      let group = false
      this.menuTree.forEach((item) => {
        if (item.menuType === 'MENU' || item.menuType === 'MODEL' || item.menuType === 'REPORT' || item.menuType === 'EXTERNAL_LINK') {
          if (group || newMenus.length < 1) {
            group = false
            newMenus.push([item])
          } else {
            newMenus[newMenus.length - 1].push(item)
          }
        } else if (item.menuType === 'GROUP') {
          if (!group || newMenus.length < 1) {
            group = true
            newMenus.push([item])
          } else {
            newMenus[newMenus.length - 1].push(item)
          }
        }
      })
      console.log(newMenus)
      return newMenus
    },
    isEmpty() {
      return this.menuGroup.length === 0 && this.oneLevelMenus.length === 0
    },
    calcStyle() {
      return {
        borderWidth: this.menuGroup.length > 0 ? '1px' : 0
      }
    }
  },
  created() {
    this.menuTree.forEach((menu) => {
      if (menu.index === 'config-zikaifa') {
        menu.submenus = [...this.customMenuList.map(item => {
          return {
            ...item,
            menuName: item.name,
            menuIcon: item.icon
          }
        })]
      }
    })
  },
  methods: {
    handleSelect({ index }) {
      this.$router.push({ name: index, query: { t: new Date().getTime() } })
    }
  }
}
</script>

<style lang="scss">
.app-engine-menu {
  padding: 1.14rem;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  .x-empty {
    margin: 40% auto;
  }
}
</style>
