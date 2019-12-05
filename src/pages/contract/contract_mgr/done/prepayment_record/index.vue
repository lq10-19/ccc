<template>
  <div class="container see_file_box">
    <div style="margin-bottom: 6px">提前还款 - {{serialNo}}</div>
    <el-tabs tab-position="left" type='card' v-model.trim="editableTabsValue" @tab-click="chenckTab">
      <el-tab-pane label="提前还款申请">
        <div class="table_box">

          <div class="button-box">
            <!-- <el-button type="primary" plain @click="Advance" size='mini'>提前还款申请</el-button>
              <el-button type="primary" plain @click="cancel" size='mini'>取消申请</el-button> -->
            <el-button type="primary" plain @click="ApplyDetails" size='mini'>申请详情</el-button>
          </div>

          <div>
            <el-table :data="tableData" border class="table" :height='tableHeight-70' ref="multipleTable"
              highlight-current-row @current-change="onCurrentChange">
              <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
              <el-table-column prop="serialNo" label="交易流水号" min-width="110" align="center"></el-table-column>
              <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
              <el-table-column prop="applyDate" label="申请时间" min-width="120" align="center"></el-table-column>
              <el-table-column prop="validityPeriod" label="申请有效时间" min-width="120" align="center"></el-table-column>
              <el-table-column prop="sumAmt" label="提前还款总金额" min-width="100" align="center"></el-table-column>
              <el-table-column prop="applyStatus" :formatter='formatter' label="申请状态" min-width="80" align="center">
              </el-table-column>
              <el-table-column prop="overDate" label="完成时间" min-width="120" align="center"></el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
                  :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
                  layout="total,sizes, prev, pager, next" :total="totalPage">
                </el-pagination>
              </div> -->
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 申请详情 -->
    <DetailsModal :isShowModal='isShowModal' :acctTransactionNo='acctTransactionNo'></DetailsModal>
  </div>
</template>


<script>
  import {
    getDocAttachment,
    advanceRepayment,
  } from "@/axios/api"
  import DetailsModal from "@/components/public/details_modal.vue";
  export default {
    components: {
      DetailsModal,
    },
    data() {
      return {
        serialNo: null,
        tableData: [],
        totalPage: 0,
        isShowModal: false,
        isShowSetModal: false,
        editableTabsValue: null,
        acctTransactionNo: null,
      };
    },
    created() {

      this.serialNo = this.$route.query.serialNo;

      this.check()
    },

    mounted() {

    },

    methods: {
      chenckTab(tab, event) {},
      //  申请详情
      ApplyDetails() {
        if (!this.acctTransactionNo) {
          this.$message.warning('请先选择流水号')
          return
        }
        this.SeeDetails()
      },
      SeeDetails() {
        this.isShowModal = !this.isShowModal;
      },
      onCurrentChange(val) {
        this.acctTransactionNo = val.serialNo || null;
      },
      // 提前还款
      Advance() {
        this.isShowSetModal = !this.isShowSetModal;
      },

      cancel() {
        this.$confirm("此操作将取消申请, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      formatter: function (row, column, cellValue, index) {
        let arr = this.$store.state.transStatusList;
        let aa = arr.filter((currentValue, index, arr) => {
          return currentValue.itemNo == cellValue;
        })[0] || {};
        return aa.itemName;
      },
      async getDataList() {
        try {
          let params = Object.assign({}, {
            serialNo: this.$route.query.serialNo
          })
          let res = await advanceRepayment(params)
          console.log(res, 11)
          this.tableData = res.data;
          // this.totalPage = res.data.totalCount;
        } catch (error) {
          console.log(error)
        }
      },
    }
  };
</script>


<style scoped lang="scss">
  .see_file_box {
    /* height: 94%; */
    width: 94%;
    min-height: 360px;

    .table_box {
      width: 98%;
      min-width: 500px;
      min-height: 460px;
      border: 1px solid #E4E7ED;
      overflow-y: auto;
      overflow-x: hidden;

      .button-box {
        padding: 6px;
        padding-left: 10px;
      }

    }


    .grey {
      color: grey
    }
  }
</style>