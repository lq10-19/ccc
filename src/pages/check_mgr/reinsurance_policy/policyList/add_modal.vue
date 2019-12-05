<template>
  <div>
    <el-dialog :title="m_title" :visible.sync="isShowModal" :before-close="modalClose" width="860px">

      <el-row>
        <el-form :inline="true" ref='from' :model='submitData' class="demo-form-inline">
          <el-col :span="10">
            <el-form-item label='用户账号' prop='userAccount'>
              <el-input v-model.trim="submitData.userAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label='姓名' prop='userName'>
              <el-input v-model.trim="submitData.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button @click="getDataList" type="primary" plain>查询</el-button>
              <el-button @click="reset" type="primary" plain>重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-table :data="tableData" border class="table" ref="multipleTable" highlight-current-row
        @selection-change="handleSelectionChange"  @current-change="onCurrentChange">
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column type="index" width="50" align="center" label=" "></el-table-column>
        <el-table-column prop="userAccount" label="用户账号" align="center"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="toApproveSum" label="待审批单量" align="center"></el-table-column>
        <el-table-column prop="onlineFlagStr" label="状态" align="center"></el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "../bus";
  import {
    getSysUserList,
    distributeOrde
  } from "@/axios/api";
  export default {
    props: {
      isShowModal: {
        type: Boolean,
        default: false
      },
      m_title: {
        type: String,
        default: false
      },
      flowNo: {
        type: String,
        required: true
      },
      serialNos: {
        type: String,
      },
    },
    data() {
      return {
        submitData: {
          userAccount: "",
          userName: ""
        },
        tableData: [],
        selection: {},
      };
    },

    mounted() {},
    watch: {
      isShowModal: function (newValue, bb) {
        // 显示弹框
        if (newValue) {
          this.getDataList()
        }
      }
    },
    methods: {
      onCurrentChange(val) {
        this.selection = val || {};
      },
      // 查询调单人员列表
      getDataList() {
        let params = Object.assign({}, this.submitData, {
          flowNo: this.flowNo
        })
        getSysUserList(params)
          .then(res => {
            this.tableData = res.data
          });
      },
      // 重置
      reset() {
        this.$refs.from.resetFields();
        // 重置 刷新数据
        this.getDataList();
      },
      submit() {
        let selection = JSON.stringify(this.selection);
        if (selection === "{}") {
          this.$message.warning("请选择接单人员")
          return;
        }
        let params = Object.assign({}, {
          flowNo: this.flowNo,
          serialNos: this.serialNos,
          userId: this.selection.userId
        })
        distributeOrde(params).then(res => {
          if (res.code == '200') {
            this.$message.success('分单成功')

            this.modalClose()
            // 调用父组件方法更新数据状态
            this.$parent.getDataList();
          }
        })
      },

      modalClose() {
        bus.$emit("fee_setting:isShowModal", false); // 直接修改父组件的属性
      },
      handleSelectionChange(val) {
        // this.multipleSelection = val;
      }
    }
  };
</script>