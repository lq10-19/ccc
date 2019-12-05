<template>
  <div class="container">

    <!-- 搜索from  隐藏合同号-->
    <SearchForm @setSearchInfo="getMsgFormSon" :isShowSerialNo='false'></SearchForm>

    <el-row style="margin-bottom: 10px">
      <el-button type="primary" v-has plain @click="add">创建订单</el-button>
      <el-button type="primary" v-has plain @click="editOrder">编辑订单</el-button>
      <el-button type="primary" v-has plain @click="submitOrder">提交订单</el-button>
    </el-row>

    <el-table :data="tableData" border class="table" ref="multipleTable" :height="tableHeight" highlight-current-row
      @selection-change="handleSelectionChange" @row-click="clickRow">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <!-- <el-table-column type="index" width="50" align="center" label=" "></el-table-column> -->
      <el-table-column prop="serialNo" min-width='115' label="订单编号" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="customerCertId" min-width="145" label="证件号码" align="center"></el-table-column>
      <el-table-column prop="productSuperType" label="产品大类" min-width="90" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="applyAmount" label="贷款金额" align="center"></el-table-column>
      <el-table-column prop="createTimeNew" min-width="150" label="创建订单时间" align="center"></el-table-column>
      <el-table-column prop="temporarySave" label="保存状态" align="center" :formatter='Typeformatter'></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal :isShowModal="isShowModal" :formData="formData"></add-modal>

    <!-------详情弹窗------------>
    <!-- <detail-modal :isShowModal="showDetailModal"></detail-modal> -->
  </div>
</template>


<script>
  import AddModal from "./add_modal";
  // import DetailModal from "./detail/index";
  import SearchForm from "@/components/public/searchForm";
  import bus from "../bus"
  import {
    queryByBquserId,
    updateOrderPageState
  } from "@/axios/api";
  export default {
    name: 'bill_lading_apply',
    components: {
      AddModal,
      SearchForm
      //   DetailModal
    },
    data() {
      return {
        totalPage: 0,
        searchForm: {},
        formData: {}, //编辑弹框数据
        tableData: [],
        multipleSelection: [], //选中的行数据
        isShowModal: false,
        showDetailModal: false, //展示详情弹窗
        selection: {}
      };
    },
    created() {
      this.check()
    },
    mounted() {
      bus.$on('apply:createOrder', (val) => {
        this.isShowModal = val;
      })
      // this.getDataList()
    },

    methods: {
      // 获取子组件数据
      getMsgFormSon(resInfo) {
        this.searchForm = resInfo;
      },
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      //新增
      add() {
        this.isShowModal = true;
      },

      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      //编辑订单
      editOrder() {

        if (this.multipleSelection.length != 1) {
          this.$message.warning("请选择需要编辑的订单,支持单一订单操作")
          return;
        }
        let selection = this.multipleSelection[0];

        this.$router.push({
          path: 'bill_lading_edit_order',
          query: {
            'customername': selection.customerName,
            'certid': selection.customerCertId,
            "versionId": selection.versionId,
            "productId": selection.productId,
            'contractNo': selection.serialNo
          }
        })
      },
      // 提交订单
      submitOrder() {
        if (this.multipleSelection.length == 0) {
          this.$message.warning("请选择需要提交的订单")
          return;
        }
        let serialNoList = this.multipleSelection.map(item => item.serialNo)

        updateOrderPageState({
          serialNoList: serialNoList,
          orderPageState: 1, //1-待提交申请
        }).then(res => {
          this.$message.success("提交成功");
          this.getDataList()
        })
      },
      onDetail() {
        this.showDetailModal = true;
      },
      onCurrentChange(val) {
        this.selection = val || {};
      },
      async getDataList() {
        try {

          let res = await queryByBquserId({
            ...this.queryParams
          })
          this.tableData = res.data.rows;
          this.totalPage = res.data.totalCount;
        } catch (error) {
          console.log(error)
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      Typeformatter: function (row, column, cellValue, index) {
        // 1暂存，2保存
        switch (cellValue) {
          case '1':
            return '暂存'
            break;
          case '2':
            return '保存'
            break;
          default:
            break;
        }
      },
    }
  };
</script>

<style scoped lang="scss"></style>