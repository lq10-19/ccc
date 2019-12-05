<template>
  <div>
    <el-dialog
      title="费用项详情"
      :visible.sync="isShowModal"
      :before-close="modalClose"
      append-to-body
      width="600px"
    >
      <div class="modal-inner">
        <el-form
          v-if="submitData.productTermParas&&submitData.productTermParas.length > 0"
          label-position="left"
          :inline="true"
          label-width="150px"
        >
          <el-form-item label="费用项名称" required>
            <el-input placeholder disabled v-model.trim="submitData.termName"></el-input>
          </el-form-item>

          <el-form-item label="费用项ID" required>
            <el-input placeholder disabled v-model.trim="submitData.productTermParas[0].defaultValue"></el-input>
          </el-form-item>

          <el-form-item label="是否分期设置" required>
            <el-select
              placeholder
              v-model.trim="submitData.productTermParas[1].defaultValue"
              :disabled="isA15"
            >
              <el-option
                v-for="(item,index) in yesNoList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="收取方式" required>
            <el-select
              placeholder
              v-model.trim="submitData.productTermParas[2].defaultValue"
              @change="collectChange"
              :disabled="isA15"
            >
              <el-option
                v-for="(item,index) in CollectWayList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="结算方式" required>
            <el-select
              placeholder
              v-model.trim="submitData.productTermParas[3].defaultValue"
              :disabled="isA15"
            >
              <el-option
                v-for="(item,index) in ClearMethodList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="计算方式" required>
            <el-select placeholder="请选择" v-model.trim="submitData.productTermParas[4].defaultValue">
              <el-option
                v-for="(item,index) in CalcuMethodList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="固定金额" required v-show="isShowFixAmount">
            <el-input
              v-model.trim="submitData.productTermParas[5].defaultValue"
              @change="fixAmountChange"
            ></el-input>元
          </el-form-item>

          <el-form-item label="费率" required v-show="isShowFeeRate">
            <el-input
              v-model.trim="submitData.productTermParas[6].defaultValue"
              @change="feeRateChangeChange"
            ></el-input>
            <span>%</span>
            <select
              placeholder="请选择"
              class="zl-select"
              v-model.trim="submitData.productTermParas[6].dataType"
            >
              <option
                v-for="(item,index) in InterestTypeList"
                :key="index"
                :label="item.itemName"
                :value="item.itemNo"
              ></option>
            </select>
          </el-form-item>

          <el-form-item label="前端是否显示" required>
            <el-select
              placeholder
              v-model.trim="submitData.productTermParas[7].defaultValue"
              :disabled="isA15"
            >
              <el-option
                v-for="(item,index) in H5DisplayList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="ifShowEarlyRepayment" label="提前还款减免比例" required>
            <el-input @change="earlyRepayMentChange" v-model.trim="submitData.EarlyRepayment"></el-input>%
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
import bus from "../../../../bus";
import { isPosNumber } from "@/lib/util";
import {
  addProductLimitList,
  editProductLimitList,
  updateBaisicFee,
  getAddStruct
} from "@/axios/api";
const TERM_PARAMS = [
  {
    defaultValue: "",
    objectNo: "",
    paraId: "FeeType",
    paraName: "费用类型",
    termId: ""
  },
  {
    defaultValue: "",
    objectNo: "2019080700000006-V1.0",
    paraId: "FeeTerm",
    paraName: "是否分期设置",
    termId: ""
  },

  {
    defaultValue: "",
    objectNo: "",
    paraId: "CollectWay",
    paraName: "收取方式",
    termId: ""
  },
  {
    defaultValue: "",
    objectNo: "",
    paraId: "ClearMethod",
    paraName: "结算方式",
    termId: ""
  },
  {
    defaultValue: "",
    objectNo: "",
    paraId: "CalcuMethod",
    paraName: "计算方式",
    termId: ""
  },

  {
    defaultValue: "",
    objectNo: "",
    paraId: "FeeAmount",
    paraName: "固定金额",
    termId: ""
  },

  {
    dataType: "",
    defaultValue: "1",
    objectNo: "",
    paraId: "FeeRate",
    paraName: "费率",
    termId: ""
  },

  {
    defaultValue: "",
    objectNo: "",
    paraId: "Display",
    paraName: "前段是否显示",
    termId: ""
  }
];
export default {
  props: {
    isShowModal: {
      type: Boolean,
      default: false
    },
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
      yesNoList: [{ name: "是", value: "1" }, { name: "否", value: "0" }],
      CollectWayList: [
        { name: "分期收取", value: "01" },
        { name: "期初一次性收取", value: "02" }
      ],
      InterestTypeList: [],
      H5DisplayList: [
        { name: "显示且必填", value: "01" },
        { name: "显示且非必填", value: "02" },
        { name: "不显示", value: "03" }
      ],
      TERM_PARAMS,
      submitData: {
        productTermParas: [],
        EarlyRepayment: null
      }
    };
  },
  created() {
    getAddStruct().then(res => {
      res.data.EarlyRepayment = null;
      this.submitData = res.data;
    });
  },
  mounted() {
    this.init();
  },

  watch: {
    formData: {
      handler(newV) {
        this.submitData = newV;
        if (!this.submitData.productTermParas) {
          return;
        }
        let findItem = this.submitData.productTermParas.find(
          item => item.paraId === "EarlyRepayment"
        );
        if (findItem && !this.submitData.EarlyRepayment) {
          this.$set(this.submitData, "EarlyRepayment", findItem.defaultValue);
        }
      },
      deep: true
    }
  },

  methods: {
    init() {
      this.getSelect("FeeRateType").then(res => {
        this.InterestTypeList = res.data;
      });
    },

    //判断是否为空
    isEmpty() {
      if (!this.submitData.termName) {
        this.$message.error("费用项名称不能为空");
        return false;
      }
      if (!this.submitData.productTermParas[1].defaultValue) {
        this.$message.error("请选择是否分期设置");
        return false;
      }
      if (!this.submitData.productTermParas[2].defaultValue) {
        this.$message.error("请选择收取方式");
        return false;
      }
      if (!this.submitData.productTermParas[3].defaultValue) {
        this.$message.error("请选择结算方式");
        return false;
      }
      if (!this.submitData.productTermParas[4].defaultValue) {
        this.$message.error("请选择计算方式");
        return false;
      }
      if (
        this.isShowFixAmount &&
        !this.submitData.productTermParas[5].defaultValue
      ) {
        this.$message.error("请输入固定金额");
        return false;
      }
      if (
        this.isShowFeeRate &&
        !this.submitData.productTermParas[6].defaultValue
      ) {
        this.$message.error("请输入费率");
        return false;
      }
      if (this.isShowFeeRate && !this.submitData.productTermParas[6].dataType) {
        this.$message.error("请选择费率类型");
        return false;
      }
      if (!this.submitData.productTermParas[7].defaultValue) {
        this.$message.error("请输选择前端是否显示");
        return false;
      }
      if (this.ifShowEarlyRepayment && !this.submitData.EarlyRepayment) {
        this.$message.error("请输入提前还款减免比例");
        return false;
      }
      return true;
    },
    checkForm() {
      if (!this.isEmpty()) {
        return false;
      }
      if (
        this.isShowFixAmount &&
        !isPosNumber(this.submitData.productTermParas[5].defaultValue)
      ) {
        this.$message.error("固定金额格式不正确");
        return false;
      }
      if (
        this.isShowFeeRate &&
        !isPosNumber(this.submitData.productTermParas[6].defaultValue)
      ) {
        this.$message.error("费率格式不正确");
        return false;
      }
      if (
        this.ifShowEarlyRepayment &&
        !isPosNumber(this.submitData.EarlyRepayment)
      ) {
        this.$message.error("提前还款减免比例格式不正确");
        return false;
      }
      return true;
    },

    submit() {
      this.submitData.feeTermNo = this.submitData.productTermParas[0].defaultValue;
      if (!this.checkForm()) {
        return;
      }
      if (this.submitData.termName == "VIP包") {
        let find = this.submitData.productTermParas.find(
          item => item.paraId === "EarlyRepayment"
        );
        if (find) {
          find.defaultValue = this.submitData.EarlyRepayment;
        } else {
          this.submitData.productTermParas = this.submitData.productTermParas.filter(
            item => !!item.termId
          );
          this.submitData.productTermParas.push({
            defaultValue: this.submitData.EarlyRepayment,
            objectNo: this.submitData.objectNo,
            paraId: "EarlyRepayment",
            paraName: "提前还款减免比例",
            termId: this.submitData.termId
          });
        }
      }
      updateBaisicFee(this.submitData).then(res => {
        this.modalClose();
      });
    },

    //提前还款比例改变
    earlyRepayMentChange(val) {
      let temp = parseFloat(val).toFixed(6);
      if (isNaN(temp)) {
        this.submitData.EarlyRepayment = null;
      } else {
        this.submitData.EarlyRepayment = temp;
      }
    },
    //费率输入
    feeRateChangeChange(val) {
      let temp = parseFloat(val).toFixed(6);
      if (isNaN(temp)) {
        this.submitData.productTermParas[6].defaultValue = null;
      } else {
        this.submitData.productTermParas[6].defaultValue = temp;
      }
    },
    //固定金额输入
    fixAmountChange(val) {
      let temp = parseFloat(val).toFixed(2);
      if (isNaN(temp)) {
        this.submitData.productTermParas[5].defaultValue = null;
      } else {
        this.submitData.productTermParas[5].defaultValue = temp;
      }
    },
    //收取方式修改
    collectChange(val) {
      if (val == "01") {
        this.submitData.productTermParas[3].defaultValue = "01";
      } else {
        this.submitData.productTermParas[3].defaultValue = "02";
      }
    },
    modalClose() {
      bus.$emit("fee_setting:feeDetailModal", false); // 直接修改父组件的属性
    }
  },
  computed: {
    ClearMethodList: function() {
      const val = this.submitData.productTermParas[2].defaultValue;
      if (val == "01") {
        return [{ name: "还款时结算", value: "01" }];
      } else {
        return [{ name: "放款时结算", value: "02" }];
      }
    },
    CalcuMethodList: function() {
      if (this.submitData.termName === "管理费") {
        return [
          { name: "贷款金额*费率", value: "01" },
          { name: "月息费-月利息", value: "03" }
        ];
      } else {
        return [
          { name: "贷款金额*费率", value: "01" },
          { name: "固定金额", value: "02" }
        ];
      }
    },
    isShowFixAmount: function() {
      return (
        this.submitData.productTermParas[4].defaultValue == "02" &&
        this.submitData.productTermParas[1].defaultValue == "0"
      );
    },
    isShowFeeRate() {
      return (
        this.submitData.productTermParas[4].defaultValue == "01" &&
        this.submitData.productTermParas[1].defaultValue == "0"
      );
    },
    ifShowEarlyRepayment() {
      if (
        !this.submitData.productTermParas ||
        this.submitData.productTermParas.length < 0
      ) {
        return false;
      }
      return this.submitData.productTermParas[0].defaultValue === "C01";
    },
    isA15() {
      if (
        !this.submitData.productTermParas ||
        this.submitData.productTermParas.length < 0
      ) {
        return false;
      }
      return this.submitData.productTermParas[0].defaultValue === "A15";
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
.modal-inner /deep/ .el-input__inner {
  width: 200px !important;
}
.modal-inner .left {
  width: 300px !important;
  border-right: solid #ddd 1px;
}
.modal-inner .form-item-label {
  display: inline-block;
  margin-right: 20px;
  width: 100px;
  .el-input--small {
    width: 200px !important;
  }
}
.modal-inner .right {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.zl-input__required {
  display: inline-block;
  width: 130px;
}
.zl-select {
  width: 100px;
  /deep/ .el-input__inner {
    width: 100px !important;
  }
}
</style>