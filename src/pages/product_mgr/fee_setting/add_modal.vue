<template>
  <div>
    <el-dialog :title="isModalEdit?'编辑':'新增'" :visible.sync="isShowModal" :before-close="modalClose" width="500px">
      <div class="modal-inner">
        <el-form :model="submitData" :rules="rules" ref="form" label-position="left" label-width="150px">
          <el-form-item prop="feeTermNo" label="费用项ID">
            <el-input v-model.trim="submitData.feeTermNo" placeholder="请输入" :disabled="isModalEdit"></el-input>
          </el-form-item>

          <el-form-item prop="feeTermName" label="费用项名称">
            <el-input v-model.trim="submitData.feeTermName" placeholder="请输入" :disabled="isModalEdit"></el-input>
          </el-form-item>

          <el-form-item prop="status" label="状态">
            <el-select v-model.trim="submitData.status">
              <el-option v-for="(item,index) in statusArr" :key="index" :label="item.name" :value="item.value">
              </el-option>
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
  import {
    addBasicFee,
    editBasicFee
  } from "@/axios/api";
  import {
    isFeeId
  } from "@/lib/util";
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
        statusArr: [{
          name: "启用",
          value: "1"
        }, {
          name: "停用",
          value: "2"
        }],
        submitData: {
          feeTermNo: "",
          feeTermName: "",
          status: "1"
        },
        rules: {
          feeTermNo: [{
            required: true,
            message: "请输入费用项ID",
            trigger: "blur"
          }],
          feeTermName: [{
            required: true,
            message: "请输入费用项名称",
            trigger: "blur"
          }],
          status: [{
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }]
        }
      };
    },

    mounted() {},

    watch: {
      formData: {
        handler(newV) {
          if (this.isModalEdit) {
            this.submitData = newV;
          }
        },
        deep: true
      }
    },

    methods: {
      checkForm() {
        if (!isFeeId(this.submitData.feeTermNo)) {
          return false;
        }
        return true;
      },
      //新增提交
      submit() {
        if (!this.checkForm()) {
          return;
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            addBasicFee(this.submitData).then(res => {
              this.$message.success("新增成功");
              this.modalClose();
            });
          }
        });
      },
      //编辑保存
      save() {
        this.$refs.form.validate(valid => {
          if (valid) {
            editBasicFee(this.submitData).then(res => {
              this.$message.success("编辑成功");
              this.modalClose();
            });
          }
        });
      },
      modalClose() {
        console.log(this.$refs.form);
        this.$refs.form.resetFields();
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