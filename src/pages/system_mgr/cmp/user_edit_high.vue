<template>
  <div>
    <el-dialog title="选择上级" :visible.sync="isEdit" append-to-body :before-close="modalClose" width="800px">
      <div class="modal-inner">
        <el-row>
          <el-form :inline="true" ref='searchForm' :model="searchForm" class="demo-form-inline">
            <el-col :span="9">
              <el-form-item label="用户账号" prop='userLoginAccount'>
                <el-input v-model.trim="searchForm.userLoginAccount" placeholder="用户账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="用户姓名" prop='userName'>
                <el-input v-model.trim="searchForm.userName" placeholder="用户姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" plain @click="queryHandles">查询</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

        <div class="table">
          <el-table :data="tableData" border class="table" ref="multipleTable" highlight-current-row
            @current-change="onCurrentChange" :height='tableHeight'>
            <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column prop="userLoginAccount" label="用户账号" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户姓名" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
            <el-table-column prop="email" label="用户邮箱" align="center"></el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
              :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
              layout="total,sizes, prev, pager, next" :total="totalPage">
            </el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="define">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "../bus";
  import {
    getUserInfo
  } from "@/axios/api";
  export default {
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      changeLeader: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        multipleSelection: [],
        totalPage: 0,
        searchForm: {
          userLoginAccount: null,
          userName: null,
        },
        tableData: [],
      };
    },
    watch: {
      isEdit(newVal, oldVal) {
        if (newVal) {
          this.check()
        }
      }
    },

    methods: {
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      // 重置
      reset() {
        this.$refs.searchForm.resetFields();
        this.check()
      },

      // 关闭弹窗
      modalClose() {
        bus.$emit("user:isEdit.high", false); // 直接修改父组件的属性
        // this.$parent.showEditHigh()
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onCurrentChange(val) {
        console.log(val, 1)
        this.selection = val || {};
      },
      // 
      define() {
        this.modalClose()
        bus.$emit("user:isEdit.leaderId", this.selection)
        if (this.changeLeader) {
          this.$parent.changeLeaderFu()
        }
      },
      async getDataList() {
        try {
          console.log(this.queryParams, 11)
          let res = await getUserInfo({
            ...this.queryParams
          })
          console.log(res, 111)
          this.tableData = res.data.rows
          this.totalPage = res.data.totalCount
        } catch (error) {
          console.log(error)
        }
      },
    }
  };
</script>


<style scoped lang="scss">


</style>