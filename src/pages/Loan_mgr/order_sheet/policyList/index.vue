<template>
  <div class="container">


    <!-- 搜索from -->
    <SearchForm @setSearchInfo="getMsgFormSon"></SearchForm>

    <el-row style="margin-bottom:10px ">
      <el-button @click="handleBranch" type="primary" v-has plain>调单</el-button>
    </el-row>

    <el-table :data="tableData" border :height='tableHeight' class="table" ref="multipleTable"
      @selection-change="handleSelectionChange" @row-click="clickRow">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
      <el-table-column prop="userName" label="当前审批人员" min-width='100px' align="center"></el-table-column>
      <el-table-column prop="serialNo" label="合同号" min-width="115" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="customerCertId" min-width='145' label="证件号码" align="center"></el-table-column>
      <el-table-column prop="productSuperType" label="产品大类" min-width="90" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="contractStatusMinor" label="阶段名称" min-width="95" align="center">
        <template slot-scope="scope">{{scope.row.contractStatusMinor|StatusMinorFilter}}</template>
      </el-table-column>
      <el-table-column prop="applyDate" min-width='145px' label="申请时间" align="center"></el-table-column>
      <el-table-column prop="distOrderTime" min-width='145px' label="分单时间" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal :isShowModal="isShowModal" m_title='调单' :phaseName='phaseName' :serialNos='serialNos' :flowNo='flowNo'>
    </add-modal>
  </div>
</template>


<script>
  import AddModal from "./add_modal";
  import SearchForm from "@/components/public/searchForm";
  import {
    getOrderListByPage
  } from "@/axios/api"
  import bus from "../bus"
  const flowNo = 'Loan'

  export default {
    name: 'loan_sheet_policyList',
    components: {
      AddModal,
      SearchForm
    },
    data() {
      return {
        totalPage: 0, //总页数
        flowNo,
        serialNos: '',
        phaseName: null,
        tableData: [],
        multipleSelection: [], //选中的行数据
        isShowModal: false,
        searchForm: {},
        isModalEdit: false // 是新增还是编辑
      };
    },
    mounted() {
      bus.$on('fee_setting:isShowModal', (val) => {
        this.isShowModal = val;
      })
      bus.$on('fee_setting:isModalEdit', (val) => {
        this.isModalEdit = val;
      })
    },
    created() {
      this.check()
    },
    methods: {
      // 调单
      handleBranch() {

        if (this.multipleSelection.length == 0) {
          this.serialNos = '';
          this.$message.warning("请先选择调单合同")
          return;
        } else {
          this.serialNos = this.multipleSelection.map(item => item.serialNo).join(",")
        }

        if (this.multipleSelection.length > 1) {
          const contractStatusMinor = this.multipleSelection[0].contractStatusMinor

          let isOnly = this.multipleSelection.find(item => {
            return item.contractStatusMinor !== contractStatusMinor
          })

          if (isOnly) {
            this.$message.warning("不在同一阶段的合同，无法同时进行调单")
            return
          }
        }

        // phaseName
        this.phaseName = this.filter(this.multipleSelection[0].contractStatusMinor)
        this.isShowModal = true;

      },
      // phaseName 01 070020（ 审批初审）
      // phaseName 02 070030（ 审批终审）
      // phaseName 03 180020（ 放款初审）
      // phaseName 04 180030（ 放款初审）
      filter(rescode) {
        switch (rescode) {
          case '070020':
            return '01'
            break;
          case '070030':
            return '02'
            break;
          case '180020':
            return '03'
            break;
          case '180030':
            return '04'
            break;
          default:
            break;
        }
      },

      // 获取子组件数据
      getMsgFormSon(resInfo) {
        this.searchForm = resInfo;
      },
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      // edit(row) {
      //   this.formData = row;
      //   this.isShowModal = true;
      //   this.isModalEdit = true;
      // },


      async getDataList() {
        try {
          console.log(this.queryParams, 55)
          let params = Object.assign({}, this.queryParams)
          params.paramObj.flowNo = this.flowNo
          let res = await getOrderListByPage(params)
          this.tableData = res.data.rows;
          this.totalPage = res.data.totalCount;
        } catch (error) {
          console.log(error)
        }
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        console.log(val, 11)
        this.multipleSelection = val;
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