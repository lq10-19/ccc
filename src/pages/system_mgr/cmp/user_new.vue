<template>
  <div>
    <el-dialog :title="isEditUser?'编辑':'新增'" :visible.sync="isNew" :before-close="modalClose" width="700px">
      <div class="modal-inner">
        <el-row>
          <el-form ref="form" :model='submitData' :rules="rules" inline label-position="left" label-width="90px">
            <el-col :span="12">
              <el-form-item label="用户账号" prop='userLoginAccount'>
                <el-input v-model.trim="submitData.userLoginAccount" :readonly="isEditUser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户姓名" prop='userName'>
                <el-input v-model.trim="submitData.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户类型" prop='userType'>
                <el-select v-model.trim="submitData.userType">
                  <!-- // 用户类型(0:内部员工;1:外部员工) -->
                  <el-option label="内部员工" value="0"></el-option>
                  <el-option label="外部员工" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label='用户状态' prop='userState'>
                <!-- 0:在职;1:离职;2:请假 -->
                <el-select v-model.trim='submitData.userState'>
                  <el-option label="在职" value="0"></el-option>
                  <el-option label="离职" value="1"></el-option>
                  <el-option label="请假" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属机构" prop='departmentId'>
                <el-cascader v-model.trim="submitData.departmentId" @change="handleChange" :show-all-levels="false"
                  :props='props' :options="departmentArr">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label='证件类型' prop='certifiType'>
                <el-select v-model.trim='submitData.certifiType'>
                  <el-option v-for='item in identityList' :key='item.label' :label='item.label' :value='item.value'>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码" prop='certifiNo'>
                <el-input v-model.trim="submitData.certifiNo"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="入职日期" prop='joinDate'>
                <el-date-picker v-model.trim="submitData.joinDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离职日期" prop='leaveDate'>
                <el-date-picker v-model.trim="submitData.leaveDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop='phone'>
                <el-input v-model.trim="submitData.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户邮箱" prop='email'>
                <el-input v-model.trim="submitData.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label='上级' prop='leaderName'>
                <el-input v-model.trim='submitData.leaderName'></el-input>
                <el-button @click="showEditHigh">选择</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <edit-modal :isEdit="isEdit"></edit-modal>

      <span slot="footer" class="dialog-footer">

        <el-button type="primary" v-if='isEditUser' @click="submit">确 定</el-button>
        <el-button type="primary" v-else @click="added">提交</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDepartmentInfo,
    editUser,
    addUser
  } from "@/axios/api"
  import bus from "../bus";
  import editModal from "./user_edit_high";
  //   Ent04 营业执照
  // Ind01 居民身份证
  // Ind02 户口簿
  // Ind03 护照
  // Ind04 军官证
  // Ind05 士兵证
  // Ind08 临时身份证
  // Ind12 香港身份证
  // Ind13 澳门身份证
  // Ind14 台湾身份证
  let identityList = [{
      label: '营业执照',
      value: 'Ent04'
    },
    {
      label: '居民身份证',
      value: 'Ind01'
    },
    {
      label: '户口簿',
      value: 'Ind02'
    },
    {
      label: '护照',
      value: 'Ind03'
    },
    {
      label: '军官证',
      value: 'Ind04'
    },
    {
      label: '士兵证',
      value: 'Ind05'
    },
    {
      label: '临时身份证',
      value: 'Ind08'
    },
    {
      label: '香港身份证',
      value: 'Ind12'
    },
    {
      label: '澳门身份证',
      value: 'Ind13'
    },
    {
      label: '台湾身份证',
      value: 'Ind14'
    },
  ]
  export default {
    components: {
      editModal
    },
    props: {
      isNew: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: {}
      },
      isEditUser: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isEdit: false,
        submitData: {
          userLoginAccount: "",
          userName: "",
          leaderId: "", //上级id
          certifiNo: "", //证件号码
          userType: "", //证件类型
          joinDate: "", //入职日期
          leaveDate: "", //离职日期
        },
        identityList,
        leaderInfo: '', //上级信息
        props: {
          value: 'departmentId',
          label: 'departmentName',
          checkStrictly: true
        },
        departmentArr: [],
        rules: {
          userLoginAccount: [{
            required: true,
            message: '请输入用户账号',
            trigger: 'blur'
          }],
          userName: [{
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          }],
          userType: [{
            required: true,
            message: '请选择用户类型',
            trigger: 'blur'
          }],
          userState: [{
            required: true,
            message: '请选择用户状态',
            trigger: 'blur'
          }],
          departmentId: [{
            required: true,
            message: '请选择所属机构',
            trigger: 'blur'
          }],
        }
      };
    },

    watch: {
      formData: {
        handler(newV) {
          console.log(newV.departmentId, 111)
          this.submitData = newV;
          this.submitData.leaderName = newV.leaderId;
        }
      },
      deep: true,
      immediate: true
    },

    mounted() {
      bus.$on('user:isEdit.high', (val) => {
        this.isEdit = val;
      })
      //选择上级
      bus.$on("user:isEdit.leaderId", val => {
        console.log(val, 1)
        this.submitData.leaderName = val.userName;
        this.submitData.leaderId = val.userId;
      });
    },
    created() {
      getDepartmentInfo({
        'departmentId': '2019081409300528226'
      }).then(res => {
        this.departmentArr = res.data;
      });
    },
    methods: {
      // 修改
      submit() {


        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.submitData)
            if (Array.isArray(params.departmentId)) {
              let info = this.dataProcessing(params.departmentId);
              params.departmentId = info.departmentId;
              params.departmentName = info.departmentName;
            }
            editUser(params).then(res => {
              this.$message.success("提交成功");
              this.modalClose()
              this.$parent.getDataList()
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      // 新增
      added() {

        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.submitData)
            
            if (Array.isArray(params.departmentId)) {
              let info = this.dataProcessing(params.departmentId);
              params.departmentId = info.departmentId;
              params.departmentName = info.departmentName;
            }

            addUser(params).then(res => {
              this.$message.success("提交成功");
              this.modalClose()
              this.$parent.getDataList()
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      //选择上级
      showEditHigh() {
        this.isEdit = !this.isEdit;
      },
      modalClose() {
        this.$refs.form.resetFields();
        bus.$emit("user:isNew", false); // 直接修改父组件的属性
        bus.$emit("user:isEditUser", false)
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      dataProcessing(resArray) {
        // 后面优化
        let info = this.departmentArr.find(item => {
          return item.departmentId == resArray[0]
        })
        if (resArray.length > 1) {
          info = info.children.find(item => {
            return item.departmentId == resArray[1]
          })
        }
        if (resArray.length > 2) {
          info = info.children.find(item => {
            return item.departmentId == resArray[2]
          })
        }
        return info
      },
      handleChange(data) {
        console.log(data, 44)
        // if (data && data.length > 0) {
        //   this.submitData.departmentId = data[data.length - 1]
        // } else {
        //   this.submitData.departmentId = ''
        // }
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

  .last-form-item /deep/ .el-input__inner {
    width: 155px !important;
  }

  .modal-inner {
    .form-row {
      display: flex;
      margin-bottom: 10px;

      .form-item {
        flex: 1;
        display: flex;
        align-items: center;
        margin-right: 5px;

        .form-item-label {
          display: inline-block;
          width: 100px;
        }

      }
    }
  }
</style>