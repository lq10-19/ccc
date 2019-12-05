<template>
  <div class="tab-item">
    <el-button type="primary" plain @click="save">保存</el-button>
    <div class="product-level">
      <el-form class="form" :model="submitData" :rules="rules">
        <el-form-item label="产品档位" prop="grade" >
          <el-select v-model.trim="submitData.grade" placeholder="请选择" disabled>
            <el-option 
            v-for="(item, index) in gradeList" 
            :key="index"
            :label="item.itemName"
            :value="item.itemNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="loan-count">
          <el-form-item label="贷款金额" required >
            <el-input  @change="decimalLow" @input="limitIntLow" v-model.trim="submitData.lowPrincipal"></el-input>-
            <el-input @change="decimalHigh" @input="limitIntTall" v-model.trim="submitData.tallPrincipal"></el-input> 元
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script>
import { prodGradeUpate, getProductTermList } from "@/axios/api";
import { isPosNumber,decimalFilter2} from "@/lib/util";
export default {
  props: ["paramsSetting"],
  data() {
    return {
      paramObj: {
        pageSize: 10,
        currentPage: 1,
        paramObj: {
          termType: "FEE"
        }
      },
      submitData: {
        grade: "",
        lowPrincipal: "",
        tallPrincipal: ""
      },
      rules: {
        grade: [{ required: true, message: "请输入产品档位", trigger: "blur" }],
        lowPrincipal: [
          { required: true, message: "请输入贷款金额起始值", trigger: "blur" }
        ]
      },
      gradeList:[]//档位列表
    };
  },
  mounted() {
    getProductTermList(this.paramObj).then(res => {});
  },
  watch: {
    paramsSetting: {
      handler(newV) {
        this.submitData = newV;
        this.init()
      },
      deep: true
    }
  },
  methods: {
    getDataList() {

    },
    
    //保留小数
    decimalLow(val) {
      
      if(Number.isNaN(parseFloat(val))) {
        this.submitData.lowPrincipal = "";
      } else {
         this.submitData.lowPrincipal = parseFloat(val).toFixed(2);
      }
      
    },
    decimalHigh(val) {
      if(Number.isNaN(parseFloat(val))) {
        this.submitData.tallPrincipal = "";
      } else {
      this.submitData.tallPrincipal = parseFloat(val).toFixed(2);
      }
      
    },
    //限制正数位数
    limitIntLow(val){
      if(val>99999999.99){
        this.submitData.lowPrincipal = 99999999.99;
      } else {
        this.submitData.lowPrincipal =val;
      }
    },
    limitIntTall(val){
      if(val>99999999.99){
        this.submitData.tallPrincipal = 99999999.99;
      } else {
        this.submitData.tallPrincipal =val;
      }
    },
    init() {
      this.getSelect("ProductGrade").then(res=>{
        this.gradeList = res.data;
        console.log(res.data)
      })
    },
    save() {
      if(!this.submitData.lowPrincipal || !this.submitData.tallPrincipal) {
        return this.$message.warning("贷款金额不能为空");
      } else if(!isPosNumber(this.submitData.lowPrincipal) || 
      isPosNumber(!this.submitData.tallPrincipal)) {
        return this.$message.error("请输入正确的贷款金额")
      } else if(this.submitData.lowPrincipal*1 > this.submitData.tallPrincipal*1) {
        return this.$message.error("贷款金额范围错误")
      }
      prodGradeUpate(this.submitData).then(res => {
        this.$message.success("保存成功");
      });
    }
  }
};
</script>


<style scoped lang="scss">
.tab-item {
  margin-left: 20px;
  .product-level {
    position: relative;
    width: 80%;
    margin-top: 20px;
    min-height: 200px;
    border: solid #bbb 1px;
    &::before {
      position: absolute;
      content: "档位信息";
      left: 20px;
      transform: translateY(-50%);
      background: white;
      padding: 0 10px;
      color: #101010;
      font-weight: 700;
    }
    .form {
      margin: 20px;
    }
 
  }
}
</style>