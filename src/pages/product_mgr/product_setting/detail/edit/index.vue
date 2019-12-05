<template>
  <div>
    <el-dialog title="产品设置" :visible.sync="isShowModal" :before-close="modalClose" width="1200px">
      <div class="modal-inner">
        <el-tabs type="card" tab-position="left" height="200px" @tab-click="tabClick">
          <el-tab-pane label="参数设置">
            <params-setting :paramsSetting="paramsSetting" ref="0"></params-setting>
          </el-tab-pane>
          <el-tab-pane label="费用项设置">
            <fee-setting :gradeId="gradeId" :versionId="versionId" ref="1"></fee-setting>
          </el-tab-pane>
          <el-tab-pane label="分期设置">
            <installment-setting :gradeId="gradeId" :versionId="versionId" ref="2"></installment-setting>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../../../bus";
import { addProductCate, editProductCate, prodGradet2Edit } from "@/axios/api";
import ParamsSetting from "./params/index";
import FeeSetting from "./fee/index";
import InstallmentSetting from "./installment/index";
export default {
  props: {
    isShowModal: {
      type: Boolean,
      default: false
    },
    gradeId: { type: String, default: "" },
    versionId: { type: String, default: "" }
  },
  components: {
    ParamsSetting,
    FeeSetting,
    InstallmentSetting
  },
  data() {
    return {
      paramsSetting: {
        grade: "",
        lowPrincipal: "",
        tallPrincipal: ""
      },

      statusArr: [{ name: "启用", value: "1" }, { name: "停用", value: "0" }]
    };
  },

  watch: {
    gradeId: {
      handler(newV) {
        this.getDataList(newV);
      }
    }
  },
  mounted() {},

  methods: {
    tabClick(e) {
      let tabItem = this.$refs[e.index];
      tabItem.getDataList();
    },
    submit() {
      this.modalClose();
    },
    save() {
      editProductCate(this.submitData).then(res => {
        this.modalClose();
      });
    },
    getDataList(gradeId) {
      prodGradet2Edit(gradeId).then(res => {
        this.paramsSetting = res.data;
      });
    },
    modalClose() {
      this.resetObj(this.submitData);
      bus.$emit("product_setting:configEdit", false); // 直接修改父组件的属性
    },

    //清空对象的值
    resetObj(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = "";
        }
      }
    }
  }
};
</script>


<style scoped lang="scss">
.el-input {
  width: auto;
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
</style>