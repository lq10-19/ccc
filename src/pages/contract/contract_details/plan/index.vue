<template>
  <div>
    <el-table :data="tableData" border :height='tableHeight+80' ref="multipleTable">
      <el-table-column prop='seqID' label="期数" align="center"></el-table-column>
      <el-table-column prop='payDate' label="应还日期" align="center"></el-table-column>
      <el-table-column prop='totalAmt' label="月还款总额(元)" align="center"></el-table-column>
      <el-table-column prop='monthAddInteAmt' label="月基本还款额(元)" align="center"></el-table-column>
      <el-table-column prop='payprincipalAmt' label="本金(元)" align="center"></el-table-column>
      <el-table-column prop='inteAmt' label="利息(元)" align="center"></el-table-column>
      <el-table-column prop='manageFee' label="管理费(元)" align="center"></el-table-column>
      <el-table-column v-if='!isShowVipPage' prop='vipPage' label="vip包(元)" align="center"></el-table-column>
      <el-table-column v-if='!isShowAdvanceFee' prop='advanceFee' label="提前还款手续费(元)" align="center"></el-table-column>
      <el-table-column prop='principalBalance' label="剩余未还本金(元)" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    queryRepaymentPlan
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
        isShowAdvanceFee: true,
      }
    },
    created() {
      this.getRepaymentPlan()
    },
    methods: {

      getRepaymentPlan() {
        queryRepaymentPlan({
          objectNo: this.serialNo
        }).then(res => {
          this.tableData = res.data || [];
          //vip费用
          this.isShowVipPage = this.tableData.every((element, index) => {
            return element.vipPage <= 0;
          })
          //应还提前还款手续费
          this.isShowAdvanceFee = this.tableData.every((element, index) => {
            return element.advanceFee <= 0;
          })
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>