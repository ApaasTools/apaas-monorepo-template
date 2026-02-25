<!--
 * @Author: your name
 * @Date: 2020-07-24 12:22:38
 * @LastEditTime: 2021-08-06 18:07:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xdap-h5/src/components/list-card/list-card.vue
-->
<template>
  <div class="list-card row" @click="handleViewDetail(data)">
    <div class="list-card-wrapper">
      <div v-for="(column, index) in computeColumns" :key="index" class="column">
        <div class="label text-overflow">
          {{ column.label }}
        </div>
        <div class="label">
          ：
        </div>
        <template v-if="column.customSlot === 'virtualFieldSlot'">
          <div class="virtual-value">
            <x-form-virtual-field
              :formData="data"
              :value="data[column.uuid]"
              :templateScript="column.templateScript"
              :templateStyle="column.templateStyle"
              :styleDomId="column.uuid"
              :renderVirtualTemplate="column.renderVirtualTemplate"
            >
            </x-form-virtual-field>
          </div>
        </template>
        <template
          v-else-if="
            ['FORM_RADIO_INPUT', 'FORM_CHECKBOX_INPUT', 'FORM_SELECT_INPUT'].includes(
              column.componentType
            )
          "
        >
          <div class="value-tag">
            <x-tag-group :tags="data[column.uuid]" calcKey="label" :tagMarginWidth="6">
              <template v-slot:tag="{ tag }">
                <x-color-tag :tag="tag" :widget="column"></x-color-tag>
              </template>
            </x-tag-group>
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_DEPARTMENT_SELECT'">
          <div class="tag-wrap">
            <x-tag-group :tags="data[column.uuid]" calcKey="name" :tagMarginWidth="3"></x-tag-group>
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_PEOPLE_SELECT'">
          <div class="tag-wrap">
            <x-tag-group
              :tags="Array.isArray(data[column.uuid]) ? data[column.uuid] : [data[column.uuid]]"
              :countWidth="82"
              calcKey="username"
              :tagMarginWidth="3"
            >
              <template v-slot:tag="{ tag }">
                <x-user-tag :avatarUrl="tag.headPortrait" :personName="tag.username">
                </x-user-tag>
              </template>
            </x-tag-group>
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_MONEY_INPUT'">
          <div class="value">
            {{ data[column.uuid] | formatMoney(column) }}
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_PHONE_INPUT'">
          <div class="value">
            {{ data[column.uuid] | formatPhone(column) }}
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_ASSOCIATION'">
          <div class="value-associated-box">
            <div class="value-associated">
              <x-svg-icon name="x-lib-associated"></x-svg-icon>
              <span class="associate-lable">{{ column.label }}</span>
            </div>
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_WIDGET_LOCATION'">
          <div class="value">
            {{ data[column.uuid] && data[column.uuid].address }}
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_WIDGET_AREA'">
          <div class="value">
            {{ data[column.uuid] | formatArea(column) }}
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_FILE_UPLOAD'">
          <div class="value">
            {{ data[column.uuid] | formatFile(column) }}
          </div>
        </template>
        <template v-else-if="column.componentType === 'FORM_HYPERLINK_INPUT'">
          <a
            class="value link"
            href="javascript:void(0);"
            target="_blank"
            @click.stop="handleHyperlinkClick(data[column.uuid])"
          >
            {{ data[column.uuid] }}
          </a>
        </template>
        <template v-else>
          <div class="value">
            {{ data[column.uuid] }}
          </div>
        </template>
      </div>
    </div>
    <div class="view-detail">
      <template v-if="!$scopedSlots.default">
        <div class="label">
          查看详情
        </div>
        <div class="value">
          <x-svg-icon name="arrow-right-icon"></x-svg-icon>
        </div>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </div>
  </div>
</template>

<script>
import MoneyUtil from '@/lib/ui/utils/money.util'
import PhoneUtil from '@/lib/ui/utils/phone.util'

export default {
  name: 'ListCardItem',
  filters: {
    formatMoney(value, config) {
      let money = ''
      if (value) {
        if (config.moneyDisplayStyle === 'NUMBER') {
          money = MoneyUtil.formatThousandth(value, 2, true)
        } else if (config.moneyDisplayStyle === 'TEXT') {
          money = MoneyUtil.formatDX(value)
        }
      }
      return money
    },
    formatPhone(value, config) {
      return PhoneUtil.formatPhone(value)
    },
    formatArea(value, config) {
      if (value) {
        if (config.areaType === 'AREA_ADDRESS') {
          return (
            ((value.province && value.province.name) || '') +
            ((value.city && value.city.name) || '') +
            ((value.area && value.area.name) || '') +
            ((value.address && value.address.name) || '')
          )
        } else {
          return (
            ((value.province && value.province.name) || '') +
            ((value.city && value.city.name) || '') +
            ((value.area && value.area.name) || '')
          )
        }
      } else {
        return ''
      }
    },
    formatFile(value, config) {
      if (value && value.length > 0) {
        return value
          .map((item) => {
            return item.fileName
          })
          .join('，')
      }
    }
  },
  props: {
    len: {
      type: Number,
      default: 4
    },
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    computeColumns: function() {
      return this.columns.filter(Boolean).slice(0, this.len)
    }
  },
  created() {
    console.log(this.columns, this.data)
  },
  methods: {
    handleViewDetail(data) {
      this.$emit('view-detail', data)
    },
    handleHyperlinkClick(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss">
.list-card {
  max-height: 14rem;
  background-color: $--app-light-color;
  font-size: 1rem;
  border-radius: 2px;
  .list-card-wrapper {
    padding: 1.14rem;
    .column {
      min-height: 1rem;
      margin-bottom: 1.14rem;
      display: flex;
      align-items: center;
      .label {
        color: $--app-notice-color;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 30%;
      }
      .tag-wrap {
        flex: 1;
        margin: -0.36rem 0;
      }
      .value {
        color: $--app-base-font-color;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.link {
          text-decoration: underline;
          color: #0000ee;
        }
      }
      .virtual-value {
        width: 100%;
        height: 1rem;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .value-tag {
        flex: 1;
        display: flex;
        align-items: center;
        max-width: 70%;
        margin: -0.36rem 0;
        .x-tag-group {
          align-items: center;
          .tag-group-box {
            max-width: 100%;
          }
          .x-svg-icon {
            display: flex;
            align-items: center;
          }
        }
        .select-read-tag {
          margin-bottom: 0;
        }
      }
      .value-associated-box {
        display: flex;
        align-items: center;
        max-width: 60%;
        .value-associated {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding: 0 0.86rem;
          height: 1.72rem;
          border-radius: 0.86rem;
          background-color: $--app-tag-bgColor;
          padding-left: 0.285rem;
          max-width: 100%;
          .associate-lable {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .x-svg-icon {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .view-detail {
    margin: 0 1.14rem;
    height: 2.71rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px dashed $--app-split-line-color;
    .label {
      color: $--app-notice-color;
    }
    .value {
      color: $--app-notice-color;
      .x-svg-icon {
        margin-right: -0.4rem;
      }
    }
  }
}
</style>
