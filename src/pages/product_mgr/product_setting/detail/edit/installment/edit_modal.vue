<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="isModalEdit"
      :before-close="modalClose"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="900px"
    >
      <div class="modal-wrap">
        <div class="basic-info">
          <div class="title">基本信息</div>
          <div class="base-save">
            <el-button type="primary" @click="submit">保 存</el-button>
          </div>
          <div class="content">
            <el-form label-position="left">
              <el-form-item label="期数" required>
                <el-select v-model="submitData.term" disabled>
                  <el-option
                    v-for="(item,index) in termList"
                    :key="index"
                    :label="item.itemName"
                    :value="item.itemNo"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="状态" required>
                <el-select v-model="submitData.status">
                  <el-option
                    v-for="(item,index) in statusArr"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="EIR/年" required>
                <el-input placeholder v-model="submitData.eir" @change="eirChange"></el-input>%
              </el-form-item>

              <el-form-item
                v-for="(items, idx) in productTermFeesList"
                :key="idx"
                :label="items.termFeeName"
                required
              >
                <template v-if="judgeType(items.temp) === 1">
                  <el-input
                    placeholder="请输入内容"
                    v-model="items.termAmount"
                    class="input-with-select"
                    @change="termAmountChange(items)"
                  ></el-input>元
                </template>
                <template v-else>
                  <el-input
                    placeholder="请输入内容"
                    v-model="items.termRate"
                    class="input-with-select"
                    @change="termRateChange(items)"
                  ></el-input>%
                  <el-select
                    class="rate-type-select"
                    v-model="items.termRateType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item,index) in FeeRateTypeList"
                      :label="item.itemName"
                      :value="item.itemNo"
                      :key="index"
                    ></el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="asset-config">
          <div class="title">资方配置</div>
          <div class="content">
            <el-form>
              <el-form-item style="margin-top:10px;">
                <el-button type="primary" plain data-type="add" @click="add()">新增</el-button>
                <el-button type="primary" plain data-type="edit" @click="edit()">编辑</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="tableData" @current-change="handleCurrentChange" highlight-current-row>
              <el-table-column
                prop="employerCode"
                label="资方名称"
                align="center"
                :formatter="employerCodeFormatter"
              ></el-table-column>
              <el-table-column prop="loanFixedRate" label="固定利率/年(%)" align="center"></el-table-column>
              <el-table-column label="管理费/年(%)" align="center">
                <template v-slot="{row}">
                  <span v-if="row.mgFeeTemp" v-text="row.mgFeeTemp.termRate"></span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align="center" :formatter="statusFormatter"></el-table-column>
              <el-table-column prop="createUserName" label="创建人员" align="center"></el-table-column>
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
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="modalClose">取 消</el-button> -->
        <!-- <el-button type="primary"  @click="submit">保 存</el-button> -->
      </span>
    </el-dialog>

    <!---资方配置新增弹窗------->
    <add-modal
      v-if="isShowConfig"
      :isShowModal="isShowConfig"
      :termId="submitData.termId"
      :mgFeeType="mgFeeType"
      :eirTemp="eirTemp"
      :termTemp="termTemp"
    ></add-modal>

    <!------------资方配置编辑弹窗------------------>
    <edit-modal
      v-if="isShowConfigEdit"
      :isShowModal="isShowConfigEdit"
      :employerId="employerId"
      :mgFeeType="mgFeeType"
      :eirTemp="eirTemp"
      :termTemp="termTemp"
    ></edit-modal>
  </div>
</template>

