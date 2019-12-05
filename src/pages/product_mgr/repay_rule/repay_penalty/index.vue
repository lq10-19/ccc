<template>
  <div class="container">
    <el-button type="primary" v-has @click="add">新增</el-button>
    <div class="rule-list">
      <div class="rule-list-item" v-for="(item, index) in ruleList" :key="index">
        <div class="rule-list-hint"></div>
        <div class="rule-list-title">规则{{index+1}}</div>
        <div class="btn-save">
          <el-button type="primary" v-has @click="save(index)">保存</el-button>
          <el-button type="primary" v-has @click="adds(item,index)">添加</el-button>
        </div>

        <el-form :inline="true" label-position="right" label-width="150px" class="form">
          <el-form-item v-for="(value, indexs) in item" :key="indexs" :label="value.ruleName" required>
            <template v-if="value.ruleProperty==='countBase'">
              <div style="width:600px">
                <el-select v-model.trim="value.ruleValue" placeholder="请选择">
                  <el-option v-for="(item,index) in CalculationBaseList" :key="index" :label="item.itemName"
                    :value="item.itemNo"></el-option>
                </el-select>
              </div>

            </template>
            <template v-else-if="value.ruleProperty=='ruleNum'">
              <div style="width:600px">
                <el-input disabled v-model.trim="value.ruleValue"></el-input>
              </div>
            </template>

            <template v-else>
              <el-input-number v-if="indexs%2===0" v-model.trim="value.ruleValue" :step="0" :precision="0"
                :controls="false"></el-input-number>
              <el-input-number v-else v-model.trim="value.ruleValue" :step="2" :precision="2" :controls="false">
              </el-input-number>
              <template v-if="indexs>1">
                <span v-if="indexs%2===0" style="margin-left: 5px">天</span>
                <template v-else>
                  <span style="margin-left: 5px">元</span>
                  <el-button v-if="indexs>4" @click="deleteRule(index,indexs)" style="margin-left:20px;" type="danger"
                    icon="el-icon-delete" circle></el-button>
                </template>


              </template>

            </template>


          </el-form-item>

          <!-- <el-form-item label="计算基数" class="calc-base">
            <el-select v-model.trim="item[1].ruleValue"></el-select>
          </el-form-item>
          <div class="add-collection"  
              v-for="(val,idx) in item" 
              :key="idx">
            <template v-if="idx>=2">
                <div class="add-plus-icon" @click="addPenalty(index)">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
            <el-form-item label="逾期天数" required>
              <el-input v-model.trim="item.ruleValue"></el-input>
              <span>天</span>
            </el-form-item>
            <el-form-item label="违约金额" required>
              <el-input v-model.trim="item.ruleValue"></el-input>
              <span>元</span>
            </el-form-item>
            </template>
            
          </div>-->
        </el-form>
      </div>
    </div>
  </div>
</template>



