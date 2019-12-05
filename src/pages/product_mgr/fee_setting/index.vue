<template>
  <div class="container">
    <el-row>
      <el-form :inline="true">

        <el-col :span="8">
          <el-form-item>
            <el-input placeholder="请输入费用项名称" v-model.trim="paramObj.paramObj.feeTermName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item>
            <el-button @click="getDataList" type="primary" plain>查询</el-button>
            <el-button @click="reset" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <div class="mgb-16">
      <el-button v-has @click="add" type="primary" plain>新增</el-button>
      <el-button v-has @click="edit" type="primary" plain>编辑</el-button>
    </div>

    <el-table :data="tableData" border class="table" highlight-current-row @current-change="handleSelectionChange"
      ref="multipleTable" :height="tableHeight">
      <el-table-column prop="feeTermNo" label="费用项ID" align="center"></el-table-column>
      <el-table-column prop="feeTermName" label="费用项名称" align="center"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          {{scope.row.status|statusFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人员" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateUserName" label="更新人员" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
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
  import {
    getBasicFee
  } from "@/axios/api";
  import bus from "../bus"
  export default {
    name: 'product_fee_setting',
    components: {
      AddModal
    },
    data() {
      return {
        //查询参数
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            feeTermName: ''
          }
        },
        totalCount: 1, //总数
        tableData: [],
        singleSelection: {}, //选中的行数据
        formData: {
          feeTermNo: "",
          feeTermName: "",
          status: ""
        },
        isShowModal: false,
        isModalEdit: false // 是新增还是编辑
      };
    },
    mounted() {
      bus.$on('fee_setting:isShowModal', (val) => {
        this.isShowModal = val;
        this.getDataList();
      })
      bus.$on('fee_setting:isModalEdit', (val) => {
        this.isModalEdit = val;
      })

      this.getDataList()
    },
    methods: {

      //新增
      add() {
        this.formData.feeTermNo = "";
        this.formData.feeTermName = "";
        this.formData.status = "";
        this.isShowModal = true;
      },
      //编辑
      edit() {
        this.formData = this.singleSelection;
        console.log(this.singleSelection)
        if (JSON.stringify(this.singleSelection) == '{}' || !this.singleSelection) {
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

      handleSelectionChange(val) {
        this.singleSelection = val;
      },

      //重置
      reset() {
        this.paramObj.paramObj.feeTermName = "";
        // 重置 刷新数据
        this.getDataList();
      },
      getDataList() {
        getBasicFee(this.paramObj).then(res => {
          this.tableData = res.data.rows;
          this.totalCount = res.data.totalCount;
        })
      },
    }
  };
</script>

<style>

</style>