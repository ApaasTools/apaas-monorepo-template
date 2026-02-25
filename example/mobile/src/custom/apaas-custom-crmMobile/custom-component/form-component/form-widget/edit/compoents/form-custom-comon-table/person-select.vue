<!--
 * @Description:
 * @Author: zhengfei.tan
 * @Date: 2024-03-07 18:02:17
 * @FilePath: \apaas-custom-enginecode\src\custom\apaas-custom-crmCustomPage\custom-page\components\readPeople.vue
 * @LastEditors: junfa
 * @LastEditTime: 2024-10-30 17:14:37
-->
<template>
  <!-- 人员选择 -->
  <div class="PersonSelect">
    <cube-input
      :value="valueStr"
      v-bind="{
        ...extraConfig,
        disabled: true
      }"
      :placeholder="placeholder || '请选择'"
    />
    <div class="person-select-icon">
      <x-svg-icon name="x-lib-person"></x-svg-icon>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    personValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    extraConfig: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    valueStr() {
      let str = ''
      if (this.personValue.length) {
        this.personValue.forEach((e) => {
          if (!str) {
            str = `${e.username}/${e.userNumber || e.account}`
          } else {
            str = str + `,${e.username}/${e.userNumber || e.account}`
          }
        })
      }
      return str
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.PersonSelect {
  position: relative;
  
  .cube-input {
    &::after {
      border: 0 !important;
      border-bottom: 1px solid #e5e5e5 !important;
      z-index: 10;
    }
  }

  .person-select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    .x-svg-icon {
      width: 16px;
      height: 16px;
      color: #999;
    }
  }
}
</style>
