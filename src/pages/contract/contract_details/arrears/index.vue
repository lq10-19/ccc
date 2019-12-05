<template>
  <div>
    <el-table :data="tableData" border :height='tableHeight+80' ref="multipleTable">
      <el-table-column prop='overduedays' label="逾期天数(天)" align="center"></el-table-column>
      <el-table-column prop='payprincipalAmt' label="本金(元)" align="center"></el-table-column>
      <el-table-column prop='inteAmt' label="利息(元)" align="center"></el-table-column>
      <el-table-column prop='manageFee' v-if='isShowManageFee' label="管理费(元)" align="center"></el-table-column>
      <el-table-column prop='vipPage' v-if='isShowVipPage' label="VIP包(元)" align="center"></el-table-column>
      <el-table-column prop='newEventFee' label="催收工本费(元)" align="center"></el-table-column>
      <el-table-column prop='breakamt' label="违约金(元)" align="center"></el-table-column>
      <el-table-column prop='totalAmt' label="欠费总金额(元)" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    queryArrearsInfo
  } from "@/axios/api"

  export default {
    props: {
      serialNo: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        tableData: [],
        isShowVipPage: true,
        isShowManageFee: true,
      }
    },
    created() {
      this.getArrearsList()
    },
    methods: {

      getArrearsList() {

        queryArrearsInfo({
          objectNo: this.serialNo
        }).then(res => {
          if (res.data) {
            this.tableData = [res.data] || [];
            this.isShowManageFee = res.data.manageFee == 0 ? false : true;
            this.isShowVipPage = res.data.vipPage == 0 ? false : true;
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>