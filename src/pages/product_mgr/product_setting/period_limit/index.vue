<template>
  <div class="container">

    <el-form>

      <el-form-item>
        <el-button @click="add">新增</el-button>
        <!-- <el-button @click="edit">编辑</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
      @row-click="clickRow">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="itemNo" label="贷款次数" align="center"></el-table-column>
      <el-table-column prop="isInUse" label="状态" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
      <el-table-column prop="updateUserName" label="更新人员" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalPage">
      </el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal :isShowModal="isShowModal" :isModalEdit="isModalEdit" :formData="formData"></add-modal>
  </div>
</template>


<script>
  import AddModal from "./add_modal";
  import {
    getProductLimitList
  } from "@/axios/api"
  import bus from "../bus"
  export default {
    components: {
      AddModal
    },
    data() {
      return {
        totalPage: 1, //总页数
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            feeTermName: ''
          }
        },
        formData: {
          itemNo: '',
          isInUse: ''
        },
        tableData: [],
        multipleSelection: [], //选中的行数据
        isShowModal: false,
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
      this.getDataList()
    },
    methods: {
      add() {
        this.isShowModal = true;
      },
      edit(row) {
        this.formData = row;
        this.isShowModal = true;
        this.isModalEdit = true;
      },

      //分页
      handleCurrentChange(val) {
        this.paramObj.currentPage = val;
        this.getDataList();
      },

      getDataList() {
        getProductLimitList(this.paramObj).then(res => {
          this.tableData = res.data.rows;
          this.totalPage = res.data.totalPage;
        })
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

<style>
</style>