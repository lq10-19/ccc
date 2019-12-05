<template>
  <div class="container">
    <el-row >
      <el-form  :inline="true">
        <el-col :span="8">
          <el-form-item label='业务类型'>
            <el-select v-model.trim="paramObj.paramObj.businessType" placeholder="请选择">
              <el-option v-for="(item,index) in businessTypeArr" :key="index" :label="item.itemName"
                :value="item.itemNo">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='产品大类'>
            <el-input v-model.trim="paramObj.paramObj.typeName" @input="productChange" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="getDataList" type="primary" plain>查询</el-button>
            <el-button @click="reset" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="margin-bottom:16px;">
          <el-button type="primary" v-has plain @click="add">新增</el-button>
          <el-button type="primary" v-has plain @click="edit">编辑</el-button>
        </el-col>
      </el-form>
    </el-row>


    <el-table :data="tableData" border class="table" ref="multipleTable" highlight-current-row
      @current-change="handleSelectionChange" :height="tableHeight">
      <el-table-column prop="typeNo" label="产品大类ID" min-width='100' align="center"></el-table-column>
      <el-table-column prop="typeName" label="产品大类" align="center"></el-table-column>
      <el-table-column prop="businessType" align="center" label="业务类型">
        <template slot-scope="scope">{{scope.row.businessType|businessTypeFilter}}</template>
      </el-table-column>
      <el-table-column prop="creditType" align="center" label="授信方式">
        <template slot-scope="scope">{{scope.row.creditType|creditTypesFilter}}</template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">{{scope.row.status|statusFilter}}</template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人员" align="center"></el-table-column>
      <el-table-column prop="createTime" min-width='110' label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateUserName" label="更新人员" align="center"></el-table-column>
      <el-table-column prop="updateTime" min-width='110' label="更新时间" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount"
        :page-size="paramObj.pageSize"></el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal :isShowModal="isShowModal" :isModalEdit="isModalEdit" :formData="formData"></add-modal>
  </div>
</template>


<script>
  import AddModal from "./add_modal";
  import bus from "../bus";
  import {
    getProductCate,
    getCodeLibray
  } from "@/axios/api";
  import {
    stringFilter
  } from "@/lib/util";
  const CREDIT_TYPE = [];
  export default {
    name: 'product_cate',
    components: {
      AddModal
    },
    data() {
      return {
        totalCount: 1,
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            typeName: "",
            businessType: ""
          }
        },
        businessTypeArr: [],
        formData: {}, //编辑弹框数据
        tableData: [],
        multipleSelection: {}, //选中的行数据
        isShowModal: false,
        isModalEdit: false // 是新增还是编辑
      };
    },
    mounted() {
      bus.$on("fee_setting:isShowModal", val => {
        this.isShowModal = val;
        this.getDataList();
      });
      bus.$on("fee_setting:isModalEdit", val => {
        this.isModalEdit = val;
        this.getDataList();
      });
      this.getSelect("BusinessType").then(res => {
        this.businessTypeArr = res.data;
      });
      this.getCodeLibray().then(() => {
        this.getDataList();
        this.init();
      });
    },
    filters: {
      creditTypesFilter(val) {
        const item = CREDIT_TYPE.find(item => item.itemNo == val);
        return item ? item.itemName : "";
      }
    },
    methods: {
      init() {
        this.getSelect("ProductStatus").then(res => {});
      },
      getCodeLibray() {
        return getCodeLibray("CreditType").then(resp => {
          resp.data.forEach(item => {
            CREDIT_TYPE.push(item);
          });
        });
      },
      add() {
        this.isShowModal = true;
      },
      edit() {
        this.formData = this.multipleSelection;
        if (!this.formData || JSON.stringify(this.formData) == "{}") {
          this.$message.warning("请选择");
          return;
        }
        this.isShowModal = true;
        this.isModalEdit = true;
      },

      //分页
      handleCurrentChange(val) {
        this.paramObj.currentPage = val;
        this.getDataList();
      },

      reset() {
        this.paramObj.paramObj.businessType = "";
        this.paramObj.paramObj.typeName = "";
        // 重置 刷新数据
        this.getDataList();
      },

      //产品大类输入
      productChange(str) {
        this.paramObj.paramObj.typeName = stringFilter(str);
      },

      getDataList() {
        getProductCate(this.paramObj).then(res => {
          this.tableData = res.data.rows;
          this.totalCount = res.data.totalCount;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  };
</script>

<style scoped lang="scss">
  /deep/ .el-input__inner {
    width: 200px !important;
    display: inline-block;
  }

  /deep/ .el-input--small {
    width: 200px;
  }

  .form-item-label {
    display: inline-block;
    width: 80px;
  }
</style>