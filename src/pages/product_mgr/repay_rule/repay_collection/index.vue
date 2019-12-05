<template>
  <div class="container">
    <el-button type="primary" v-has @click="add">新增</el-button>
    <div class="rule-list">
      <div class="rule-list-item" v-for="(item, index) in ruleList" :key="index">
        <div class="rule-list-hint"></div>
        <div class="rule-list-title">规则{{index+1}}</div>
        <div class="btn-save" @click="save(index)">
          <el-button type="primary" v-has>保存</el-button>
        </div>
        <el-form :inline="true" label-position="left" label-width="150px" class="form">
          <el-form-item label="规则编号" required>
            <el-input v-model.trim="item[0].ruleValue" disabled></el-input>
          </el-form-item>
          <el-form-item label="计算规则" required>
            <span>逾期</span>
            <!-- <el-input v-model.trim="item[1].ruleValue"></el-input> -->
            <input class="zl-input" v-model.trim="item[1].ruleValue" />
            <span>天以内,每天收取</span>
            <!-- <el-input v-model.trim="item[2].ruleValue"></el-input> -->
            <input class="zl-input" v-model.trim="item[2].ruleValue" />
            <span>元</span>
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
    debounce
  } from "@/lib/util";
  const RULE_ITEM = [{
      ruleCode: "CCR",
      ruleIndex: "0",
      ruleName: "规则编号",
      ruleProperty: "ruleNum",
      ruleValue: ""
    },
    {
      ruleCode: "CCR",
      ruleIndex: "1",
      ruleName: "逾期天数",
      ruleProperty: "overdueIn",
      ruleValue: ""
    },
    {
      ruleCode: "CCR",
      ruleIndex: "2",
      ruleName: "逾期费用",
      ruleProperty: "chargeAmount",
      ruleValue: ""
    },
  ];
  export default {
    name: 'repay_collection',
    data() {
      return {
        ruleMap: RULE_MAP,
        ruleList: [
          RULE_ITEM
        ]
      };
    },

    mounted() {
      this.getDataList();
    },

    methods: {
      addComfirm() {
        this.ruleList.push(JSON.parse(JSON.stringify(RULE_ITEM)));
        this.ruleList.forEach((item, index) => {
          item[0].ruleValue = "C" + this.addPreZero(index + 1)
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
          this.$message.success("保存成功")
          this.getDataList();
        });
      },
      getDataList() {
        let vm = this;
        getRepayList("CCR")
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
    width: 100%;

    .el-input {
      width: 200px;
    }
  }

  .zl-input {
    width: 100px;
  }

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