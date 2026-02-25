<template>
  <x-proxy-form-item
    :isInTable="widget.isInTable"
    :showRequired="showRequired"
    :label="widget.label"
    :validatorRules="validatorRules"
    :validateKey="validateKey"
    :validateInfo="validateInfo"
    :webFormSettings="webFormSettings"
  >
    <div
      class="tw-flex tw-flex-col tw-gap-y-2 tw-px-4 tw-py-2.5 tw-border-solid tw-border tw-border-gray-300 tw-rounded"
    >
      <div
        class="tw-flex tw-justify-between tw-items-center tw-relative"
        :class="{ 'tw-bg-gray-500': readonly }"
      >
        <div class="tw-flex-1">
          <cube-input
            v-model="formValue"
            :placeholder="widget.placeholder"
            :disabled="readonly"
          ></cube-input>
        </div>
        <div class="tw-absolute tw-right-0 tw--translate-y-1/2" @click="onScannerOpen">
          <x-svg-icon name="qr-code"></x-svg-icon>
        </div>
      </div>

      <qr-scanner
        :visible.sync="showScanner"
        tips=""
        @result="onScanResult"
        @error="onScanError"
        @close="onScannerClose"
      ></qr-scanner>
    </div>
  </x-proxy-form-item>
</template>

<script>
import FormWidgetConfigMixin from '@/mixin/form-widget.mixin'
import QrScanner from '~/components/qr-scanner.vue'
import { trackRequestError } from '~/utils/track'

