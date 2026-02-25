<template>
  <div class="menu-panel">
    <template v-for="(menuRow, listIdx) in menuGrid">
      <div :key="listIdx" class="menu-row">
        <template v-for="menu in menuRow">
          <menu-item :key="menu.id" :menuInfo="menu" @click="handleClick(menu)"></menu-item>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import MenuItem from './menu-item/menu-item'

export default {
  components: {
    MenuItem
  },
  props: {
    cols: {
      type: Number,
      default: 4
    },
    menuList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      menuGrid: []
    }
  },
  watch: {
    menuList: {
      handler(newVal) {
        this.menuGrid = this.listToGrid(this.cols, this.$lodash.cloneDeep(newVal))
      },
      immediate: true
    }
  },
  methods: {
    handleClick(menu) {
      this.$emit('select', menu)
    },
    listToGrid(num, array) {
      const grid = []
      while (array.length > 0) {
        let list = array.splice(0, num)
        if (list.length > 0 && list.length < num) {
          for (let i = 0, len = num - list.length; i < len; i++) {
            list.push({
              isPlaceholder: true
            })
          }
        }
        grid.push(list)
      }
      return grid
    }
  }
}
</script>

<style lang="scss">
.menu-panel {
  display: flex;
  flex-direction: column;
  .menu-row {
    display: flex;
    justify-content: flex-start;
    margin-top: 1.14rem;
    .menu-item {
      flex: 1;
    }
  }
}
</style>