<script>
import bus from "../../../../bus";
import {
  getProductTerm,
  productTermToAdd,
  updateProductTerm,
  getEmployerList,
  queryTermDropDow,
  getProductTermList,
  getEmployerById
} from "@/axios/api";
import AddModal from "./assets_config/add_modal";
import EditModal from "./assets_config/edit_modal";
export default {
  components: {
    AddModal,
    EditModal
  },
  props: {
    isModalEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      a: "",
      employerId: "",
      totalCount: 1,
      paramObj: {
        pageSize: 10,
        currentPage: 1,
        paramObj: {
          termId: ""
        }
      },
      feeItem: {
        objectNo: this.objectNo,
        termAmount: "",
        termIdLibrary: "",
        termRate: "",
        termRateType: ""
      },
      selection: "",
      tableData: [],
      isEdit: false, //资方配置是新增还是编辑
      isShowConfig: false, //资方配置弹窗是否显示
      isShowConfigEdit: false, //资方配置编辑
      submitData: {},
      statusArr: [{ name: "启用", value: "1" }, { name: "停用", value: "2" }],
      productTermFeesList: [],
      productTermList: [],
      FeeRateTypeList: [],
      list: [],
      termList: [],
      mgFeeType: null, //管理费类型
      eirTemp: null
    };
  },

  mounted() {
    this.init();

    bus.$on("asset_config:isShowModal", val => {
      this.isShowConfig = val;
      this.init();
    });
    bus.$on("asset_config:isShowConfigEdit", val => {
      this.isShowConfigEdit = val;
      this.init();
    });
    this.getSelect("FeeRateType").then(res => {
      this.FeeRateTypeList = res.data;
    });
  },

  watch: {
    isModalEdit: function(val) {
      if (val) {
        this.init();
      }
    }
  },

  methods: {
    //资方配置新增
    add() {
      // if (!this.mgFeeType) {
      //   this.$message.warning("未知的管理费计算方式");
      //   return;
      // }
      if (isNaN(this.eirTemp)) {
        this.$message.warning("未知的EIR");
        return;
      }
      this.isShowConfig = true;
    },
    edit() {
      if (JSON.stringify(this.selection) == "{}" || !this.selection) {
        this.$message.warning("请选择");
        return;
      }
      this.isShowConfigEdit = true;
    },

    // 过滤计算
    getDataName(scope, items) {
      return scope[items];
    },
    submit() {
      this.submitData.productTermFees = this.productTermFeesList;
      if (!this.formCheck(this.submitData)) {
        return;
      }
      updateProductTerm(this.submitData).then(() => {
        this.$message.success("保存成功");
        this.getAssetData();
      });
    },
    getDataList() {
      return getProductTerm(this.submitData.termId).then(res => {
        this.productTermFeesList = res.data.productTermFees.filter(
          item => item.termFeeName !== "管理费"
        );
      });
    },
    getAssetData() {
      this.paramObj.paramObj.termId = this.submitData.termId;
      getEmployerList(this.paramObj).then(res => {
        this.tableData = res.data.rows || [];
        this.tableData.forEach(item => {
          if (isNaN(item.loanFixedRate)) {
            item.loanFixedRate = 0;
          }
          item.loanFixedRate = item.loanFixedRate.toFixed(6);
        });
        this.getEmployerByIds(this.tableData);
      });
    },
    getProductTermList() {
      const params = {
        pageSize: 99,
        currentPage: 1,
        paramObj: {
          objectNo: this.objectNo,
          termType: "FEE"
        }
      };
      return getProductTermList(params).then(resp => {
        this.productTermList = resp.data.rows;
      });
    },
    init() {
      if (Object.keys(this.submitData).length === 0) {
        this.submitData = JSON.parse(JSON.stringify(this.formData));
      }
      this.submitData.eir = this.numberFixed(this.submitData.eir, 6);
      this.eirTemp = parseFloat(this.submitData.eir);
      this.termTemp = this.submitData.term;
      const p1 = this.getDataList();
      this.getAssetData();
      this.objectNo = this.submitData.gradeId + "-" + this.submitData.versionId;
      const p2 = this.getProductTermList();
      productTermToAdd({ objectNo: this.objectNo }).then(res => {});
      this.queryTermDropDow();
      Promise.all([p1, p2]).then(() => {
        const productTermList = this.productTermList;
        const productTermFeesList = this.productTermFeesList;
        productTermFeesList.forEach(itemA => {
          this.$set(
            itemA,
            "temp",
            productTermList.find(itemB => itemA.termFeeName === itemB.termName)
          );
          const tempType = this.judgeType(itemA.temp);
          if (tempType === 1) {
            itemA.termAmount = this.numberFixed(itemA.termAmount, 2);
          } else if (tempType === 2) {
            itemA.termRate = this.numberFixed(itemA.termRate, 6);
          }
        });
        productTermList.forEach(item => {
          if (item.termName === "管理费") {
            if (item.productTermParas && item.productTermParas.length > 0) {
              const CalcuMethod = item.productTermParas.find(
                t => t.paraId === "CalcuMethod"
              );
              if (CalcuMethod && CalcuMethod.defaultValue) {
                this.mgFeeType = CalcuMethod.defaultValue.toString();
              }
            }
          }
        });
      });
    },
    modalClose() {
      bus.$emit("fee_setting:isModalEdit", false);
    },
    handleCurrentChange(val) {
      if (!val) {
        return;
      }
      this.selection = val;
      this.employerId = val.employerId;
    },
    queryTermDropDow() {
      queryTermDropDow({
        gradeId: this.$store.state.selectedGradeId,
        type: "1"
      }).then(res => {
        this.termList = res.data;
      });
    },
    formCheck(formData) {
      if (!formData.term) {
        this.$message.error("请选择期数");
        return false;
      }
      if (!formData.status) {
        this.$message.error("请选择状态");
        return false;
      }
      if (!formData.eir) {
        this.$message.error("请输入EIR");
        return false;
      }
      for (let i = 0; i < formData.productTermFees.length; ++i) {
        const item = formData.productTermFees[i];
        if (this.judgeType(item.temp) === 1) {
          if (!item.termAmount) {
            this.$message.error(`请输入${item.termFeeName}`);
            return false;
          }
        } else {
          if (!item.termRate) {
            this.$message.error(`请输入${item.termFeeName}`);
            return false;
          }
          if (!item.termRateType) {
            this.$message.error(`请选择${item.termFeeName}费率类型`);
            return false;
          }
        }
      }
      return true;
    },
    judgeType(item) {
      if (!item) {
        return;
      }
      if (item.productTermParas[4].defaultValue == "02") {
        //计算方式固定金额
        return 1;
      }
      if (item.productTermParas[4].defaultValue == "01") {
        //贷款金额*费率
        return 2;
      }
    },
    numberFixed(val, bit = 6) {
      const temp = parseFloat(val);
      if (isNaN(temp)) {
        return 0;
      }
      return temp.toFixed(bit);
    },
    eirChange(val) {
      this.submitData.eir = this.numberFixed(val);
    },
    termAmountChange(item) {
      item.termAmount = this.numberFixed(item.termAmount, 2);
    },
    termRateChange(item) {
      item.termRate = this.numberFixed(item.termRate, 6);
    },
    getEmployerByIds(list) {
      const pList = [];
      list.forEach(item => {
        pList.push(getEmployerById(item.employerId));
      });
      Promise.all(pList).then(respList => {
        respList.forEach(resp => {
          const data = resp.data;
          const productTermFees = data.productTermFees;
          if (!productTermFees || productTermFees.length === 0) {
            return;
          }
          const findItem = productTermFees.find(
            item => item.termFeeName === "管理费"
          );
          if (!findItem) {
            return;
          }
          const findL = list.find(item => item.employerId === data.employerId);
          if (!findL) {
            return;
          }
          if (isNaN(findItem.termRate)) {
            findItem.termRate = 0;
          }
          findItem.termRate = findItem.termRate.toFixed(2);
          this.$set(findL, "mgFeeTemp", {
            termRate: findItem.termRate,
            termRateType: findItem.termRateType
          });
        });
      });
    },
    statusFormatter({ status }) {
      if (status == "1") {
        return "启用";
      }
      if (status == "2") {
        return "停用";
      }
      return "";
    },
    employerCodeFormatter({ employerCode }) {
      let temp = "";
      switch (employerCode) {
        case "BQRZZL":
          temp = "佰仟融资租赁有限公司";
          break;
        case "XHXD-XHXD":
          temp = "西安星河网络小额贷款有限公司";
          break;
      }
      return temp;
    }
  }
};
</script>


<style scoped lang="scss">
/deep/ .el-form-item__content {
  max-width: 700px;
}
.modal-wrap {
  padding: 20px;
  .basic-info,
  .asset-config {
    position: relative;
    border: solid #bbb 1px;
    min-height: 100px;
    margin-top: 20px;
    .base-save {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
    .title {
      position: absolute;
      left: 20px;
      transform: translateY(-50%);
      background: white;
      padding: 10px;
      color: rgba(16, 16, 16, 1);
      font-weight: 700;
    }
    .content {
      padding: 10px;
      overflow: hidden;
    }
  }
}

.el-input {
  width: auto;
}
/deep/ .el-form-item__label {
  width: 130px;
}
.modal-innermodal-inner .left {
  width: 300px !important;
  border-right: solid #ddd 1px;
}

.modal-inner .right {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.rate-type-select {
  width: 100px;
}
</style>