export default {
  name: 'FormCustomQrSanner',
  components: {
    QrScanner
  },
  mixins: [FormWidgetConfigMixin],
  data() {
    return {
      label: '请扫描二维码',
      showScanner: false
    }
  },
  computed: {
    domain() {
      return window?.GLOBAL_ENV?.VUE_APP_CUSTOM_ENV?.VUE_APP_STANDARD_DOMAIN
    },
    readonly() {
      return this.renderScene !== 'edit'
    }
  },
  methods: {
    async onScanResult(result) {
      //  old_detail_number_rssm
      this.formValue = result
      this.formData[this.getHideUid('old_detail_number_rssm_res')] = result
      // console.info('formEngineContext', this.formEngineContext)
      if (this.formEngineContext.instance.formId === '658a9ee2c6838044a73548e1') {
        await this.getScanningCode()
      } else if (this.formEngineContext.instance.formId === '658e3fb5073db23c73b53003') {
        await this.getOutboundScanningCode()
      } else {
        this.formValue = null
      }
      // console.info('result', result, this.formData)
      // this.formValue = result
      // 连扫
      setTimeout(() => {
        this.onScannerOpen()
      }, 2000)
    },
    // 显示扫码
    onScannerOpen() {
      if (this.readonly) return
      this.showScanner = true
    },
    onScanError(error) {
      // 处理错误
      this.$message.error('扫描错误')
    },
    async getScanningCode() {
      if (!this.formValue) return
      const tableKey = 'old_send_receive_detail'

      // 如果此时无数据
      if (!Array.isArray(this.formData[this.getTableUuid(tableKey)])) {
        this.formData[this.getTableUuid(tableKey)] = []
      }

      const params = {
        url: this.domain + 'old/oldSendRceiveDetail/scanningCode',
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          oldBarcodeNum: this.formValue, // 旧件条码号
          docNumber: this.getformData('old_send_receive.doc_number'), // 发运单号
          sendUnitType: this.getformData('old_send_receive.current_login_role') // 发运单位类型  服务站、代收中心、服务中心
        }
      }

      const [res, err] = await trackRequestError(this.$request(params, false))
      if (err) {
        this.formValue = null
        this.$message({
          type: 'error',
          message: err?.message ?? '扫描错误'
        })
        return
      }

      const tableData = res.table?.map((item, index) => ({
        [this.getTableColumnUuid(tableKey, 'order_doc_number')]: item?.orderDocNumber,
        [this.getTableColumnUuid(tableKey, 'old_detail_number')]: item?.oldDetailNumber,
        [this.getTableColumnUuid(tableKey, 'old_send_receive_number')]: item?.oldSendReceiveNumber,
        [this.getTableColumnUuid(tableKey, 'doc_type')]: item?.docType,
        [this.getTableColumnUuid(tableKey, 'item_name')]: item?.itemName,
        [this.getTableColumnUuid(tableKey, 'item_figure_number')]: item?.itemFigureNumber,
        [this.getTableColumnUuid(tableKey, 'part_num')]: item?.partNum,
        [this.getTableColumnUuid(tableKey, 'send_quantity')]: item?.sendQuantity,
        [this.getTableColumnUuid(tableKey, 'receive_quantity')]: item?.receiveQuantity,
        [this.getTableColumnUuid(tableKey, 'supplier_name')]: item?.supplierName,
        [this.getTableColumnUuid(tableKey, 'three_digit_code')]: item?.threeDigitCode,
        [this.getTableColumnUuid(tableKey, 'engine_number')]: item?.engineNumber,
        [this.getTableColumnUuid(tableKey, 'damaged_flag')]: item?.damagedFlag,
        [this.getTableColumnUuid(tableKey, 'packaging_costs')]: item?.packagingCosts,
        [this.getTableColumnUuid(tableKey, 'packaging_costs_refer')]: item?.packagingCostsRefer,
        [this.getTableColumnUuid(tableKey, 'part_structure_code')]: item?.partStructureCode,
        [this.getTableColumnUuid(tableKey, 'accept_time')]: item?.acceptTime,
        [this.getTableColumnUuid(tableKey, 'station_send_time')]: item?.stationSendTime, // 服务站发运时间
        [this.getTableColumnUuid(tableKey, 'collection_receive_time')]: item?.collectionReceiveTime, // 代收中心验收时间
        [this.getTableColumnUuid(tableKey, 'collection_receive_man')]: item?.collectionReceiveMan, // 代收中心验收人
        [this.getTableColumnUuid(tableKey, 'center_receive_man')]: item?.centerReceiveMan, // 服务中心验收人
        [this.getTableColumnUuid(tableKey, 'center_receive_time')]: item?.centerReceiveTime, // 服务中心验收时间
        [this.getTableColumnUuid(tableKey, 'old_state')]: item?.oldState,
        currentIndexRowId: new Date().getTime() + index,
        __XID: new Date().getTime() + index
      }))
      this.formData[this.getTableUuid(tableKey)].unshift(...tableData)
      // 主表信息
      this.formData[this.getHideUid('if_apply_fee')] =
        Number(this.formData[this.getHideUid('if_apply_fee')] || 0) + 1
      this.formData[this.getHideUid('old_send_receive.doc_number')] = res.data.docNumber
      this.formData[this.getHideUid('company_product')] = res.data.companyProduct
      this.formValue = null
      this.$message({
        type: 'success',
        message: res.message
      })
    },
    // 常规旧件出库单
    async getOutboundScanningCode() {
      if (!this.formValue) return

      const tableKey = 'old_out_detail'
      if (!Array.isArray(this.formData[this.getTableUuid(tableKey)])) {
        this.formData[this.getTableUuid(tableKey)] = []
      }

      const params = {
        url: this.domain + 'old/oldInfoTrack/outboundScanningCode',
        method: 'POST',
        disableErrorMsg: true,
        disableSuccessMsg: true,
        params: {
          oldBarcodeNum: this.formValue, // 旧件条码号
          docNumber: this.getformData('old_out.doc_number'), // 发运单号
          recipientQuantity: this.getformData('old_out.recipient_quantity'), // 关键件实际领取数量
          keyCanRecipientQuantity: this.getformData('old_out.key_can_recipient_quantity'), // 关键件应领取数量
          remainQuantity: this.getformData('old_out.remain_quantity'), // 非关键件实际领取数量
          canRecipientQuantity: this.getformData('old_out.can_recipient_quantity') // 非关键件应领取数量
        }
      }

      const [res, err] = await trackRequestError(this.$request(params, false))
      if (err) {
        this.formValue = null
        this.$message({
          type: 'error',
          message: err?.message ?? '扫描错误'
        })
        return
      }

      const tableData = res.table?.map((item, index) => ({
        [this.getTableColumnUuid(tableKey, 'old_detail_number')]: item?.oldDetailNumber,
        [this.getTableColumnUuid(tableKey, 'out_doc_number')]: item?.outDocNumber,
        [this.getTableColumnUuid(tableKey, 'order_doc_number')]: item?.orderDocNumber,
        [this.getTableColumnUuid(tableKey, 'item_figure_number')]: item?.itemFigureNumber,
        [this.getTableColumnUuid(tableKey, 'if_damage')]: item?.ifDamage,
        [this.getTableColumnUuid(tableKey, 'out_quantity')]: item?.ectVersionNumber,
        [this.getTableColumnUuid(tableKey, 'engine_number')]: item?.engineNumber,
        [this.getTableColumnUuid(tableKey, 'item_name')]: item?.itemName,
        [this.getTableColumnUuid(tableKey, 'part_num')]: item?.partNum,
        [this.getTableColumnUuid(tableKey, 'order_doc_type')]: item?.orderDocType,
        [this.getTableColumnUuid(tableKey, 'part_structure_code')]: item?.partStructureCode,
        [this.getTableColumnUuid(tableKey, 'verify_number')]: item?.verifyNumber,
        [this.getTableColumnUuid(tableKey, 'transport_number')]: item?.transportNumber,
        [this.getTableColumnUuid(tableKey, 'check_number')]: item?.checkNumber,
        [this.getTableColumnUuid(tableKey, 'if_key_element')]: item?.ifKeyElement,
        [this.getTableColumnUuid(
          tableKey,
          'responsibility_percentage'
        )]: item.responsibilityPercentage,
        [this.getTableColumnUuid(tableKey, 'receive_number')]: item?.receiveNumber,
        [this.getTableColumnUuid(tableKey, 'responsibility_dp')]: item?.responsibilityDp,
        currentIndexRowId: new Date().getTime() + index,
        __XID: new Date().getTime() + index
      }))
      this.formData[this.getTableUuid(tableKey)].unshift(...tableData)

      // 主表信息
      this.formData[this.getHideUid('old_out.three_digit_code')] = res.data.threeDigitCode
      this.formData[this.getHideUid('old_out.supplier_name')] = res.data.supplierName
      this.formData[this.getHideUid('old_out.doc_number')] = res.data.docNumber
      this.formData[this.getHideUid('old_out.company_product')] = res.data.companyProduct
      this.formData[this.getHideUid('old_out.receive_man')] = res.data.receiveMan
      this.formData[this.getHideUid('old_out.key_can_recipient_quantity')] =
        res.data.keyCanRecipientQuantity
      this.formData[this.getHideUid('old_out.can_recipient_quantity')] =
        res.data.canRecipientQuantity

      this.formValue = null
      this.$message({
        type: 'success',
        message: res.message
      })
    }
  }
}
</script>
