<template>
  <div class="container">
    <el-button type="primary" v-has @click="add">新增</el-button>
    <div class="rule-list" v-if="ruleList.length">
      <div class="rule-list-item" v-for="(item, index) in ruleList" :key="index">
        <div class="rule-list-hint"></div>
        <div class="rule-list-title">规则{{index+1}}</div>
        <div class="btn-save" @click="save(index)">
          <el-button type="primary" v-has plain>保存</el-button>
        </div>
        <el-form :inline="true" label-position="left" label-width="150px" class="form">
          <el-form-item label="规则编号" required>
            <el-input disabled v-model.trim="item[0].ruleValue"></el-input>
          </el-form-item>
          <el-form-item label="计算基数" class="calc-base" required>
            <el-select v-model.trim="item[1].ruleValue">
              <el-option v-for="(item,index) in caculationArr" :key="index" :label="item.itemName" :value="item.itemNo">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提前还款比例" required style="display:flex;">
            <el-input-number v-model.trim="item[2].ruleValue" :step="6" :precision="6" :controls="false"
              @focus='focusHandle($event)' @blur='blurHandle($event,1)'>
            </el-input-number><span>
              %
            </span>

          </el-form-item>
          <div style="width:500px;">
            <el-form-item label="提前还款手续费" required>
              <el-input-number class="fee" ref="fee" v-model.trim="item[3].ruleValue" :step="2" :precision="2"
                :controls="false" @input="reypayChange" @focus='focusHandle($event)' @blur='blurHandle($event,2)'>
              </el-input-number><span>元</span>
            </el-form-item>
          </div>

          <el-form-item label="提前还款限制" required>
            <span>前</span>
            <!-- <el-input v-model.trim="item[4].ruleValue"></el-input> -->
            <input class="zl-input" v-model.trim="item[4].ruleValue" />
            <span style="width:200px;">期不支持提前还款</span>
          </el-form-item>
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
  import {
    getRepayList,
    saveAdvanceRepayList
  } from "@/axios/api";
  import {
    isPosNumber,
    isInt,
    decimalFilter2,
    debounce
  } from "@/lib/util";
  const RULE_ITEM = [{
      ruleCode: "ERR",
      ruleIndex: "0",
      ruleName: "规则编号",
      ruleProperty: "ruleNum",
      ruleValue: ""
    },
    {
      ruleCode: "ERR",
      ruleIndex: "1",
      ruleName: "计算基数",
      ruleProperty: "countBase",
      ruleValue: ""
    },
    {
      ruleCode: "ERR",
      ruleIndex: "2",
      ruleName: "提前还款比例",
      ruleProperty: "repaymentRate",
      ruleValue: ""
    },
    {
      ruleCode: "ERR",
      ruleIndex: "3",
      ruleName: "提前还款手续费",
      ruleProperty: "repaymentFee",
      ruleValue: ""
    },
    {
      ruleCode: "ERR",
      ruleIndex: "4",
      ruleName: "提前还款限制",
      ruleProperty: "repaymentLimit",
      ruleValue: ""
    }
  ];
  export default {
    name: 'repay_advance',
    data() {
      return {
        ruleMap: RULE_MAP,
        ruleList: [RULE_ITEM],
        caculationArr: [] //计算基数
      };
    },

    mounted() {
      this.getDataList();
      this.getSelect("CalculationBase", "01").then(res => {
        this.caculationArr = res.data;
      });
    },

    watch: {},

    methods: {


      //新增确认
      addComfirm() {
        console.log('add')
        this.ruleList.push(JSON.parse(JSON.stringify(RULE_ITEM)));
        this.ruleList.forEach((item, index) => {
          item[0].ruleValue = "T" + this.addPreZero(index + 1);
        });
      },
      //新增
      add() {
        debounce(this.addComfirm, 500)
      },
      //表单验证
      formCheck(index) {
        let pass = true;
        this.ruleList[index].some(item => {
          if (!item.ruleValue) {
            this.$message.error(`${item.ruleName}不能为空`);
            pass = false;
            return true;
          } else if (
            !isPosNumber(item.ruleValue) &&
            item.ruleProperty != "ruleNum"
          ) {
            this.$message.error(`${item.ruleName}格式错误`);
            pass = false;
            return true;
          } else if (
            item.ruleProperty.indexOf("overdueDay") != -1 &&
            !isInt(item.ruleProperty)
          ) {
            pass = false;
            return this.$message.error("逾期天数必须为整数");
          } else if (
            item.ruleProperty == "repaymentLimit" &&
            !isInt(item.ruleValue)
          ) {
            pass = false;
            return this.$message.error("提前还款限制必须为整数");
          }
        });
        return pass;
      },
      reypayChange(val) {
        let value = document.querySelector(".fee .el-input__inner");
      },
      focusHandle(res) {
        console.log(res.target.value, 11)
        if (res.target.value == 0) {
          res.target.value = null;
        }
      },
      blurHandle(res, index) {
        if (!res.target.value) {
          if (index == 1) {
            res.target.value = '0.000000';
          } else if (index == 2) {
            res.target.value = '0.00';
          }
        }
      },
      //保存
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
      getDataList() {
        let vm = this;
        getRepayList("ERR")
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
  /deep/ .el-form-item__content {
    display: inline-flex;
  }

  /deep/ .el-input__inner {
    width: 200px;
  }

  /deep/ .el-input--small {
    width: 200px;
  }

  .zl-input {
    width: 40px;
  }

  .rule-list {
    margin-top: 15px;
    padding-top: 15px;
    border-top: solid #bbb 1px;

    .rule-list-item {
      margin-top: 20px;
      width: 700px;
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
        right: 20px;
        bottom: 20px;
      }

      .form {
        margin: 20px;
      }
    }

    .calc-base /deep/ .el-input__inner {
      padding: 15px;
    }
  }
</style>