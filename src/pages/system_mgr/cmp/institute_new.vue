<template>
  <div>
    <el-dialog title="新增" :visible.sync="isNew" :before-close="modalClose" width="680px">
      <div class="modal-inner">
        <el-form ref="form" style="padding: 0 20px" :rules="rules" :model="formData" label-width="100px"
          label-position='left'>
          <el-form-item label='部门名称' prop='departmentName'>
            <el-input v-model.trim="formData.departmentName"></el-input>
          </el-form-item>
          <el-form-item label='上级机构' prop='higherLevelDepartmentId'>
            <el-cascader v-model.trim="formData.higherLevelDepartmentId" @change="handleChange" :props='props'
              :options="mechanismList">
            </el-cascader>
          </el-form-item>

          <el-form-item label='机构类型' prop='departmentType'>
            <el-select v-model.trim="formData.departmentType" placeholder="机构类型">
              <el-option label="公司" value="公司"></el-option>
              <el-option label="部门" value="部门"></el-option>
              <el-option label="合作商" value="合作商"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label='排序号' prop='sort'>
            <el-input v-model.trim="formData.sort"></el-input>
          </el-form-item>

          <el-form-item label='机构负责人' prop='departmentHead'>
            <el-input v-model.trim="formData.departmentHead"></el-input>
          </el-form-item>


          <el-form-item label='机构状态' prop='state'>
            <el-radio-group v-model.trim="formData.state">
              <el-radio label="0">启用</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
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
  import bus from "../bus";
  import {
    addDepartment,
    getDepartmentInfo
  } from "@/axios/api"
  export default {
    props: {
      isNew: {
        type: Boolean,
        default: false
      },
      mechanismList: {
        type: Array,
        default: []
      },
    },
    data() {
      return {
        formData: {
          departmentName: "",
          higherLevelDepartmentId: "",
          departmentType: "",
          sort: "",
          departmentHead: "",
          state: "",
        },
        departmentArr: [],
        props: {
          value: 'departmentId',
          label: 'departmentName',
          checkStrictly: true
        },
        rules: {
          departmentName: [{
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }],
          higherLevelDepartmentId: [{
            required: true,
            message: '请选择上级机构',
            trigger: 'blur'
          }],
          departmentType: [{
            required: true,
            message: '请选择机构类型',
            trigger: 'blur'
          }],
          state: [{
            required: true,
            message: '请选择机构状态',
            trigger: 'blur'
          }],
        }
      };
    },
    mounted() {
      getDepartmentInfo().then(res => {
        this.departmentArr = res.data;
      })
    },

    methods: {
      modalClose() {
        this.$refs.form.resetFields();
        bus.$emit("institute:isNew", false); // 直接修改父组件的属性
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.formData)
            params.higherLevelDepartmentId = Array.isArray(params.higherLevelDepartmentId) ? params
              .higherLevelDepartmentId
              .pop() : params.higherLevelDepartmentId;

            addDepartment(params).then(res => {
              this.$message.success(`新增成功`);
              this.$parent.getDataList()
              this.modalClose()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleChange(data) {
        console.log(data)
      }
    }
  };
</script>


<style scoped lang="scss">
  .modal-inner {
    width: 460px ;
  }

  /deep/ .el-input__inner {
    width: 320px !important;
  }
</style>