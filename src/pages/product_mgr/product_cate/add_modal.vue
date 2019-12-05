<template>
  <div>
    <el-dialog :title="isModalEdit?'编辑':'新增'" :visible.sync="isShowModal" :before-close="modalClose"    width="500px">
            <div class="modal-inner">
        <el-form ref="form" :model="submitData" :rules="rules" label-position="left" label-width="100px">
          <el-form-item  prop="businessType" label="业务类型" >
           <el-select v-model.trim="submitData.businessType"
            placeholder="请选择"
            :disabled = "isModalEdit"
           
            >
              <el-option v-for="(item,index) in businessTypeArr" 
              :key="index"
              :label="item.name" 
              :value="item.value"
              ></el-option>
       </el-select>
          </el-form-item>
          <el-form-item prop="typeName" label="产品大类" >
            <el-input v-model.trim="submitData.typeName" :disabled = "isModalEdit"></el-input>
          </el-form-item>

          <el-form-item prop="creditType" label="授信方式" >
             <el-select v-model.trim="submitData.creditType" placeholder="请选择" :disabled = "isModalEdit">
              <el-option v-for="(item,index) in creditTypeArr" 
              :key="index"
              :label="item.name" 
              :value="item.value"
              ></el-option>
       </el-select>
          </el-form-item>

          <el-form-item prop="status" label="状态" >
            <el-select v-model.trim="submitData.status">
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
        <!-- <el-button @click="modalClose">取 消</el-button> -->
        <el-button type="primary" v-if="!isModalEdit" @click="submit">确 定</el-button>
        <el-button type="primary" v-else @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "../bus";
import {addProductCate,editProductCate} from "@/axios/api";
export default {

  props: {
    isShowModal: {
      type: Boolean,
      default: false
    },
    isModalEdit:{
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
      rules:{
        businessType:[
          { required: true, message: "请输入业务类型", trigger: "blur" }
        ],
        typeName:[
           { required: true, message: "请输入产品大类", trigger: "blur" }
        ],
        creditType:[
          { required: true, message: "请输入授信方式", trigger: "blur" }
        ],
        status:[
          { required: true, message: "请选择状态", trigger: "blur" }
        ]
      },
      submitData:{
        businessType:'',//产品类型
        typeName:'', //产品大类
        creditType:'', //授信方式
        status:'1' //状态
      },
      businessTypeArr:[{ name: "现金贷", value: "01" }, { name: "消费贷", value: "02" }],
      creditTypeArr: [{ name: "循环授信", value: "01" }, { name: "一次性授信", value: "02" }],
       statusArr: [{ name: "启用", value: "1" }, { name: "停用", value: "2" }],
    };
  },


 watch: {
    formData: {
      handler(newV) {
        this.submitData = newV;
      },
      deep: true
    }
  },
  mounted() {
        
       },

  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addProductCate(this.submitData).then(res=>{
        this.$message.success("新增成功")
        this.modalClose();
      })
      .catch(error =>{
        this.$message.error(error.data.msg||"提交失败")
      })
        }
      });
      
    },
    save() {
      editProductCate(this.submitData).then(res=>{
        this.$message.success("编辑成功")
        this.modalClose()
      })
    },
    modalClose() {
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
 .modal-inner /deep/  .el-input__inner{
  width:200px!important;
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