<script>
  const RULE_MAP = {
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  const RULE_ITEM = [{
      ruleCode: "LDR",
      ruleIndex: "0",
      ruleName: "规则编号",
      ruleProperty: "ruleNum",
      ruleValue: ""
    },
    {
      ruleCode: "LDR",
      ruleIndex: "1",
      ruleName: "计算基数",
      ruleProperty: "countBase",
      ruleValue: ""
    },
    {
      ruleCode: "LDR",
      ruleIndex: "2",
      ruleName: "逾期天数1",
      ruleProperty: "overdueDay1",
      ruleValue: ""
    },
    {
      ruleCode: "LDR",
      ruleIndex: "3",
      ruleName: "违约金金额1",
      ruleProperty: "breakAmount1",
      ruleValue: ""
    }
  ];
  import {
    getRepayList,
    saveAdvanceRepayList,
    ruleConfigDelete
  } from "@/axios/api";
  import {
    isPosNumber,
    isInt,
    debounce
  } from "@/lib/util";
  export default {
    name: 'repay_penalty',
    data() {
      return {
        ruleMap: RULE_MAP,
        ruleList: [RULE_ITEM],
        CalculationBaseList: [] //计算基数列表
      };
    },

    mounted() {
      this.getDataList();
      this.getSelect("CalculationBase", "02").then(res => {
        this.CalculationBaseList = res.data;
      })
    },

    methods: {
      //新增规则
      addComfirm() {
        this.ruleList.push(JSON.parse(JSON.stringify(RULE_ITEM)));
        this.ruleList.forEach((item, index) => {
          item[0].ruleValue = "W" + this.addPreZero(index + 1)
        });
      },
      //新增
      add() {
        debounce(this.addComfirm, 500)
      },
      adds(item, index) {
        console.log({
          item
        });
        let res = JSON.parse(JSON.stringify(item));
        let aa = Object.assign({}, res[res.length - 2]);
        let bb = Object.assign({}, res[res.length - 1]);
        aa.ruleValue = "";
        bb.ruleValue = "";

        aa.ruleIndex = aa.ruleIndex * 1 + 2;

        let num = parseInt(aa.ruleName.split("").reverse().join("")); //提取数字 

        aa.ruleName = aa.ruleName.replace(/[0-9]/gi, '') + (num + 1);
        aa.ruleProperty = aa.ruleProperty.replace(/[0-9]/gi, '') + (num + 1);



        bb.ruleIndex = bb.ruleIndex * 1 + 2;

        bb.ruleName = bb.ruleName.replace(/[0-9]/gi, '') + (num + 1);
        bb.ruleProperty = bb.ruleProperty.replace(/[0-9]/gi, '') + (num + 1);

        res = [...res, aa, bb];
        this.ruleList.splice(index, 1, res);



      },
      //新增逾期
      addPenalty(index) {
        this.ruleList[index].push({
          ruleCode: "LDR",
          ruleIndex: "3",
          ruleName: "违约金金额1",
          ruleProperty: "breakAmount1",
          ruleValue: ""
        });
      },

      //删除规则
      deleteRule(index, subIndex) {
        this.ruleList[index].splice(subIndex, 1);
        this.ruleList[index].splice(subIndex - 1, 1)
      },

      //表单验证
      formCheck(index) {
        let pass = true;
        this.ruleList[index].some(item => {
          if (!item.ruleValue) {
            this.$message.error(`${item.ruleName}不能为空`);
            pass = false;
            return true;
          } else if (!isPosNumber(item.ruleValue) && item.ruleProperty != "ruleNum") {
            this.$message.error(`${item.ruleName}格式错误`);
            pass = false;
            return true;
          } else if ((item.ruleProperty.indexOf('overdueDay') != -1) && !isInt(item.ruleValue)) {
            pass = false;
            return this.$message.error("逾期天数必须为整数");
          }
        });
        return pass;
      },
      save(index) {
        let ruleItem = this.ruleList[index];
        if (!this.formCheck(index)) {
          return;
        }
        saveAdvanceRepayList(ruleItem).then(res => {
          this.$message.success("保存成功");
          this.getDataList();
        });
      },
      //新增预期记录
      getDataList() {
        getRepayList("LDR")
          .then(res => {
            this.ruleList = res.data;
          })
          .catch(err => {});
      },
      //给1000以内数前面加0
      addPreZero(num) {
        if (num < 10) {
          return "00" + num;
        } else if (num < 100) {
          return "0" + num;
        } else {
          return num;
        }
      }
    }
  };
</script>


<style scoped lang="scss">
  /deep/ .el-input__inner {
    width: 130px !important;
  }

  .form {}

  /deep/ .el-form-item__content {
    display: inline-flex;
  }

  // /deep/ .el-input__inner{
  //   width:200px;
  // }
  .rule-list {
    margin-top: 15px;
    padding-top: 15px;
    border-top: solid #bbb 1px;

    .rule-list-item {
      margin-top: 20px;
      width: 90%;
      border: solid #bbb 1px;
      position: relative;
      border-left: none;

      .rule-list-hint {
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background-color: rgb(108, 172, 244);
      }

      .rule-list-title {
        position: absolute;
        left: 20px;
        background: white;
        padding: 0 10px;
        transform: translateY(-50%);
      }

      .btn-save {
        position: absolute;
        right: 10px;
        bottom: 10px;
      }

      .form {
        margin: 20px;
        margin-bottom: 30px;
      }

      .add-collection {
        position: relative;
        margin-bottom: 50px;
      }

      .add-plus-icon {
        position: absolute;
        top: 10px;
        right: 30px;
        color: #409eff;
        cursor: pointer;
        border-radius: 50%;
      }
    }

    .calc-base /deep/ .el-input__inner {
      padding: 15px;
    }
  }
</style>