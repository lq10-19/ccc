<template>
  <div>
    <el-dialog
      :title="isModalEdit?'编辑':'新增'"
      :visible.sync="isShowModal"
      :before-close="modalClose"
      :fullscreen="fullscreen"
      width="500px"
    >
      <div class="modal-inner">
        <el-form ref="form">
          <el-form-item label="期数" required  >
            <el-input v-model.trim="submitData.itemNo" :disabled="isModalEdit"></el-input>
          </el-form-item>

          <el-form-item label="状态" required >
            <el-select v-model.trim="submitData.isInUse">
              <el-option
                v-for="(item,index) in statusArr"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
  
        <el-button type="primary" v-if="!isModalEdit" @click="submit">确 定</el-button>
        <el-button type="primary" v-else @click="save">保 存</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../bus";
import { addProductLimitList, editProductLimitList } from "@/axios/api";
import {isInt} from "@/lib/util"
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
    formData:{
      type:Object,
      default:{}
    }
  },
  data() {
    return {
      fullscreen:false,
      submitData: {
        itemNo: "",
        isInUse: "1"
      },
      statusArr: [{ name: "启用", value: "1" }, { name: "停用", value: "0" }]
    };
  },

  mounted() {},

  watch: {
    formData: {
      handler(newV) {
        this.submitData = newV;
      },
      deep: true
    }
  },

  methods: {
    submit() {
      if(!this.submitData.itemNo) {
        return this.$message.error("期数不能为空");
        ;
      } else if(!this.submitData.isInUse) {
        return this.$message.error("请选择状态")
      } else if(!isInt(this.submitData.itemNo)) {
        return this.$message.error("期数只能为整数")
      }
      addProductLimitList(this.submitData).then(res => {
        this.modalClose();
      });
    },
    save() {
      editProductLimitList(this.submitData)
        .then(res => {
          this.$message.success("修改成功");
          this.modalClose();
        });
    },
    modalClose() {
      this.resetObj(this.submitData)
      bus.$emit("fee_setting:isShowModal", false); // 直接修改父组件的属性
      bus.$emit("fee_setting:isModalEdit", false);
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