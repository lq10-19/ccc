<template>
  <div class="container">

    <!-- 搜索from -->
    <ContractSearchForm @setSearchInfo="getMsgFormSon" :isContractSearch='false'></ContractSearchForm>

    <el-row style="margin-bottom: 10px">
      <el-button type="primary" v-has plain @click="onDetail">合同详情</el-button>
      <el-button type="primary" v-has plain @click="onSeeView">查看意见</el-button>
      <el-button type="primary" v-has plain @click="getLoanExcel">导出放款报表</el-button>
      <el-button type="primary" v-has plain @click="getTransferListExcel">导出债转报表</el-button>
    </el-row>
    <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable" highlight-current-row
      @current-change="onCurrentChange">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
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
      <el-table-column prop="applyDate" label="申请时间" min-width='140' align="center"></el-table-column>
      <el-table-column prop="putoutDate" label="放款时间" min-width='140' align="center"></el-table-column>
      <el-table-column prop="contractStatusMain" min-width='110' label="合同主状态" align="center"></el-table-column>
      <el-table-column prop="contractStatusMinor" min-width='110' label="合同子状态" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
        :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
        layout="total,sizes, prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>

    <!-------------------选择下载模板-------------------------->
    <ReportTemplate :isShowModal="isShowModalR" m_title='导出放款报表' :columnInfo="searchForm"></ReportTemplate>

    <!-------------------查看意见弹窗-------------------------->
    <SeeViewModel m_title='查看意见' :isShowModal='isShowModal' source='放款初审' :columnInfo='selection'></SeeViewModel>

  </div>
</template>


<script>
  import {
    queryContractListInfo,
    exportLoanExcel,
    exportTransferListExcel
  } from "@/axios/api";

  import ContractSearchForm from "@/components/public/contractSearchForm";
  import SeeViewModel from "@/components/public/seeView_model";
  import ReportTemplate from "./reportTemplate.vue";
  // queryType 010  查询
  // queryType 020  未结清
  // queryType 030  已结清

  export default {
    name: 'contract_search',
    components: {
      ContractSearchForm,
      SeeViewModel,
      ReportTemplate
    },
    data() {
      return {
        searchForm: {},
        isShowModal: false,
        isShowModalR: false,
        totalPage: 0,
        formData: {}, //编辑弹框数据
        tableData: [],
        selection: {} //选中的行数据
      };
    },
    mounted() {

    },
    created() {
      this.check()
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
      //合同详情
      onDetail() {
        if (Object.keys(this.selection).length === 0) {
          this.$message.warning("请选择进行操作的合同");
          return;
        }
        this.$router.push({
          path: "/contract_detail",
          query: {
            serialNo: this.selection.serialNo,
            phaseName: '合同查询'
          }
        });
      },

      //查看合同意见
      onSeeView() {
        if (Object.keys(this.selection).length === 0) {
          this.$message.warning("请选择进行操作的合同");
          return;
        }
        this.isShowModal = !this.isShowModal;
      },

      onCurrentChange(val) {
        this.selection = val || {};
      },
      // 导出放款报表
      getLoanExcel() {
        this.isShowModalR = !this.isShowModalR;
      },
      // 导出应收账款转让清单报表
      getTransferListExcel() {
        exportTransferListExcel(this.queryParams.paramObj).then(res => {
          const blob = res.data;
          // 判断token失效
          if (res.data.type.includes('json')) {
            this.$router.push('/login');
            this.$message.warning('超时请重新登录')
            return;
          }
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = e => {
            const a = document.createElement("a");
            a.download = `应收账款转让清单报表${new Date().Format("yyyyMMdd")}.xls`; //fileName;
            // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      },
      async getDataList() {
        try {
          console.log(this.queryParams, 55)
          let params = Object.assign({}, this.queryParams)
          params.paramObj.queryType = '010'
          console.log(params, 11)
          let res = await queryContractListInfo(params)
          console.log(res, 11)
          this.tableData = res.data.rows;
          this.totalPage = res.data.totalCount;
        } catch (error) {
          console.log(error)
        }
      },
    }
  };
</script>