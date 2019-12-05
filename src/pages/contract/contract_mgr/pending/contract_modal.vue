<template>
  <div>
    <el-dialog title="退回银行卡" :visible.sync="isShowModal" :before-close="modalClose" width="680px">
      <el-form :model='ruleForm' style="padding: 0 20px" :rules="rules" ref="ruleForm" label-width="100px"
        label-position="left">

        <el-form-item label="退回原因" prop="bankCardChangeType">
          <el-select v-model.trim="ruleForm.bankCardChangeType" @change='changehanle' placeholder="请选择原因">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" v-if='isShow' prop='bankCardChangeDetailed'>
          <el-input type="textarea" placeholder="字数限制20字以内" v-model.trim='ruleForm.bankCardChangeDetailed'></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "./bus";
  import {
    addBankCardBackLog
  } from "@/axios/api";

  let options = [{
      value: '01',
      label: '二类卡无法放款'
    },
    {
      value: '02',
      label: '银行卡支行有误'
    },
    {
      value: '03',
      label: '其他'
    },
  ]

  export default {

    props: {
      isShowModal: {
        type: Boolean,
        default: false
      },
      selection: {
        type: Object,
        default: {}
      },
    },

    data() {
      return {
        options,
        isShow: false,
        ruleForm: {
          bankCardChangeType: null,
          bankCardChangeDetailed: null
        },
        rules: {
          bankCardChangeType: [{
            required: true,
            message: '请选择退回变卡原因',
            trigger: 'blur'
          }],
          bankCardChangeDetailed: [{
              required: true,
              message: '请输入备注',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '字数限制20字以内',
              trigger: 'blur'
            }
          ]
        }
      };
    },

    mounted() {},

    watch: {},

    methods: {
      //新增提交
      submit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.selection, this.ruleForm)
            addBankCardBackLog(params).then(res => {
              this.$message.success("提交成功");
              this.modalClose()
              this.$parent.getDataList()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      changehanle(resValue) {
        if (resValue == '03') {
          this.isShow = true;
        } else {
          this.isShow = false;
          this.ruleForm.bankCardChangeDetailed = null;
        }
      },
      modalClose() {
        this.$refs.ruleForm.resetFields();
        bus.$emit("contract_ideai", false); // 直接修改父组件的属性
      }
    }
  };
</script>