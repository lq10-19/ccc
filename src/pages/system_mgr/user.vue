<template>
  <div class="container">
    <el-row>
      <el-form :model="searchForm" ref="searchForm" inline label-position='left' label-width="70px">
        <el-col :span="8">
          <el-form-item label='用户账号' prop='userLoginAccount'>
            <el-input v-model.trim='searchForm.userLoginAccount' placeholder="请输入用户账号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='用户姓名' prop='userName'>
            <el-input v-model.trim='searchForm.userName' placeholder="请输入用户姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='用户状态' prop='userState'>
            <!-- 0:在职;1:离职;2:请假 -->
            <el-select v-model.trim='searchForm.userState' placeholder="请选择用户状态">
              <el-option label="在职" value="0"></el-option>
              <el-option label="离职" value="1"></el-option>
              <el-option label="请假" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='上级' prop='leaderName'>
            <!-- <el-input v-model.trim='searchForm.userName'></el-input> -->
            <el-input v-model.trim='searchForm.leaderName' readonly placeholder="请选择上级"></el-input>
            <el-button v-has @click="showEditHigh">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="queryHandles" type="primary" plain>查询</el-button>
            <el-button @click="reset" type="primary" plain>重置</el-button>
            <el-button v-has @click="addHandle">新增</el-button>
            <el-button v-has @click="handleDelete">删除</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-button @click="edit">编辑</el-button> -->
          <el-button v-has @click="roleMaintenance">角色维护</el-button>
          <el-button v-has @click="changeSuperior">变更上级</el-button>
          <el-button v-has @click="resetPassword">重置密码</el-button>
        </el-col>
      </el-form>
    </el-row>

    <div>
      <el-table :data="tableData" border class="table" ref="multipleTable" :height='tableHeight'
        @selection-change="handleSelectionChange" @row-click="clickRow">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="userLoginAccount" label="用户账号" min-width="90" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户姓名" min-width="90" align="center"></el-table-column>
        <el-table-column prop='departmentName' min-width="120" label="所属机构" align="center"></el-table-column>
        <el-table-column prop='leaderId' label="上级" min-width="90" align="center"></el-table-column>
        <el-table-column prop="userType" label="用户类型" align="center" :formatter='Typeformatter'></el-table-column>
        <el-table-column prop="userState" label="用户状态" align="center" :formatter='Stateformatter'></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width="100" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="140" align="center"></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width="100" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="140" align="center"></el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" @click.stop="edit(scope.row)">编辑</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
          :current-page.sync="currentPageS" :page-sizes="[10, 20, 30, 40,50]" :page-size="10"
          layout="total,sizes, prev, pager, next" :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <!--新增/编辑-->
    <add-modal :isNew="isNew" :isEditUser="isEditUser" :tableData="tableData" :formData="rowData"></add-modal>
    <!--选择上级-->
    <edit-modal :isEdit="isEdit" :changeLeader='changeLeader'></edit-modal>
    <!--角色维护 -->
    <role-maitain :showRoleMaitain="showRoleMaitain" :userId='userId'></role-maitain>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteRow">确 定</el-button>
        <el-button @click="delVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "./bus";
  import Bus from "@/bus.js";
  import {
    deleteUser,
    getUserInfo,
    resetPwd,
    changeLeaderAsk
  } from "@/axios/api";
  import editModal from "./cmp/user_edit_high";
  import addModal from "./cmp/user_new";
  import roleMaitain from "./cmp/user_role_maitain";
  export default {
    name: 'authority_mgr_user',
    components: {
      editModal,
      addModal,
      roleMaitain
    },
    data() {
      return {
        delVisible: false,
        isNew: false,
        totalPage: 0,
        isEdit: false, //是否显示上级弹框
        isEditUser: false, //是否编辑用户
        showRoleMaitain: false,
        changeLeader: false,
        tableData: [],
        rowData: {},
        searchForm: {
          leaderName: null,
          userName: null,
          userLoginAccount: null,
          userState: null,
        },
        multipleSelection: [],
        userIds: [],
        leaderInfo: null,
        userId: null
      };
    },
    created() {
      this.check()
    },
    methods: {
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      // 修改
      edit(rowData) {
        this.rowData = rowData;
        this.isEditUser = true;
        this.isNew = true;
      },
      // 新增
      addHandle() {
        this.rowData = {};
        this.isNew = true;
      },
      //删除
      handleDelete() {

        if (this.multipleSelection && this.multipleSelection.length == 0) {
          this.$message.warning("请选择用户");
          return;
        }
        this.userIds = this.multipleSelection.map(item => item.userId)

        this.delVisible = true;
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      handleSelectionChange(resvalue) {
        this.multipleSelection = resvalue || [];
      },
      // 重置密码
      resetPassword() {
        console.log(this.multipleSelection, 77)

        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.warning("请选择用户,支持操作单一用户");
          return;
        }
        const _this = this;

        this.$confirm('您确定要重置密码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetPwd({
            userId: _this.multipleSelection[0].userId,
            password: '123456'
          }).then(res => {
            _this.$message.success("重置成功");
          })
        }).catch(() => {

        });
      },
      // 重置
      reset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.leaderId = '';
        this.check()
      },
      // 变更上级
      changeSuperior() {

        if (this.multipleSelection && this.multipleSelection.length == 0) {
          this.$message.warning("请选择用户");
          return;
        }
        this.isEdit = true;
        this.changeLeader = true;
      },
      //确认删除
      deleteRow() {
        deleteUser(this.userIds).then(res => {
          this.$message.success("删除成功");
          this.delVisible = false;
          this.getDataList()
        });
      },
      // 获取列表数据
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
      // 选择上级
      showEditHigh() {
        this.isEdit = !this.isEdit;
        this.changeLeader = false;
      },
      // 角色维护
      roleMaintenance() {
        if (this.multipleSelection && this.multipleSelection.length != 1) {
          this.$message.warning("请选择用户,支持操作单一用户");
          return;
        }
        this.userId = this.multipleSelection[0].userId;
        this.showRoleMaitain = !this.showRoleMaitain;
      },
      // 更改上级
      changeLeaderFu() {

        let LeaderList = []
        this.multipleSelection.map(item => {
          let obj = {}
          obj.userId = item.userId;
          obj.leaderId = this.leaderInfo.userId;
          LeaderList.push(obj)
        })

        changeLeaderAsk(LeaderList).then(res => {
          this.$message.success("更改上级成功");
          // 修改上级  更新数据
          this.getDataList()
        }).catch(error => {
          console.log(error)
        })
      },
      //  过滤
      // 用户类型(0:内部员工;1:外部员工)
      Typeformatter: function (row, column, cellValue, index) {
        switch (cellValue) {
          case '0':
            return '内部员工'
            break;
          case '1':
            return '外部员工'
            break;
          default:
            return ''
            break;
        }
      },
      // 用户状态(0:在职;1:离职;2:请假)
      Stateformatter: function (row, column, cellValue, index) {
        switch (cellValue) {
          case '0':
            return '在职'
            break;
          case '1':
            return '离职'
            break;
          case '2':
            return '请假'
            break;
          default:
            return ''
            break;
        }
      },

    },

    mounted() {
      bus.$on("user:isNew", val => {
        this.isNew = val;
      });

      bus.$on("user:isEditUser", val => {
        this.isEditUser = val;
      });
      bus.$on("user:isEdit.high", val => {
        this.isEdit = val;
      });
      bus.$on("user:isEdit.leaderId", val => {
        this.leaderInfo = val
        this.searchForm.leaderName = val.userName;
        this.searchForm.leaderId = val.userId;
      });

      bus.$on("user:showRoleMaintain", val => {
        console.log(val);
        this.showRoleMaitain = val;
      });
    }
  };
</script>

<style scoped lang="scss">
  .el-input {
    width: auto;
  }


  .table {
    margin-top: 10px;
    overflow: hidden;

    .table-left {
      max-width: 200px;
      float: left;
    }

    .table-right {
      float: right;
      width: 100%;
    }
  }
</style>