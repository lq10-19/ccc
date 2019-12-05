<template>
  <div class="container">
    <!-- 搜索from -->
    <SearchForm @setSearchInfo="getMsgFormSon"></SearchForm>

    <el-row style="margin-bottom:10px ">
      <el-button @click="handleBranch" v-has type="primary" plain>分单</el-button>
    </el-row>

    <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable"
      @selection-change="handleSelectionChange" @row-click="clickRow">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
      <el-table-column prop="serialNo" label="合同号" min-width="115" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="customerCertId" label="证件号码" min-width="145" align="center"></el-table-column>
      <el-table-column prop="productSuperType" label="产品大类" min-width="90" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="applyDate" label="申请时间" min-width="145" align="center"></el-table-column>
      <!-- <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button size='mini'>分单</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal :isShowModal="isShowModal" m_title='分单' :serialNos='serialNos' :flowNo='flowNo'></add-modal>
  </div>
</template>


<script>
  // 根据流程获取审批人员 
  // paramObj.flowNo（ 必要参数）
  // 审批分单中: 070040
  // 放款分单中: 180010
  const flowNo = 'Approval'


  import AddModal from "./add_modal";
  import SearchForm from "@/components/public/searchForm";
  import {
    getProductLimitList,
    queryOrderListByPage
  } from "@/axios/api"
  import bus from "../bus"


  export default {
    name: 'reinsurance_policy_policyList',
    components: {
      AddModal,
      SearchForm
    },
    data() {
      return {
        totalPage: 0, //总页数
        flowNo,
        tableData: [],
        multipleSelection: [], //选中的行数据
        isShowModal: false,
        searchForm: {},
        isModalEdit: false, // 是新增还是编辑
        serialNos: null
      };
    },
    created() {
      // 初始化调用

      this.check()
    },
    mounted() {
      bus.$on('fee_setting:isShowModal', (val) => {
        this.isShowModal = val;
      })
      bus.$on('fee_setting:isModalEdit', (val) => {
        this.isModalEdit = val;
      })
      console.log(this, 123456)
      // this.getDataList()
    },
    methods: {
      // 分单
      handleBranch() {

        if (this.multipleSelection.length == 0) {
          this.serialNos = ''
          this.$message.warning("请先选择分单合同")
          return;
        } else {
          this.serialNos = this.multipleSelection.map(item => item.serialNo).join(",")
        }

        this.isShowModal = true;
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
      //   this.isShowModal = true;
      //   this.isModalEdit = true;
      // },

      async getDataList() {
        try {
          console.log(this.queryParams, 55)
          let params = Object.assign({}, this.queryParams)
          params.paramObj.flowNo = this.flowNo
          console.log(params, 11)
          let res = await queryOrderListByPage(params)
          console.log(res, 11)
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