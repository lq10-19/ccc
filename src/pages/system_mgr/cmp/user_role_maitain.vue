<template>
  <div>
    <el-dialog title="角色维护" :visible.sync="showRoleMaitain" :before-close="modalClose" width="680px">
      <div class="modal-inner">
        <el-form style="margin-bottom: 10px">
          <el-button @click="addRole">添加角色</el-button>
          <el-button @click="deleteRole">移除角色</el-button>
        </el-form>
        <el-table :data="tableData"   @selection-change="handleSelectionChange" @row-click="clickRow" border :height='tableHeight-80'
          ref="multipleTable">
          <el-table-column width="55" align="center" type="selection"></el-table-column>
          <el-table-column prop="roleId" label="角色编号" align="center"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
          <el-table-column prop="roleType" label="角色类型" align="center" :formatter='Stateformatter'></el-table-column>
          <el-table-column prop="departmentName" label="所属机构" align="center"></el-table-column>
          <!-- <el-table-column prop="creatTime" label="角色状态" align="center"></el-table-column> -->
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
     
        <el-button type="primary" @click="modalClose">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>

    <RoleDialog :isRoleDialog='isRoleDialog' :userId='userId' @RoleList="getMsgFormSon"></RoleDialog>
  </div>
</template>

<script>
  import bus from "../bus";
  import RoleDialog from "./role_dialog.vue";
  import {
    saveByIds,
    queryRoleListByUserId,
    userRoledelete
  } from "@/axios/api";

  export default {
    components: {
      RoleDialog,
    },
    props: {
      showRoleMaitain: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
      }
    },
    data() {
      return {
        tableData: [],
        isRoleDialog: false,
        multipleSelection: [],
        roleIdList: []
      };
    },
    watch: {
      showRoleMaitain: function (newV, old) {
        if (newV) {
          this.getRoleList()
        }
      }

    },
    methods: {
      // 选择角色
      addRole() {
        this.isRoleDialog = !this.isRoleDialog;
      },
      modalClose() {
        bus.$emit("user:showRoleMaintain", false); // 直接修改父组件的属性
      },
      //获取子组件选中的角色list
      getMsgFormSon(resdata) {
        console.log(resdata, 7889)
        this.roleIdList = resdata;
      },
      getRoleList() {
        queryRoleListByUserId({
          userId: this.userId
        }).then(res => {
          this.tableData = res.data;
        }).catch(error => {
          console.log(error)
        })
      },
      // 保存
      setAddRole() {
        let params = [];
        this.roleIdList.forEach(element => {
          let obj = {}
          obj.roleId = element.roleId;
          obj.userId = this.userId;
          params.push(obj)
        });
        saveByIds(params).then(res => {
          this.$message.success('添加成功')
          this.getRoleList()
        }).catch(error => {
          console.log(error)
        })
      },
      // 批量删除
      deleteRole() {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择需移除的角色')
          return;
        }
        let params = [];
        this.multipleSelection.forEach(element => {
          let obj = {}
          obj.roleId = element.roleId;
          obj.userId = this.userId;
          params.push(obj)
        });
        userRoledelete(params).then(res => {
          this.$message.success('移除成功')
          this.getRoleList()
        }).catch(error => {
          console.log(error)
        })
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      Stateformatter: function (row, column, cellValue, index) {
        //角色类型  0:普通;1:管理员;默认:0
        switch (cellValue) {
          case '0':
            return '普通'
            break;
          case '1':
            return '管理员'
            break;
          default:
            break;
        }
      },
    }
  };
</script>


<style scoped lang="scss">
  .el-input {
    width: auto;
  }
</style>