<template>
  <div>
    <el-table :data="tableData" border :height='tableHeight+80' ref="multipleTable">
      <el-table-column prop='seqID' label="期数" min-width="60" align="center"></el-table-column>
      <el-table-column prop='finishDate' label="实际还款日" align="center"></el-table-column>
      <el-table-column prop='actualTotalAmt' label="实际还款金额(元)" align="center"></el-table-column>
      <el-table-column prop='actualPayPrincipalAmt' label="实际还款本金(元)" align="center"></el-table-column>
      <el-table-column prop='actualPayInteAmt' label="实际还款利息(元)" align="center"></el-table-column>
      <el-table-column prop='actualManageFee' label="实际还款管理费(元)" min-width="90" align="center"></el-table-column>
      <el-table-column v-if='!isShowGB' prop='collectionLaborCost' label="催收工本费(元)" align="center"></el-table-column>
      <el-table-column v-if='!isShowWYJ' prop='actualpayBreakAmt' label="逾期违约金(元)" align="center"></el-table-column>
      <el-table-column v-if='!isShowADF' prop='actualAdvanceFee' label="提前还款手续费(元)" align="center"></el-table-column>
      <el-table-column prop='actualOther' label="其他费用(元)" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    queryReimbursementAmountRecord
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
        isShowGB: true,
        isShowWYJ: true,
        isShowADF: true,
      }
    },
    created() {
      this.getPaymentHistory()
    },
    methods: {
      getPaymentHistory() {
        queryReimbursementAmountRecord({
          objectNo: this.serialNo
        }).then(res => {
          this.tableData = res.data || [];
          //催收工本费
          this.isShowGB = this.tableData.every((element, index) => {
            return element.collectionLaborCost <= 0;
          })
          //实还逾期违约金
          this.isShowWYJ = this.tableData.every((element, index) => {
            return element.actualpayBreakAmt <= 0;
          })
          //还款记录
          this.isShowADF = this.tableData.every((element, index) => {
            return element.actualAdvanceFee <= 0;
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