<template>
  <div>
    <el-dialog title="变更信息" :visible.sync="isShowModal" :before-close="modalClose" width="500px">

      <el-form :model='submitData' ref='ruleForm' :rules='rules' class="form" label-width='100px'>

        <el-form-item label="旧手机号码">
          <el-input v-model.trim='oldPhone' disabled></el-input>
        </el-form-item>

        <el-form-item label="新手机号码" prop='mobileTelePhone'>
          <el-input v-model.trim='submitData.mobileTelePhone'></el-input>
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
    updateCustomerData
  } from "@/axios/api";


  const checkPhone = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入新手机号码'));
    } else {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      console.log(reg.test(value));
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确的手机号码'));
      }
    }
  }


  export default {

    props: {
      isShowModal: {
        type: Boolean,
        default: false
      },
      mobileTelePhone: {
        type: String,
      },
      customerId: {
        type: String,
      },

    },
    created() {

    },
    computed: {
      oldPhone() {
        return this.mobileTelePhone
      }
    },
    data() {
      return {
        submitData: {
          oldPhone: "",
          mobileTelePhone: "",
        },
        rules: {
          mobileTelePhone: [{
            validator: checkPhone,
            required: true,
            trigger: 'blur'
          }]
        }
      };
    },

    mounted() {

    },

    watch: {
      formData: {
        handler(newV) {
          console.log(newV)
          this.submitData = newV;
        },
        deep: true
      }
    },

    methods: {
      //新增提交
      submit() {

        const _this = this;

        this.$refs.ruleForm.validate((valid) => {
          if (valid) {

            let params = {
              customerId: this.customerId,
              mobileTelePhone: this.submitData.mobileTelePhone
            }

            updateCustomerData(params).then(res => {
              if (res.code == '200') {
                _this.$message.success('更改成功')
                _this.$refs.ruleForm.resetFields();
                _this.$parent.getDataList()
                _this.modalClose()
              } else {
                _this.$message.error(res.msg || '失败')
              }
            }).catch(error => {
              console.log(error)
            }).finally(value => {
              console.log(value)
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //编辑保存
      save() {
        editBasicFee(this.submitData).then(res => {
          this.modalClose()
        })
      },
      modalClose() {
        bus.$emit("showInfo", false); // 直接修改父组件的属性
      }
    }
  };
</script>


<style scoped lang="scss">


</style>