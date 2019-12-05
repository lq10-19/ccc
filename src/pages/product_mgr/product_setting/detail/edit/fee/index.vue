<template>
  <div class="container">
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="add">配置费用项</el-button>
        <el-button type="primary" @click="onDetail">费用项详情</el-button>
        <el-button type="primary" @click="setStatus('1')">启用</el-button>
        <el-button type="primary" @click="setStatus('2')">停用</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border class="table" ref="multipleTable" highlight-current-row
      @current-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
      <el-table-column type="index" width="50" label=" " align="center"></el-table-column>
      <el-table-column prop="productTermParas[0].defaultValue" label="费用项ID" align="center"></el-table-column>
      <el-table-column prop="termName" label="费用项名称" align="center"></el-table-column>
      <el-table-column prop="productTermParas[2].defaultValue" label="收取方式">
        <template slot-scope="scope">{{scope.row.productTermParas[2].defaultValue|collectWayFilter}}</template>
      </el-table-column>
      <el-table-column prop="productTermParas[2].defaultValue" label="结算方式">
        <template slot-scope="scope">{{scope.row.productTermParas[3].defaultValue|ClearMethodFilter}}</template>
      </el-table-column>
      <el-table-column prop="productTermParas[3].defaultValue" label="计算方式" width="100">
        <template slot-scope="scope">{{scope.row.productTermParas[4].defaultValue |calcuMethodFilter}}</template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{scope.row.status| statusFilter}}</template>
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
    <add-modal v-if="isShowModal" :isShowModal="isShowModal" :isModalEdit="isModalEdit"
      :objectNo="paramObj.paramObj.objectNo"></add-modal>

    <!------费用项详情------->
    <detail-modal :isShowModal="feeDetailModal" :formData="detailData"></detail-modal>
  </div>
</template>


<script>
  import AddModal from "./add_modal";
  import DetailModal from "./detail_modal";
  import {
    getProductTermList,
    setProductFeeStatus
  } from "@/axios/api";
  import bus from "../../../../bus";
  export default {
    components: {
      AddModal,
      DetailModal
    },
    props: {
      gradeId: {
        type: String,
        default: ""
      },
      versionId: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        totalCount: 1, //总页数
        paramObj: {
          pageSize: 10,
          currentPage: 1,
          paramObj: {
            objectNo: this.gradeId + "-" + this.versionId,
            termType: "FEE"
          }
        },
        formData: {
          itemNo: "",
          isInUse: ""
        },
        tableData: [],
        multipleSelection: {}, //选中的行数据
        detailData: {}, //选中详情信息
        isShowModal: false,
        isModalEdit: false, // 是新增还是编辑
        feeDetailModal: false //费用项详情弹框
      };
    },
    watch: {
      gradeId: function () {
        this.paramObj.paramObj.objectNo = this.gradeId + "-" + this.versionId;
        this.getDataList();
      }
    },
    mounted() {
      bus.$on("fee_setting:isShowModal", val => {
        this.isShowModal = val;
        this.getDataList();
      });
      bus.$on("fee_setting:feeDetailModal", val => {
        this.feeDetailModal = val;
      });
      this.init();
      this.getDataList();
    },
    methods: {
      init() {
        this.getSelect("CollectWay");
      },
      add() {
        this.isShowModal = true;
      },
      //费用项详情
      onDetail() {
        this.detailData = this.multipleSelection;
        if (JSON.stringify(this.detailData) === "{}") {
          return this.$message.warning("请选择");
        }
        this.feeDetailModal = true;
      },
      //设置状态
      setStatus(type) {
        this.detailData = this.multipleSelection;

        if (JSON.stringify(this.detailData) === "{}") {
          return this.$message.warning("请选择");
        }
        let statusMap = {
          "1": "启用",
          "2": "停用"
        };
        let prodArr = [];
        let obj = {};
        obj.termId = this.multipleSelection.termId;
        obj.objectNo = this.multipleSelection.objectNo;
        obj.feeTermNo = this.multipleSelection.productTermParas[0].defaultValue;
        obj.status = type;
        setProductFeeStatus(obj).then(res => {
          this.getDataList();
          this.$message.success(`${statusMap[type]}成功`);
        });
      },

      //分页
      handleCurrentChange(val) {
        this.paramObj.currentPage = val;
        this.getDataList();
      },

      getDataList() {
        getProductTermList(this.paramObj).then(res => {
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

<style>
</style>