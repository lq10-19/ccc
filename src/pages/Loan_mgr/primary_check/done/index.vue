<template>
  <div class="container">

    <!-- 搜索from -->
    <SearchForm @setSearchInfo="getMsgFormSon"></SearchForm>

    <el-row style="margin-bottom: 10px">
      <el-button type="primary" v-has plain @click="filterHand('onDetail')">合同详情</el-button>
      <el-button type="primary" v-has plain @click="filterHand('onSeeFile')">查看文件</el-button>
      <el-button type="primary" v-has plain @click="filterHand('onSeePDF')">查看电子合同</el-button>
      <el-button type="primary" v-has plain @click="filterHand('onSeeView')">查看意见</el-button>
      <el-button type="primary" v-has plain @click="filterHand('onSeeRecord')">查看调单记录</el-button>
    </el-row>

    <!-- <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable" highlight-current-row
        @selection-change="handleSelectionChange" @row-click="clickRow"> -->
    <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable" highlight-current-row
      @current-change="onCurrentChange">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
      <el-table-column prop="serialNo" label="合同号" min-width="115" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="customerCertId" label="证件号码" min-width="145" align="center"></el-table-column>
      <el-table-column prop="productSuperType" label="产品大类" min-width="90" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="businessSum" label="贷款金额" align="center"></el-table-column>
      <el-table-column prop="saleManager" label="销售经理" align="center"></el-table-column>
      <el-table-column prop="applyDate" min-width="140" label="申请时间" align="center"></el-table-column>
      <el-table-column prop="checkBeginDate" min-width="140" label="审核开始时间" align="center"></el-table-column>
      <el-table-column prop="checkEndDate" min-width="140" label="审核结束时间" align="center"></el-table-column>
      <el-table-column prop="handleTime" min-width="100" label="处理时长" align="center"></el-table-column>
      <el-table-column prop="contractStatusMain" min-width="110" label="合同主状态" align="center"></el-table-column>
      <el-table-column prop="contractStatusMinor" min-width="110" label="合同子状态" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>

    <!-- 查看意见 -->
    <SeeViewModel m_title='查看意见' :isShowModal='isShowModal_S' source='放款初审' :columnInfo='selection'></SeeViewModel>
    <!-- 查看调单记录 -->
    <PecordModel m_title='查看调单记录' :isShowModal='isShowModal_C' source='放款初审' :columnInfo='selection'></PecordModel>

  </div>
</template>


<script>
  import {
    queryLoanCheckFirstFinished
  } from "@/axios/api"

  import SeeViewModel from "@/components/public/seeView_model";
  import PecordModel from "@/components/public/record_model";
  import SearchForm from "@/components/public/searchForm";

  export default {
    name: 'loan_primary_done',
    components: {
      SeeViewModel,
      PecordModel,
      SearchForm
    },
    data() {
      return {
        isShowModal_S: false,
        isShowModal_C: false,
        totalPage: 0,
        searchForm: {},
        serialNoList: [],
        multipleSelection: [],
        tableData: [],
        selection: {}, //选中的行数据
      };
    },
    created() {
      this.check()
    },
    mounted() {
      // this.getDataList()
    },
    watch: {},
    methods: {
      // 获取子组件数据
      getMsgFormSon(resInfo) {
        this.searchForm = resInfo;
      },
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      // 过滤一下验证
      filterHand(resHandlName) {

        if (Object.keys(this.selection).length == 0) {
          this.$message.warning("请选择需要处理的合同")
          return;
        }
        this[resHandlName]()
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        console.log(val, 11)
        this.multipleSelection = val;
      },
      //合同详情
      onDetail() {
        this.$router.push({
          path: "/constract_detail",
          query: {
            serialNo: this.selection.serialNo,
            phaseName: '放款终审'
          }
        })
      },
      // 查看文件
      onSeeFile() {
        this.$router.push({
          path: "/see_file",
          query: {
            serialNo: this.selection.serialNo,
          }
        })
      },
      // 查看电子合同
      onSeePDF() {
        this.$router.push({
          path: "/see_pdf",
          query: {
            serialNo: this.selection.serialNo,
          }
        })
      },
      // 查看意见
      onSeeView() {
        this.isShowModal_S = !this.isShowModal_S;
      },
      // 查看调单记录
      onSeeRecord() {
        this.isShowModal_C = !this.isShowModal_C;
      },

      onCurrentChange(val) {
        this.selection = val || {};
      },

      async getDataList() {
        try {
          console.log(this.queryParams, 55)
          let res = await queryLoanCheckFirstFinished({
            ...this.queryParams
          })
          console.log(res, 11)
          this.tableData = res.data.rows;
          this.totalPage = res.data.totalCount;
        } catch (error) {
          console.log(error)
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  /deep/ .el-input--small {
    width: 200px;
  }

  .form-item-label {
    display: inline-block;
    width: 80px;
  }
</style>