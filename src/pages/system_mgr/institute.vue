<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-button @click="showAdd" v-has>新增</el-button>
    </el-row>
    <div class="table">

      <!-- 删除提示框 -->
      <el-dialog title="提示" :visible.sync="delVisible" width="480px" center>
        <div class="del-dialog-cnt">机构名： {{deleteInfo.departmentName}}</div>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteRow">确 定</el-button>
          <el-button @click="delVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-table :data="tableData" row-key="departmentId" border :height='tableHeight+48' ref="multipleTable"
        default-expand-all>
        <el-table-column prop="departmentName" label="机构名称" min-width="200">
          <template slot-scope="scope">
            <i class="t-icon m-dep"></i>
            <span style="margin-left: 10px">{{ scope.row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="机构状态" min-width="80" :formatter='formatter' align="center">
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width="110" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" align="center">
        </el-table-column>
        <el-table-column prop="updateUserName" label="更新人" min-width="110" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center">
        </el-table-column>
        <el-table-column label="操作" min-width="210">
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-has size="mini" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button v-has size="mini" type="warning" v-if="scope.row.state==0"
                @click.stop="handleUpdate(scope.$index, scope.row)">禁用</el-button>
              <el-button v-has size="mini" type="primary" v-else @click.stop="handleUpdate(scope.$index, scope.row)">启用
              </el-button>
              <el-button v-has size="mini" type="danger" @click.stop="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-modal :isNew="isNew" :mechanismList='tableData'></add-modal>
    <edit-modal :isEdit="isEdit" :rowData="rowData" :mechanismList='tableData'></edit-modal>
  </div>
</template>

<script>
  import treeTable from "@/components/tree-table/tree-table.vue";
  import addModal from "./cmp/institute_new";
  import editModal from "./cmp/institute_edit";
  import bus from "./bus";
  import Bus from "@/bus.js";
  import {
    deleteDepartment,
    getDepartmentInfo,
    editDepartment,
  } from "@/axios/api";
  export default {
    name: 'authority_mgr_institution',
    components: {
      treeTable,
      addModal,
      editModal
    },
    data() {
      return {
        tableData: [],
        props: {
          label: "name",
          children: "zones"
        },
        deleteInfo: {},
        totalPage: 0,
        departmentId: '',
        delVisible: false,
        isNew: false, //是否显示新增
        isEdit: false, //是否显示编辑
        rowData: {}
      };
    },
    created() {
      console.log(this)
    },
    mounted() {
      //监听弹窗
      bus.$on("institute:isNew", val => {
        this.isNew = val;
      });
      bus.$on("institute:isEdit", val => {
        this.isEdit = val;
      });
      //监听当前点击菜单的接口
      this.getDataList();
    },
    methods: {
      getDataList() {
        getDepartmentInfo({
          'departmentId': '2019081409300528226'
        }).then(res => {
          this.tableData = res.data;
        });
      },
      rowClick(e) {
        console.log(e);
      },
      showAdd() {
        this.isNew = true;
      },
      // 编辑
      handleEdit(resIndex, resValue) {
        this.rowData = resValue;
        this.isEdit = true;
      },
      //删除
      handleDelete(resIndex, resValue) {
        this.delVisible = true;
        this.deleteInfo = resValue;
        this.departmentId = resValue.departmentId;
      },
      // 确定删除
      deleteRow(id) {
        let idArr = [];
        idArr.push(this.departmentId);
        deleteDepartment(idArr).then(res => {
          this.getDataList();
        });
        this.$message.success("删除成功");
        this.delVisible = false;
      },
      handlerExpand(m) {
        console.log("展开/收缩");
        m.isExpand = !m.isExpand;
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      handleUpdate(resIndex, resValue) {
        console.log(resValue, 777)
        // 0 启用 1 禁用
        let params = Object.assign({}, resValue)
        params.state = resValue.state == '0' ? '1' : '0';
        let name = resValue.state == '1' ? '启用' : '禁用';
        let title = `确定修改 ${resValue.departmentName} 状态为 ${name} ?`
        this.$confirm(title, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(() => {
          editDepartment(params)
            .then(response => {
              this.$message.success("启用成功");
              this.getDataList();
            });
        });
      },
      //  过滤
      formatter: function (row, column, cellValue, index) {
        return cellValue == "0" ? "启用" : "禁用";
      },
    }
  };
</script>

<style scoped lang="scss">
  /deep/ .content {
    padding: 22px;
    padding-bottom: 6px;
    background: #fff !important;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .del-dialog-cnt {
    margin: 12px 0;
    font-size: 16px;
  }

  .t-icon {
    display: inline-block;
    width: 14px;
    height: 18px;
    background-size: 100% 100% !important;
    vertical-align: middle;
    margin: -3px 4px 0 0;

    &.m-dep {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAASCAYAAABrXO8xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDZEQUMxRDA0Q0U1MTFFODlGQkJCODYxMDNDRkIzQUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDZEQUMxRDE0Q0U1MTFFODlGQkJCODYxMDNDRkIzQUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNkRBQzFDRTRDRTUxMUU4OUZCQkI4NjEwM0NGQjNBQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNkRBQzFDRjRDRTUxMUU4OUZCQkI4NjEwM0NGQjNBQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj8y8UsAAAIjSURBVHjanJPPa9RQEMe/85Jss7v9RVO0UtqDVbR2FbEXEQQP3qTgyX9AEG89KagHRfDi3yAIvfai3qRYUbH0sNJakUV6KOyWLii2btNkNz9enpPEddkfVPALj8mbzGdm3ryElFLwtu4qqjVsre6VKVKboj/3GX2Zj5DqG4jK6NSZp9CTh9FhqCPRQOgFM/hhz1B177puahC5LKD4PQmXE+xDGHNsizEiErAhAddPd1PjXCiC3LMZIF7si2QOMhyDkg+bRVMwScsKI8BvgOKtECnYrq0OsENaDFArYQ/1BJNwats19der41+SDWZ5kRGHMxgd0mqzZHTAsSZgXgaMSfbL9cMrCoaUA2TGGbjBOXji6jRPf3NekfGMuiryxwCdc2W4LVVj6BJDv3ja5dTS0QIiZ7C7VUNLbY2raSJujZf4MxMzOS8Fy9V2ML4CQ0e0tAERBDCs4xz4hv3bUJn4RByvLbMdybWDcVIvYIdEZmQY6BdQuyuo6BdBUQFfdqZRP+B2R323q1UV01kdZPpQZoBbb2/j0QoPZsdDsWTj2MJVfK8MhT2uQ4PulbjF13hRvIIgP42Tzie8Kq1D16qYPzuEO+/ODbaug1Ch0J8gkvAvPF8jZ99YfLlamLA8DCCLpdCErOcxa7nQAmrdIwljklR4X6mfT5z8qaqj9117fHPqQc3era9+Lbn3Tmyct6zq3Nr27PuyO/YhYeIf+X/0W4ABAGLgy0VZgovSAAAAAElFTkSuQmCC) no-repeat;
    }
  }
</style>