<template>
  <div>
    <el-dialog title="新增" :visible.sync="isShowModal" :before-close="modalClose"    width="500px">
            <div class="modal-inner">
        <el-form ref="form" label-width="150px" :model="submitData" :rules="rules" label-position="left">
          <el-form-item label="业务类型" prop="businessType" ref="form">
           <el-select v-model.trim="submitData.businessType" placeholder="请选择" @change="businessChange">
              <el-option v-for="(item,index) in businessTypeArr" 
              :key="index"
              :label="item.name" 
              :value="item.value"
              
              ></el-option>
       </el-select>
          </el-form-item>
          <el-form-item label="产品大类" prop="productSuperType">
            <el-select v-model.trim="submitData.productSuperType" placeholder="请选择" :disabled="!submitData.businessType?true:false">
              <el-option v-for="(item,index) in productTypeList" 
              :key="index"
              :label="item.typeName" 
              :value="item.typeNo"
              ></el-option>
       </el-select>
          </el-form-item>

          <el-form-item label="产品名称"  prop="productName">
            <el-input maxlength="100" v-model.trim="submitData.productName"></el-input>
          </el-form-item>

          <el-form-item label="生效时间"  prop="effectiveStartDate">
            <el-date-picker
                 v-model.trim="submitData.effectiveStartDate"
                 type="datetime"
                 value-format="yyyy-MM-dd HH:mm:ss"
                 placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="失效时间"  prop="effectiveEndDate">
            <el-date-picker
                 v-model.trim="submitData.effectiveEndDate"
                 type="datetime"
                 value-format="yyyy-MM-dd HH:mm:ss"
                 placeholder="选择日期时间">
            </el-date-picker>
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
import {addProductSetting,getProductTypeList} from "@/axios/api";
import {checkDateTime} from "@/lib/util";
export default {

  props: {
    isShowModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules:{
         productSuperType:[
          { required: true, message: '请输入产品大类', trigger: 'blur' }
        ],
        businessType:[
           { required: true, message: '请输入业务类型', trigger: 'blur' }
        ],
          productName:[
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        effectiveStartDate:[
          { required: true, message: '请输入产品生效时间', trigger: 'blur' }
        ],
        effectiveEndDate:[
          { required: true, message: '请输入产品失效时间', trigger: 'blur' }
        ]
       
      },
      submitData:{
        effectiveStartDate:"",
        effectiveEndDate:"",
        businessType:'',//产品类型
        productName:'', 
        productSuperType:"",
        status:'1' //状态
      },
      productTypeList:[], //产品大类选项
      businessTypeArr:[{ name: "现金贷", value: "01" }, { name: "消费贷", value: "02" }],
      creditTypeArr: [{ name: "循环授信", value: "01" }, { name: "一次授信", value: "02" }],
      statusArr: [{ name: "启用", value: "1" }, { name: "停用", value: "0" }],
    };
  },


 watch: {
   
  },
  mounted() {
       
       },
  methods: {
    //提交
    submit() {
      if(!this.checkForm()) {
        return;
      }
      this.$refs.form.validate((validate)=>{
        if(validate) {
          addProductSetting(this.submitData).then(res=>{
        this.modalClose()
      })
        }
      })
      
    },
    
    //表单验证
    checkForm() {
      let start = this.submitData.effectiveStartDate;
      let end = this.submitData.effectiveEndDate;
      if(!checkDateTime(start, end)) {
        return false;
      }
      return true;
    },
    //获取产品大类选项
    getProductTypeList(type) {
      getProductTypeList(type).then(res=>{
        this.productTypeList = res.data;
      })
    },
    //选择业务类型
    businessChange(type) {
      this.submitData.productSuperType = "";
      this.getProductTypeList(type);
    },
    save() {
      editProductCate(this.submitData).then(res=>{
        this.modalClose()
      })
    },
    modalClose() {
      this.resetObj(this.submitData)
      bus.$emit("product_setting:isShowModal", false); // 直接修改父组件的属性
       bus.$emit("product_setting:isModalEdit", false); 
    },

    //清空对象的值
    resetObj(obj) {
      for(let key in obj) {
        if((obj).hasOwnProperty(key)) {
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