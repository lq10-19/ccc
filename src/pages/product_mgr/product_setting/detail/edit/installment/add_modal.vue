<template>
  <div>
    <el-dialog
      title="新增"
      :visible.sync="isShowModal"
      :before-close="modalClose"
      :close-on-click-modal="false"
      append-to-body
      width="450px"
    >
      <div class="modal-inner">
        <el-form label-position="left" :inline="true">
          <el-form-item label="期数" required>
            <el-select v-model.trim="submitData.term">
              <el-option
                v-for="(item,index) in termList"
                :key="index"
                :label="item.itemName"
                :value="item.itemNo"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" required>
            <el-select v-model.trim="submitData.status">
              <el-option
                v-for="(item,index) in statusArr"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="EIR/年" required>
            <el-input-number
              placeholder
              v-model.trim="submitData.eir"
              :step="6"
              :precision="6"
              :controls="false"
            ></el-input-number>%
          </el-form-item>

          <el-form-item
            v-for="(items, idx) in this.submitData.productTermFees"
            :key="idx"
            :label="items.termName"
            required
          >
            <template v-if="items.eleType === 1">
              <input
                class="zl-input input-with-select"
                @input="onInput(items)"
                placeholder="请输入内容"
                v-model.number="items.termAmount"
              />
              元
            </template>
            <template v-else>
              <el-input-number
                placeholder="请输入"
                v-model.trim="items.termRate"
                class="input-with-select"
                :step="6"
                :precision="6"
                :controls="false"
              ></el-input-number>%
              <select class="zl-select" v-model.trim="items.termRateType">
                <option
                  v-for="(item,index) in FeeRateTypeList"
                  :label="item.itemName"
                  :value="item.itemNo"
                  :key="index"
                ></option>
              </select>
            </template>
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
import {
  productTermToAdd,
  productTermSave,
  queryTermDropDow,
  getProductTermList
} from "@/axios/api";
import { isPosNumber } from "@/lib/util";

export default {
  props: {
    isShowModal: {
      type: Boolean,
      default: false
    },
    objectNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      feeItem: {
        objectNo: this.objectNo,
        objectType: "",
        termAmount: "",
        termIdLibrary: "",
        termRate: "",
        termRateType: "",
        termFeeName: ""
      },
      submitData: {
        eir: 0, //EIR/年
        gradeId: this.$store.state.selectedGradeId,
        productId: this.$store.state.selectedProductId,
        productTermFees: [],
        term: "", //期数
        status: "1",
        versionId: this.objectNo.split("-")[1]
      },
      termList: [], //期数列表
      statusArr: [{ name: "启用", value: "1" }, { name: "停用", value: "0" }],
      productTermToAddList: [],
      FeeRateTypeList: [],
      productTermList: []
    };
  },
  watch: {
    objectNo: function() {
      this.getData();
      this.queryTermDropDow();
    }
  },
  mounted() {
    this.getData();
    this.getSelect("FeeRateType").then(res => {
      this.FeeRateTypeList = res.data;
    });
    this.queryTermDropDow();
  },

  methods: {
    getData() {
      this.getProductTermList().then(() => {
        const productTermList = this.productTermList;
        productTermList.forEach(item => {
          if (item.termName === "管理费") {
            return;
          }
          if (item.productTermParas[1].defaultValue == "0") {
            return;
          }
          const temp = Object.assign({}, item);
          temp.eleType = this.judgeType(item);
          temp.feeTermName = temp.termName;
          temp.termIdLibrary = item.termId;
          delete temp.productTermParas;
          this.submitData.productTermFees.push(temp);
        });
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
    onInput(item) {
      let temp = item.termAmount;
      temp = parseFloat(item.termAmount);
      if (isNaN(temp)) {
        item.termAmount = 0;
      } else {
        item.termAmount = temp.toFixed(2);
      }
    },

    //表单验证
    formCheck() {
      if (!this.submitData.term) {
        this.$message.error("请选择还款期数");
        return false;
      } else if (!this.submitData.status) {
        this.$message.error("请选择状态");
        return false;
      } else if (!this.submitData.eir) {
        this.$message.error("请输入EIR");
        return false;
      }
      let length = this.submitData.productTermFees.length;
      let productTermFees = this.submitData.productTermFees;
      for (let i = 0; i < length; i++) {
        const item = productTermFees[i];
        if (item.eleType === 1) {
          if (!isPosNumber(item.termAmount)) {
            this.$message.error(`请输入${item.termName}`);
            return false;
          }
        } else {
          if (!isPosNumber(item.termRate)) {
            this.$message.error(`请输入${item.termName}`);
            return false;
          }
          if (!item.termRateType) {
            this.$message.error(`请选择${item.termName}费率类型`);
            return false;
          }
        }
      }
      return true;
    },
    submit() {
      if (!this.formCheck()) {
        return;
      }
      productTermSave(this.submitData).then(res => {
        this.$message.success(`保存成功`);
        this.modalClose();
      });
    },
    queryTermDropDow() {
      queryTermDropDow({
        gradeId: this.$store.state.selectedGradeId,
        type: "1"
      }).then(res => {
        this.termList = res.data;
      });
    },
    modalClose() {
      bus.$emit("fee_setting:isShowModal", false); // 直接修改父组件的属性
    },
    judgeType(item) {
      if (!item) {
        return;
      }
      if (item.productTermParas[4].defaultValue == "02") {
        //计算方式固定金额
        return 1;
      }
      if (
        item.productTermParas[4].defaultValue == "01" ||
        item.productTermParas[4].defaultValue == "03"
      ) {
        //贷款金额*费率 or 月息费-月利息
        return 2;
      }
    }
  }
};
</script>


<style scoped lang="scss">
/deep/ .el-form-item__label {
  width: 130px;
}
.modal-inner /deep/ .el-input__inner {
  width: 130px;
}
.modal-inner .left {
  width: 300px;
  border-right: solid #ddd 1px;
}
.zl-input {
  width: 130px;
  box-sizing: border-box;
}
.zl-select {
  width: 100px;
}
.modal-inner .right {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>