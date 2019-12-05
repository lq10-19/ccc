<template>
  <div class="container">
    <!-- 搜索from -->
    <ContractSearchForm @setSearchInfo="getMsgFormSon"></ContractSearchForm>

    <el-row style="margin-bottom: 10px">
      <el-button type="primary" v-has plain @click="filterHand('onDetail')">合同详情</el-button>
      <!-- <el-button type="primary" plain @click="refund">退回银行卡</el-button>-->
      <el-button type="primary" v-has plain @click="filterHand('reimbursement')">提前还款记录</el-button>
    </el-row>

    <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable" highlight-current-row
      @current-change="onCurrentChange">
      <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
      <el-table-column prop="serialNo" label="合同号" min-width="115" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="customerCertId" min-width='145' label="证件号码" align="center"></el-table-column>
      <el-table-column prop="productSuperType" label="产品大类" min-width="90" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="applyAmount" label="贷款金额" align="center"></el-table-column>
      <el-table-column prop="saleManager" label="销售经理" align="center"></el-table-column>
      <el-table-column prop="applyDate" label="申请时间" min-width="140" align="center"></el-table-column>
      <el-table-column prop="putoutDate" label="放款时间" min-width="140" align="center"></el-table-column>
      <el-table-column prop="effectiveTime" label="合同生效日期" min-width="120" align="center"></el-table-column>
      <el-table-column prop="maturityTime" label="合同到期日期" min-width="120" align="center"></el-table-column>
      <el-table-column prop="contractStatusMain" label="合同主状态" min-width="120" align="center"></el-table-column>
      <el-table-column prop="contractStatusMinor" label="合同子状态" min-width="120" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>
    <!-- 提前还款记录 -->
    <!-- <PrepaymentRecord isShow='isShow'></PrepaymentRecord> -->
  </div>
</template>


<script>
  import bus from "./bus.js";
  import {
    queryContractListInfo
  } from "@/axios/api";

  import ContractSearchForm from "@/components/public/contractSearchForm";
  import PrepaymentRecord from "./prepayment_record/index.vue";

  // queryType 010  查询
  // queryType 020  未结清
  // queryType 030  已结清
  export default {
    name: 'contract_mgr_done',
    components: {
      ContractSearchForm,
      PrepaymentRecord
    },
    data() {
      return {
        tableData: [],
        totalPage: 0,
        isShow: false,
        selection: {} //选中的行数据
      };
    },

    created() {

      this.check()
    },
    mounted() {},
    methods: {
      // 获取子组件数据
      getMsgFormSon(resInfo) {
        this.searchForm = resInfo;
      },
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      onCurrentChange(val) {
        this.selection = val || {};
      },
      //合同详情
      onDetail() {
        this.$router.push({
          path: "/contract_detail",
          query: {
            serialNo: this.selection.serialNo,
            phaseName: '已结清合同'
          }
        });
      },
      // 查看还款记录
      reimbursement() {
        this.$router.push({
          path: "/prepayment_record",
          query: {
            serialNo: this.selection.serialNo,
            phaseName: '已结清合同'
          }
        });
      },
      // 过滤一下验证
      filterHand(resHandlName) {
        if (Object.keys(this.selection).length === 0) {
          this.$message.warning("请选择进行操作的合同");
          return;
        }
        this[resHandlName]()
      },

      async getDataList() {
        try {
          console.log(this.queryParams, 55)
          let params = Object.assign({}, this.queryParams)
          params.paramObj.queryType = '030'
          console.log(params, 11)
          let res = await queryContractListInfo(params)
          console.log(res, 8973)
          this.tableData = res.data.rows;
          this.totalPage = res.data.totalCount;
        } catch (error) {
          console.log(error)
        }
      },
    }
  };
</script>