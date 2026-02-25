<template>
  <div class="td-sub">
    <template
      v-if="
        ['FORM_RADIO_INPUT', 'FORM_CHECKBOX_INPUT', 'FORM_SELECT_INPUT'].includes(
          header.componentType
        )
      "
    >
      <template v-if="!inTable">
        <div class="value-tag">
          <x-tag-group
            :tags="body[header.uuid]"
            calcKey="label"
            :tagMarginWidth="4"
            collapseTags
            showTagOneRow
          >
            <template v-slot:tag="{ tag }">
              <x-color-tag :tag="tag" :widget="header"></x-color-tag>
            </template>
          </x-tag-group>
        </div>
      </template>
      <template v-else>
        <div class="value-tag">
          <x-tag-group
            :tags="getChooseOptions(header, body[header.uuid])"
            calcKey="label"
            :tagMarginWidth="4"
            collapseTags
            showTagOneRow
          >
            <template v-slot:tag="{ tag }">
              <x-color-tag :tag="tag" :widget="header"></x-color-tag>
            </template>
          </x-tag-group>
        </div>
      </template>
    </template>
    <template v-else-if="header.componentType === 'FORM_DEPARTMENT_SELECT'">
      <div class="tag-wrap">
        <x-tag-group
          :tags="body[header.uuid]"
          calcKey="name"
          :tagMarginWidth="4"
          collapseTags
          showTagOneRow
        ></x-tag-group>
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_PEOPLE_SELECT'">
      <div class="tag-wrap">
        <x-tag-group
          :tags="body[header.uuid]"
          :countWidth="82"
          calcKey="username"
          :tagMarginWidth="4"
          collapseTags
          showTagOneRow
        >
          <template v-slot:tag="{ tag }">
            <x-user-tag :avatarUrl="tag.headPortrait" :personName="tag.username"> </x-user-tag>
          </template>
        </x-tag-group>
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_MONEY_INPUT'">
      <div class="label-info">
        {{ body[header.uuid] | formatMoney(header) }}
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_PHONE_INPUT'">
      <div class="label-info">
        {{ body[header.uuid] | formatPhone(header) }}
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_ASSOCIATION'">
      <div class="value-associated-box">
        <div class="value-associated">
          <x-svg-icon name="ued-x-lib-associated"></x-svg-icon>
          <span class="associate-lable">{{ header.label }}</span>
        </div>
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_DATA_SELECTOR' && inTable">
      <div class="label-info data-selector-text">
        {{ body[header.uuid] | dataSelectorFilter }}
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_WIDGET_LOCATION'">
      <div class="label-info">
        {{ body[header.uuid] && body[header.uuid].address }}
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_WIDGET_AREA'">
      <div class="label-info">
        {{ body[header.uuid] | formatArea(header) }}
      </div>
    </template>
    <template v-else-if="header.componentType === 'FORM_SWITCH_SELECT'">
      <div class="label-info">
        {{ getSwitchLabel(body[header.uuid], header) }}
      </div>
    </template>
    <template v-else-if="header.id === 'status'">
      <div class="value">
        {{ body[header.id] | formatStatus(header) }}
      </div>
    </template>
    <template v-else>
      <div class="label-info">
        {{ body[header.uuid] }}
      </div>
    </template>
  </div>
</template>

<script>
import MoneyUtil from './utils/money.util.js'
import PhoneUtil from './utils/phone.util.js'
import { getVueI18N } from '@x-apaas/x-apaas-frontend-i18n/index.js'
// import { XTagGroup, XColorTag } from '@x-ui/x-dcloud-ui'

const i18n = getVueI18N()

export default {
  name: 'STableTdSub',
  components: {
    // XTagGroup,
    // XColorTag
  },
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
    dataSelectorFilter(values, config) {
      return Array.isArray(values)
        ? values.length > 0
          ? values.map((item) => item.name).join(',')
          : ''
        : values
    },
    formatStatus(value) {
      const statusNameList = [
        { label: i18n._t('mFormWidget.status.draft', i18n.locale, i18n.messages), value: 'DRAFT' },
        {
          label: i18n._t('mFormWidget.status.approving', i18n.locale, i18n.messages),
          value: 'APPROVING'
        },
        {
          label: i18n._t('mFormWidget.status.completed', i18n.locale, i18n.messages),
          value: 'COMPLETED'
        },
        {
          label: i18n._t('mFormWidget.status.refused', i18n.locale, i18n.messages),
          value: 'REFUSED'
        },
        {
          label: i18n._t('mFormWidget.status.terminated', i18n.locale, i18n.messages),
          value: 'TERMINATED'
        },
        {
          label: i18n._t('mFormWidget.status.withdrawn', i18n.locale, i18n.messages),
          value: 'WITHDRAWN'
        }
      ]
      return statusNameList.find((item) => {
        return item.value === value
      }).label
    }
  },
  props: {
    header: {
      type: Object,
      default() {
        return {}
      }
    },
    body: {
      type: Object,
      default() {
        return {}
      }
    },
    inTable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getSwitchLabel(val, column) {
      if (!column.switchOptions) {
        return val
      }
      const option = column.switchOptions.find((item) => item.code === val)
      return option ? option.label : ''
    },
    getChooseOptions(column, values) {
      const opts = []
      if (values) {
        if (!Array.isArray(values)) values = [values]
        values.length > 0 &&
          values.forEach((value) => {
            column.chooseOptions.forEach((col) => {
              if (value === col.id) {
                opts.push(col)
              } else {
                if (value.label === col.label) {
                  opts.push(col)
                }
              }
            })
          })
      }
      return opts
    }
  }
}
</script>

<style></style>
