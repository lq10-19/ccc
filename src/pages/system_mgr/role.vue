<template>
  <div class="container">
    <el-row>
      <el-form :model="searchForm" ref="searchForm" inline label-position='left' label-width="80px">
        <el-col :span="8">
          <el-form-item label='角色名称' prop='roleName'>
            <el-input v-model.trim="searchForm.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='所属机构' prop='departmentIdList'>
            <el-cascader v-model.trim="searchForm.departmentIdList" placeholder="请选择所属机构" :show-all-levels="false"
              @change="handleChange" :props='props' :options="departmentArr">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label='角色类型' prop='roleType'>
            <el-select v-model.trim="searchForm.roleType" placeholder="请选择角色类型">
              <el-option v-for="(item,index) in roleTypeList" :key="index" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" plain @click="queryHandles">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
        </el-col>
        <el-col :span="16">
          <el-button v-has @click="add">新增</el-button>
          <el-button v-has @click="handleDelete">删除</el-button>
          <!-- <el-button>编辑</el-button> -->
          <el-button v-has @click="showResource">分配资源</el-button>
        </el-col>
      </el-form>
    </el-row>

    <el-table :data="tableData" border class="table" :height='tableHeight' ref="multipleTable"
      @selection-change="handleSelectionChange" @row-click="clickRow">
      <el-table-column width="55" align="center" type="selection"></el-table-column>
      <el-table-column prop="roleId" label="角色编号" align="center" min-width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="departmentName" label="所属部门" min-width="110" align="center"></el-table-column>
      <el-table-column prop="roleState" label="角色状态" min-width="80" align="center" :formatter='Typeformatter'>
      </el-table-column>
      <el-table-column prop="roleType" label="角色类型" min-width="80" align="center" :formatter='Stateformatter'>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人" min-width="80" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="140" align="center"></el-table-column>
      <el-table-column prop="updateUserName" label="修改人" min-width="80" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="140" align="center"></el-table-column>
      <el-table-column label="操作" min-width="80" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" v-has @click.stop="handleEdit( scope.row,scope.$index)">编辑</el-button>
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

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="deleteRow">确 定</el-button>
        <el-button @click="delVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--分配资源弹框-->
    <resouce-modal :isShowResource="isShowResource" :roleId='roleId'></resouce-modal>

    <add-modal :isNew="isNew" :isEdit="isEdit" :formData="formData"></add-modal>
  </div>
</template>

<script>
  import Resource from "./cmp/distribute_resource.vue";
  import AddModal from "./cmp/role_new";
  import bus from "./bus";
  import Bus from "@/bus.js";
  import {
    deleteRole,
    addUser,
    getDepartmentInfo,
    getRoleInfo
  } from "@/axios/api";
  import {
    resetObj
  } from "@/lib/util";
  export default {
    name: 'authority_mgr_role',
    components: {
      "resouce-modal": Resource,
      "add-modal": AddModal
    },
    data() {
      return {
        queryParams: {
          pageNo: 1,
          pageSize: 10,
        },
        totalPage: 0,
        searchForm: {
          roleName: "",
          departmentId: "",
          departmentIdList: null,
          roleType: ""
        },
        role: '',
        departmentArr: [], //所属机构列表
        isShowResource: false, //是否显示分配资源弹框
        tableData: [],
        multipleSelection: [],
        delVisible: false,
        roleId: null,
        roleIds: [],
        props: {
          value: 'departmentId',
          label: 'departmentName',
          checkStrictly: true
        },
        isCollapse: true,
        isNew: false,
        rolsIds: "", //角色id
        isEdit: false, // 是否显示编辑弹窗
        formData: {
          roleId: "",
          roleName: ""
        },
        //角色类型列表
        roleTypeList: [{
            name: "普通",
            value: "0"
          },
          {
            name: "管理员",
            value: "1"
          },
        ],
      };
    },
    created() {
      // 
      this.check()
      // 获取机构数据
      this.getDepartmentInfo()
    },
    mounted() {

      bus.$on("role:isNew", val => {
        this.isNew = val;
      });

      bus.$on("role:isEdit", val => {
        this.isEdit = val;
      });

    },
    methods: {
      //  修改mixin混入中的参数
      getParams() {
        return this.searchForm;
      },
      getDepartmentInfo() {
        getDepartmentInfo({
          'departmentId': '2019081409300528226'
        }).then(res => {
          this.departmentArr = res.data;
        });
      },
      // 获取列表数据
      async getDataList() {
        try {
          console.log(this.queryParams, 11)
          let res = await getRoleInfo({
            ...this.queryParams
          })
          console.log(res, 111)
          this.tableData = res.data.rows
          this.totalPage = res.data.totalCount
        } catch (error) {
          console.log(error)
        }
      },
      // 重置
      reset() {
        this.searchForm.departmentId = '';
        this.$refs.searchForm.resetFields();
        // 
        this.check()
      },

      //编辑
      handleEdit(row) {
        this.formData = row;
        this.isNew = true;
        this.isEdit = true;
      },
      //新增
      add() {
        this.isNew = true;
        this.formData = {};
      },
      handleDelete() {
        if (this.multipleSelection && this.multipleSelection.length == 0) {
          this.$message.warning("请选择用户");
          return;
        }
        this.roleIds = this.multipleSelection.map(item => item.roleId)
        this.delVisible = true;
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 确定删除
      deleteRow() {
        deleteRole(this.roleIds).then(res => {
          this.$message.success("删除成功");
          this.delVisible = false;
          this.getDataList();
        });
      },
      handleChange(data) {
        console.log(data, 1)
        if (data && data.length > 0) {
          this.searchForm.departmentId = data[data.length - 1]
        } else {
          this.searchForm.departmentId = ''
        }
      },
      //分配资源
      showResource() {

        if (this.multipleSelection && this.multipleSelection.length == 0) {
          this.$message.warning("请选择用户");
          return;
        } else if (this.multipleSelection && this.multipleSelection.length > 1) {
          this.$message.warning("支持单一操作");
          return;
        }
        this.roleId = this.multipleSelection[0].roleId;
        this.isShowResource = !this.isShowResource;
      },
      // 过滤
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
      Typeformatter: function (row, column, cellValue, index) {
        // 角色状态(0:启用;1:停用;默认:0)
        switch (cellValue) {
          case '0':
            return '启用'
            break;
          case '1':
            return '停用'
            break;
          default:
            break;
        }
      },
    }
  };
</script>

<style scoped lang="scss">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-input {
    width: auto;
  }

  .table {
    margin-top: 20px;
  }

  .fl-itm {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>