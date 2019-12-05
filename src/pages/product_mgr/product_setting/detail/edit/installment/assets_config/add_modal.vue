<template>
  <div>
    <el-dialog
      title="新增"
      :visible.sync="isShowModal"
      :before-close="modalClose"
      :append-to-body="true"
      width="600px"
    >
      <div class="modal-inner">
        <el-form label-position="left" :inline="true">
          <el-form-item label="资方" required>
            <el-select
              v-model.trim="submitData.employerCode"
              placeholder="请选择"
              style="width:200px;"
            >
              <el-option
                v-for="(item, index) in employerList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="固定利率/年" required>
            <el-input-number
              v-model.trim="submitData.loanFixedRate"
              placeholder
              style="width:200px;"
              :precision="6"
              :controls="false"
              @change="loanFixedRateChange"
            ></el-input-number>%
          </el-form-item>

          <!-- <el-form-item label="管理费/年">
            <el-input v-model.trim="submitData.productTermFees[0].termRate" placeholder></el-input>%
          </el-form-item>-->

          <el-form-item
            v-for="(items, idx) in submitData.productTermFees"
            :key="idx"
            :label="items.tempTermName"
            required
          >
            <template v-if="items.termRateType =='02'">
              <el-input-number
                placeholder="请输入内容"
                v-model="submitData.productTermFees[idx].termAmount"
                class="input-with-select"
                style="width:200px;"
                :precision="items.tempTermName ==='管理费'?2:6"
                :controls="false"
              ></el-input-number>
            </template>

            <template v-else>
              <el-input-number
                placeholder="请输入内容"
                v-model="submitData.productTermFees[idx].termRate"
                class="input-with-select"
                style="width:200px;"
                :precision="items.tempTermName ==='管理费'?2:6"
                :controls="false"
                :disabled="items.tempTermName ==='管理费'"
              ></el-input-number>%
              <template v-if="items.tempTermName ==='管理费'">
                <el-select
                  v-model="submitData.productTermFees[idx].termRateType"
                  placeholder="请选择"
                  style="width:100px; margin-left:10px;"
                  id="managementExpenseSelect"
                  :disabled="items.tempTermName ==='管理费'"
                >
                  <el-option
                    v-for="(item,index) in FeeRateTypeList1"
                    :label="item.itemName"
                    :value="item.itemNo"
                    :key="index"
                  ></el-option>
                </el-select>
              </template>
              <template v-else>
                <el-select
                  v-model.trim="submitData.productTermFees[idx].termRateType"
                  placeholder="请选择"
                  style="width:100px; margin-left:10px;"
                  id="managementExpenseSelect"
                >
                  <el-option
                    v-for="(item,index) in FeeRateTypeList"
                    :label="item.itemName"
                    :value="item.itemNo"
                    :key="index"
                  ></el-option>
                </el-select>
              </template>
            </template>
          </el-form-item>

          <el-form-item label="状态" required>
            <el-select v-model.trim="submitData.status" placeholder="请选择" style="width:200px;">
              <el-option
                v-for="(item,index) in statusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../../../../../bus";
import { saveEmployer, employerToAdd, queryCapitalList } from "@/axios/api";

