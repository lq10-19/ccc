<template>
  <div>
    <el-dialog :title="isEdit?'编辑':'新增'" :visible.sync="isNew" :before-close="modalClose" width="680px">
      <div class="modal-inner">
        <el-form style="padding: 0 20px" ref="form" :model="submitData" :rules="rules" :inline="true"
          label-width="130px" label-position="left">
          <el-form-item prop="roleId" label="角色编号">
            <el-input v-model.trim="submitData.roleId" :readonly="isEdit"></el-input>
          </el-form-item>

          <el-form-item prop="roleName" label="角色名称">
            <el-input v-model.trim="submitData.roleName"></el-input>
          </el-form-item>

          <el-form-item prop="roleType" label="角色类型">
            <el-select v-model.trim="submitData.roleType">
              <el-option v-for="(item,index) in roleTypeList" :key="index" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="departmentId" label="所属机构">
            <el-cascader :options="departmentArr" v-model.trim="submitData.departmentId" :props="props"
              :show-all-levels="false"></el-cascader>
            <!-- <el-select v-model.trim="submitData.departmentId">
              <el-option v-for="(item,index) in departmentArr" :key="index" :label="item.departmentName"
                :value="item.departmentId">
              </el-option>
            </el-select> -->
          </el-form-item>

          <el-form-item prop="roleState" label="角色状态">
            <el-select v-model.trim="submitData.roleState">
              <el-option v-for="(item,index) in roleStateList" :key="index" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">

        <el-button type="primary" v-if="!isEdit" @click="submit">确 定</el-button>
        <el-button type="primary" v-else @click="save">保存</el-button>
        <el-button @click="modalClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "../bus";
  import {
    addRole,
    editRole,
    getDepartmentInfo
  } from "@/axios/api"


  const isNum = (rule, value, callback) => {
    const age = /^[0-9]*$/
    if (!age.test(value)) {
      callback(new Error('角色编号为数字'))
    } else {
      callback()
    }
  }
  export default {
    props: {
      isNew: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: false
      }
    },
    data() {
      return {
        props: {
          value: 'departmentId',
          label: 'departmentName',
          checkStrictly: true
        },
        rules: {
          roleId: [{
            required: true,
            message: "请输入角色编号",
            trigger: "blur"
          }, {
            validator: isNum,
            trigger: 'blur'
          }],
          roleName: [{
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }],
          roleType: [{
            required: true,
            message: "请选择角色类型",
            trigger: "blur"
          }],
          departmentId: [{
            required: true,
            message: "请选择所属机构",
            trigger: "blur"
          }],
          roleState: [{
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }],
        },
        //角色类型列表
        roleTypeList: [{
            name: "普通",
            value: "0"
          },
          {
            name: "管理员",
            value: "1"
          },
        ],
        roleStateList: [{
            name: "启用",
            value: "0"
          },
          {
            name: "停用",
            value: "1"
          },
        ],
        departmentArr: [],
        submitData: {
          roleId: "",
          roleName: ""
        }
      };
    },
    mounted() {

    },
    watch: {
      formData: {
        handler(newV, oldV) {
          this.submitData = JSON.parse(JSON.stringify(newV));
          console.log(this.submitData, 11)
        },
        deep: true
      },
      isNew: function (newV, oldV) {
        if (newV) {
          this.getDepartmentInfo()
        }
      }
    },

    methods: {
      // 新增
      submit() {
        this.$refs.form.validate(validate => {
          if (validate) {

            let info = this.dataProcessing(this.submitData.departmentId);
            let params = Object.assign({}, this.submitData);
            params.departmentId = info.departmentId;
            params.departmentName = info.departmentName;

            addRole(params).then(res => {
              this.$message.success("提交成功");
              this.modalClose()
              this.$parent.getDataList()
            })
          }
        })
      },
      getDepartmentInfo() {
        getDepartmentInfo({
          'departmentId': '2019081409300528226'
        }).then(res => {
          this.departmentArr = res.data;
          console.log(this.departmentArr, 1)
        });
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
      // 保存
      save() {
        this.$refs.form.validate(validate => {
          if (validate) {
            let params = Object.assign({}, this.submitData)
            if (Array.isArray(params.departmentId)) {
              let info = this.dataProcessing(params.departmentId);
              params.departmentId = info.departmentId;
              params.departmentName = info.departmentName;
            }
            editRole(params).then(res => {
              this.$message.success("修改成功");
              this.modalClose()
              this.$parent.getDataList()
            })
          }
        })
      },
      modalClose() {
        bus.$emit("role:isNew", false); // 直接修改父组件的属性
        bus.$emit("role:isEdit", false); // 直接修改父组件的属性
        this.$refs.form.resetFields();
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      }
    }
  };
</script>


<style scoped lang="scss">
  .el-input {
    width: auto;
  }


  /deep/ .el-input__inner {
    width: 250px !important;
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