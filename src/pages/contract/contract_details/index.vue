<template>
  <div class="container">
    <div style="margin-bottom: 8px">合同详情 - {{serialNo}}</div>
    <el-tabs v-model.trim="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="合同详情" name="1">
        <contract-info :rowData='rowData' :serialNo='serialNo'></contract-info>
      </el-tab-pane>
      <el-tab-pane label="合同附件" name="2">
        <attachment-info :serialNo='serialNo'></attachment-info>
      </el-tab-pane>
      <el-tab-pane label="电子合同" name="3">
        <digital-contract :serialNo='serialNo'></digital-contract>
      </el-tab-pane>
      <el-tab-pane label="还款计划" name="4">
        <repay-plan :serialNo='serialNo'></repay-plan>
      </el-tab-pane>
      <el-tab-pane label="还款记录" name="5">
        <repay-record :serialNo='serialNo'></repay-record>
      </el-tab-pane>
      <el-tab-pane label="欠费信息" name="6" v-if='isShow'>
        <arrears-info :serialNo='serialNo'></arrears-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  import ContractInfo from "./info/index.vue";
  import AttachmentInfo from "./attachment/index.vue";
  import DigitalContract from "./digital_contract/index";
  import RepayPlan from "./plan/index.vue";
  import RepayRecord from "./record/index.vue";
  import ArrearsInfo from "./arrears/index.vue";

  import {
    queryCreditInfo
  } from "@/axios/api"

  export default {
    name: 'contract_detail',
    components: {
      ContractInfo,
      AttachmentInfo,
      DigitalContract,
      RepayPlan,
      RepayRecord,
      ArrearsInfo
    },
    data() {
      return {
        activeName: '1',
        rowData: {},
        serialNo: null,
        isShow: false
      };
    },
    created() {
      this.serialNo = this.$route.query.serialNo;
      this.getCreditInfo()
      if (this.$route.query.phaseName == '未结清合同' || this.$route.query.phaseName == '送回盘报表') {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 获取订单详情
      getCreditInfo() {
        queryCreditInfo({
          serialNo: this.$route.query.serialNo,
        }).then(res => {
          this.rowData = res.data
          this.rowData.fees = this.rowData.fees.filter(item => {
            return item.display != '03';
          })
          if (this.rowData.certEffectiveStartTime && this.rowData.certEffectiveEndTime) {
            this.rowData.limitTime =
              `${this.rowData.certEffectiveStartTime} - ${this.rowData.certEffectiveEndTime}`
          }
        })
      }
    }
  };
</script>


<style scoped lang="scss">
</style>