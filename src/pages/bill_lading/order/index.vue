<template>
  <div class="container">

    <!-- 搜索from  隐藏合同号-->
    <SearchForm @setSearchInfo="getMsgFormSon" :isShowSerialNo='true'></SearchForm>

    <el-form>
      <el-form-item>
        <el-button type="primary" v-has plain @click="filterHand('onDetail')">订单详情</el-button>
        <el-button type="primary" v-has plain @click="filterHand('onSeeFile')">查看文件</el-button>
        <el-button type="primary" v-has plain @click="filterHand('cancelOrder')">取消订单</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" :height="tableHeight"
      @selection-change="handleSelectionChange" @row-click="clickRow">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="serialNo" min-width='115' label="订单编号" align="center"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="customerCertId" min-width='145' label="证件号码" align="center"></el-table-column>
      <el-table-column prop="productSuperType" min-width='90' label="产品大类" align="center">
        <template slot-scope="scope">{{scope.row.productSuperType|productTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="applyAmount" label="贷款金额" align="center"></el-table-column>
      <el-table-column prop="createTimeNew" min-width='140' label="创建订单时间" align="center"></el-table-column>
      <!-- <el-table-column prop="updateTimeNew" min-width='150' label="提交订单时间" align="center"></el-table-column> -->
      <el-table-column prop="applyDateNew" min-width='150' label="申请时间" align="center"></el-table-column>
      <el-table-column prop="orderPageState" min-width='100' label="订单状态" align="center">
      </el-table-column>
      <el-table-column prop="contractStatusMain" min-width='130' label="合同主状态" align="center"></el-table-column>
      <el-table-column prop="contractStatusMinor" min-width='130' label="合同子状态" align="center"></el-table-column>

    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40, 50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>


    <!-------详情弹窗------------>
    <!-- <detail-modal :isShowModal="showDetailModal"></detail-modal> -->
  </div>
</template>


<script>
  import SearchForm from "@/components/public/searchForm";
  import bus from "../bus"
  import {
    queryOrderPage,
    updateOrderPageState
  } from "@/axios/api";
  export default {
    name: 'bill_lading_order',
    components: {
      SearchForm
    },
    data() {
      return {
        totalPage: 0,
        searchForm: {},
        formData: {}, //编辑弹框数据
        tableData: [],
        multipleSelection: [], //选中的行数据
        isShowModal: false,
        showDetailModal: false //展示详情弹窗
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
      //查看订单详情
      orderInfo() {
        this.$router.push({
          path: 'bill_lading_order_info'
        })
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      // 过滤一下验证
      filterHand(resHandlName) {

        if (this.multipleSelection.length == 0) {
          this.$message.warning("请选择需要处理的合同")
          return;
        } else if (resHandlName != 'cancelOrder' && this.multipleSelection.length > 1) {
          this.$message.warning("此操作只支持单个订单处理")
          return;
        }

        this[resHandlName]()

      },
      //合同详情
      onDetail() {
        let selection = this.multipleSelection[0];
        this.$router.push({
          path: "/bill_lading_order_info",
          query: {
            'contractNo': selection.serialNo,
            'customername': selection.customerName,
            'certid': selection.customerCertId,
            "versionId": selection.versionId,
            "productId": selection.productId,
            phaseName: '订单列表'
          }
        })
      },
      // 获取数据
      async getDataList() {
        try {
          let res = await queryOrderPage({
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
      // 取消
      cancelOrder() {
        let serialNoList = this.multipleSelection.map(item => item.serialNo)
        updateOrderPageState({
          serialNoList,
          orderPageState: 2, //取消
        }).then(res => {
          this.$message.success("提交成功");
          this.getDataList()
        })
      },
      // 查看文件
      onSeeFile() {
        let selection = this.multipleSelection[0];
        this.$router.push({
          path: "/see_file",
          query: {
            serialNo: selection.serialNo,
          }
        })
      },
      // 过滤
      // 1 - 待提交申请， 2 - 已取消 "
      Stateformatter: function (row, column, cellValue, index) {
        switch (cellValue) {
          case '1':
            return '待提交申请'
            break;
          case '2':
            return '已取消'
            break;
          default:
            break;
        }
      },
    }
  };
</script>

<style scoped lang="scss">

</style>