export default {
  props: {
    isShowModal: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    termId: {
      type: String,
      default: ""
    },
    mgFeeType: {
      type: String,
      required: false
    },
    eirTemp: {
      type: Number,
      required: true
    },
    termTemp: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      feeItem: {
        objectNo: this.objectNo,
        objectType: "Product",
        termAmount: 0,
        termId: "",
        termIdLibrary: "",
        termRate: 0,
        termRateType: "",
        tempTermName: ""
      },
      queryParams: {
        objectNo: this.objectNo
      },
      submitData: {
        status: "",
        employerCode: "", //资方编码
        gradeId: this.$store.state.selectedGradeId, //档位
        loanFixedRate: 0, //固定利率
        productId: this.$store.state.selectedProductId,
        productTermFees: [
          // {
          //   objectNo: this.objectNo,
          //   objectType: "Product",
          //   termAmount: 0,
          //   termId: "",
          //   termIdLibrary: "",
          //   termRate: 0,
          //   termRateType: ""
          // }
        ],
        termId: this.termId, //期数
        versionId: this.versionId
      },
      productTermFeesList: [],
      employerList: [
        { name: "佰仟融资租赁有限公司", value: "BQRZZL" },
        { name: "西安星河网络小额贷款有限公司", value: "XHXD-XHXD" }
      ],
      statusList: [{ name: "启用", value: "1" }, { name: "停用", value: "2" }],
      FeeRateTypeList: [],
      FeeRateTypeList1: []
    };
  },
  inject: ["objectNo", "versionId"],
  watch: {
    termId(newV) {
      // this.queryParams.termId = newV;
      this.submitData.productTermFees[0].termId = newV;
      this.submitData.termId = newV;
      this.init();
    }
  },
  mounted() {
    this.init();
    this.getSelect("FeeRateType").then(res => {
      this.FeeRateTypeList = res.data;
      this.FeeRateTypeList1 = res.data.filter(
        item => item.itemName === "年费率"
      );
    });
  },

  methods: {
    init() {
      employerToAdd(this.queryParams).then(res => {
        this.productTermFeesList = res.data.productTermLibrarys;
        let length = res.data.productTermLibrarys.length;
        for (let i = 0; i < length; i++) {
          this.submitData.productTermFees.push(
            JSON.parse(JSON.stringify(this.feeItem))
          );
          this.submitData.productTermFees[i].termIdLibrary =
            res.data.productTermLibrarys[0].termId;
          this.submitData.productTermFees[i].termId = this.termId;
          this.submitData.productTermFees[i].tempTermName =
            res.data.productTermLibrarys[i].termName;
        }
        const findItem = this.productTermFeesList.find(
          item => item.termName === "管理费"
        );
        if (findItem) {
          findItem.termRateType = this.FeeRateTypeList1[0].itemNo;
        }
        const findItemA = this.submitData.productTermFees.find(
          item => item.tempTermName === "管理费"
        );
        if (findItemA) {
          findItemA.termRateType = this.FeeRateTypeList1[0].itemNo;
        }
      });
      //queryCapitalList();
    },
    submitCheck() {
      const submitData = this.submitData;
      if (!submitData.employerCode) {
        this.$message.warning("请选择资方");
        return false;
      }
      if (!submitData.loanFixedRate) {
        this.$message.warning("请填写固定利率");
        return false;
      }
      if (!submitData.status) {
        this.$message.warning("请选择状态");
        return false;
      }
      return true;
    },
    submit() {
      if (this.submitCheck()) {
        saveEmployer(this.submitData).then(res => {
          this.modalClose();
        });
      }
    },
    modalClose() {
      bus.$emit("asset_config:isShowModal", false); // 直接修改父组件的属性
    },
    loanFixedRateChange() {
      let result = 0;
      if (this.submitData.loanFixedRate > this.eirTemp) {
        this.$message.warning("固定利率不能大于EIR");
        return;
      }
      if (!this.mgFeeType) {
        return;
      }
      if (this.mgFeeType === "01") {
        const term = this.termTemp;
        const tempI = this.eirTemp / 100 / 12;
        const tempJ = 1 + tempI;
        const tempK = Math.pow(tempJ, term);
        const tempF = this.submitData.loanFixedRate / 100;
        const tempO = tempF / 12;
        const tempP = 1 + tempO;
        const tempR = Math.pow(tempP, term);
        const tempA = (tempI * tempK) / (tempK - 1);
        const tempB = (tempO * tempR) / (tempR - 1);
        result = (tempA - tempB) * 100 * 12;
        result = result.toFixed(2);
      } else if (this.mgFeeType === "03") {
        result = this.eirTemp - this.submitData.loanFixedRate;
        result = result.toFixed(2);
      } else {
        this.$message.warning("未知的管理费计算方式");
      }
      const item = this.productTermFeesList.forEach((item, index) => {
        if (item.termName === "管理费") {
          this.submitData.productTermFees[index].termRate = result;
        }
      });
    }
  }
};
</script>


<style scoped lang="scss">
.el-input {
  width: auto;
}
/deep/ .el-form-item__label {
  width: 130px;
}
.modal-inner .left {
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
#managementExpenseSelect > .el-input > .el-input__inner {
  width: 100px;
}
</style>