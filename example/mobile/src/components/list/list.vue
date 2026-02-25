<!--
 * @Author: your name
 * @Date: 2020-07-24 16:12:15
 * @LastEditTime: 2020-08-08 15:57:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/components/list/list.vue
-->
<template>
  <div class="list">
    <cube-scroll
      v-if="columns.length > 0"
      ref="scroll"
      :data="listData"
      :options="cubeScrollOptions"
      @pulling-down="onPullingDown"
      @pulling-up="onPullingUp"
    >
      <div v-for="(item) in listData" :key="item[rowKey]" class="card-item" @click="$emit('click-item', item)">
        <list-card
          :columns="columns"
          :data="item"
        ></list-card>
        <div v-if="item.haveProcess || item.status === 'DRAFT'" class="process-status">
          <x-svg-icon
            class="process-status-icon"
            :name="'process-' + item.status"
          ></x-svg-icon>
        </div>
      </div>
      <x-empty v-if="showEmpty"></x-empty>
    </cube-scroll>
    <x-empty else>
      <span class="empty-text">暂无列表字段，请联系管理员</span>
    </x-empty>
  </div>
</template>

<script>
import ListCard from '@/components/list-card/list-card.vue'

export default {
  name: 'List',
  components: {
    ListCard
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    listData: {
      type: Array,
      default: function () {
        return []
      }
    },
    rowKey: {
      type: String,
      default: null
    },
    showEmpty: {
      type: Boolean
    }
  },
  data() {
    return {
      cubeScrollOptions: {
        // preventDefault: false,
        pullDownRefresh: {
          txt: '刷新成功'
        },
        pullUpLoad: {
          txt: {
            more: '上滑加载更多',
            noMore: '没有更多数据了'
          }
        },
        scrollbar: false
      }
    }
  },
  methods: {
    onPullingDown(e) {
      this.$emit('pulling-down', e)
    },
    onPullingUp(e) {
      this.$emit('pulling-up', e)
    },
    forceUpdate() {
      this.$refs.scroll.forceUpdate()
    }
  }
}
</script>

<style lang="scss">
.list {
  .card-item {
    position: relative;
    margin-top: .57143rem;
    .process-status {
      position: absolute;
      top: 1rem;
      right: .714rem;
      .process-status-icon {
        .svg-icon {
          width: 3rem !important;
          height: 2.28rem !important;
        }
      }
    }
  }
  .x-empty {
    margin: 40% auto;
  }
}
</style>
