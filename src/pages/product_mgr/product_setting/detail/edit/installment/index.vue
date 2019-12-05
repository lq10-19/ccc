<template>
  <div class="container">
    <el-form>
      <el-form-item>
        <el-button @click="add">新增</el-button>
        <el-button @click="edit">编辑</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      class="table"
      ref="multipleTable"
      @current-change="handleSelectionChange"
      highlight-current-row
      v-loading
    >
      <el-table-column prop="term" label="贷款期数" align="center"></el-table-column>
      <el-table-column prop="eir" label="EIR/年(%)" align="center"></el-table-column>

      <el-table-column v-for="item in  termFeeList" :key="item.index" :label="item.label">
        <template v-slot="{row}">
          <span
            v-if="judgeTermType(row,item) === 1"
          >{{row.productTermFees[item.index].termAmount|toFixed(2)}}￥</span>
          <span v-else>
            {{row.productTermFees[item.index].termRate|toFixed(6)}}%
            <span
              v-if="row.productTermFees[item.index].termRateType == '01'"
            ></span>
            <span v-if="row.productTermFees[item.index].termRateType == '02'"></span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">{{scope.row.status|statusFilter}}</template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateUserName" label="更新人员" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="paramObj.pageSize"
      ></el-pagination>
    </div>

    <!---新增弹窗------->
    <add-modal
      v-if="isShowModal"
      :isShowModal="isShowModal"
      :isModalEdit="isModalEdit"
      :objectNo="objectNo"
    ></add-modal>

    <!---编辑弹窗------->
    <edit-modal
      v-if="isModalEdit"
      :isModalEdit="isModalEdit"
      :formData="formData"
      :objectNo="objectNo"
    ></edit-modal>
  </div>
</template>


<script>
import AddModal from "./add_modal";
import EditModal from "./edit_modal";
import { getProductTermTableList } from "@/axios/api";
import bus from "../../../../bus";
export default {
  components: {
    AddModal,
    EditModal
  },
  props: {
    gradeId: { type: String, default: "" },
    versionId: { type: String, default: "" }
  },
  data() {
    return {
      objectNo: this.gradeId + "-" + this.versionId,
      totalCount: 1, //总页数
      paramObj: {
        pageSize: 10,
        currentPage: 1,
        paramObj: {
          // productId: this.$store.state.selectedProductId,
          // versionId: this.versionId,
          objectNo: "",
          gradeId: ""
        }
      },
      formData: {},
      tableData: [],
      multipleSelection: {}, //选中的行数据
      isShowModal: false,
      isModalEdit: false, // 是新增还是编辑
      termFeeList: [],
      tableData: []
    };
  },
  provide() {
    return {
      objectNo: this.objectNo,
      versionId: this.versionId
      // termId:this.formData.termId
    };
  },
  filters: {
    toFixed: function(val, bit = 6) {
      if (isNaN(parseFloat(val))) {
        val = 0;
      }
      return val.toFixed(bit);
    }
  },
  watch: {
    gradeId: function(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }
      this.objectNo = this.gradeId + "-" + this.versionId;
      this.getDataList();
    }
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
    this.getDataList();
  },
  methods: {
    add() {
      this.objectNo = this.gradeId + "-" + this.versionId;
      this.isShowModal = true;
    },
    edit() {
      if (
        JSON.stringify(this.multipleSelection) == "{}" ||
        !this.multipleSelection
      ) {
        return this.$message.warning("请选择");
      }
      this.objectNo = this.gradeId + "-" + this.versionId;
      this.formData = this.multipleSelection;
      this.isModalEdit = true;
    },

    // 过滤计算
    getDataName(scope, items) {
      return scope[items];
    },
    //分页
    handleCurrentChange(val) {
      this.paramObj.currentPage = val;
      this.getDataList();
    },

    getDataList() {
      this.paramObj.paramObj.objectNo = this.objectNo;
      this.paramObj.paramObj.gradeId = this.gradeId;
      getProductTermTableList(this.paramObj).then(res => {
        const data = res.data.rows;
        this.tableData = data;
        this.tableData.forEach(item => {
          let eir = item.eir;
          if (Number.isNaN(Number.parseFloat(eir))) {
            item.eir = 0;
          } else {
            item.eir = item.eir.toFixed(6);
          }
        });
        if (data && data[0]) {
          this.makeTermFeeList(data[0]);
        }
        this.sortProductTermFees(data);
      });
    },
 
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    makeTermFeeList(item) {
      let productTermFees = item.productTermFees;
      if (!productTermFees || productTermFees.length === 0) {
        return;
      }
      productTermFees = productTermFees.filter(
        item => item.termFeeName !== "管理费"
      );
      this.termFeeList = productTermFees.map((item, index) => {
        let lable = "";
        if (!item.termRate || !item.termRateType) {
          lable = item.termFeeName + "(元)";
        } else {
          if (item.termRateType === "01") {
            lable = item.termFeeName + "/年(%)";
          }
          if (item.termRateType === "02") {
            lable = item.termFeeName + "/月(%)";
          }
        }
        return {
          label: lable,
          name: item.termFeeName,
          index: index
        };
      });
    },
    judgeTermType(row, item) {
      const temp = row.productTermFees[item.index];
      const { termRate, termRateType } = temp;
      if (!termRate || !termRateType) {
        return 1;
      } else {
        return 2;
      }
    },
    sortProductTermFees(data) {
      for (let i = 0; i < data.length; ++i) {
        const termItem = data[i].productTermFees;
        const tempTerm = [];
        for (let j = 0; j < this.termFeeList.length; ++j) {
          const feeItemName = this.termFeeList[j].name;
          tempTerm.push(
            termItem.find(item => item.termFeeName === feeItemName)
          );
        }
        data[i].productTermFees = tempTerm;
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-input__inner {
  width: auto !important;
}
</style>