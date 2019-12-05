<template>
  <div>
    <el-dialog title="申请详情" :visible.sync="isShowModal" :before-close="modalClose" width="900px">
      <div class="apply-info">
        <el-form label-position="left" label-width="130px" class="form" :inline="true" :model="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请日期" required>
                <el-date-picker type="date" v-model="form.applyDate" readonly></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请有效期" required>
                <el-date-picker type="date" v-model="form.validityPeriod" readonly></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高减免比例" v-show='form.vipHave' required>
                <el-input v-model="form.earlyRepayment" suffix-icon="el-icon-percentage" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高减免金额" v-show='form.vipHave' required>
                <el-input v-model="form.earlyAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请减免比例" required>
                <el-input v-model="form.applyEarlyRepayment" suffix-icon="el-icon-percentage" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请减免金额" required>
                <el-input v-model="form.applyEarlyAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请原因" required>
                <el-input v-model="form.applyReason" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提前还款总金额" required>
                <el-input v-model="form.sumAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fee-info">
        <el-form :inline="true" label-position="left" label-width="135px" class="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="催收工本费" required>
                <el-input v-model="form.collectionCost" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="罚息/违约金费用" label-width="180px" required>
                <el-input v-model="form.breakAmount" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提前还款费用" required class="i-box">
                <!-- <div class="div" data-title="hello, world">hello...</div> -->
                <i class="el-icon-warning-outline div" :data-title="titleW"></i>
                <el-input v-model="form.repaymentFee" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='!form.afterN'>
              <el-form-item label="其他分期收取费用(当月)" label-width="180px" required>
                <el-input v-model="form.otherMonthFee" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='!form.afterN'>
              <el-form-item label="至结清日管理费" required>
                <el-input v-model="form.manageFee" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='!form.afterN'>
              <el-form-item label="至结清日利息" label-width="180px" required>
                <el-input v-model="form.interest" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='form.afterN'>
              <el-form-item :label="setlabel" label-width="180px" required>
                <el-input v-model="form.lastMonthAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 如果是前N期则取lastNPrincipal，N期后取lastPrincipal -->
              <el-form-item label="剩余未还本金" required>
                <el-input v-model="form.afterN?form.lastNPrincipal: form.lastPrincipal" suffix-icon="el-icon-rmb"
                  readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='!form.afterN'>
              <el-form-item label="逾期月供总金额" label-width="180px" required>
                <el-input v-model="form.overdueSumMonthAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    queryRepaymentInfo
  } from "@/axios/api";
  export default {

    props: {
      isShowModal: {
        type: Boolean,
        default: false
      },
      acctTransactionNo: {
        type: String,
        // required: true
      }
    },
    data() {
      return {
        form: {},
        titleW: '',
        setlabel: '前N期剩余未还月供',
      };
    },
    watch: {
      isShowModal: function (newValue, bb) {
        // 显示弹框
        if (newValue) {
          this.getRepaymentInfo()
        }
      }
    },

    methods: {
      //获取详情
      getRepaymentInfo() {
        queryRepaymentInfo({
          acctTransactionNo: this.acctTransactionNo,
        }).then(res => {
          this.form = res.data || {};
          this.form.vipHave = +res.data.vipHave;
          this.form.afterN = +res.data.afterN;
          //repaymentHandFee       applyEarlyAmt
          this.titleW = `提前还款手续费：${this.form.repaymentHandFee}元  申请减免金额：${this.form.applyEarlyAmt}元 `;
          this.setlabel = res.data.period ? `前${res.data.period}期剩余未还月供` : '前N期剩余未还月供';
        }).finally(value => {})
      },
      modalClose() {
        this.form = {}
        this.$parent.SeeDetails();
      }
    }
  };
</script>


<style scoped lang="scss">
  /deep/ .el-input {
    width: 200px !important;
  }


  .tail-label {
    display: inline-block;
    margin-left: 8px;
  }

  .i-box {
    position: relative;
  }

  .div {
    position: absolute;
    left: -40px;
    top: 10px;
    color: rgb(19, 111, 185);
  }

  .div:hover::after {
    content: attr(data-title);
    /* //取到data-title属性的值 */
    display: inline-block;
    white-space: nowrap;
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    position: absolute;
    background: rgb(231, 226, 226);
    top: -36px;
    left: -30px;
  }

  .apply-info {
    border: solid #bbb 1px;
    min-height: 100px;
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      left: 20px;
      color: #101010;
      font-weight: 700;
      content: "申请信息";
      padding: 10px;
      background: white;
      transform: translateY(-50%);
    }

    .form {
      margin: 20px;
    }
  }

  .fee-info {
    margin-top: 20px;
    border: solid #bbb 1px;
    min-height: 100px;
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      left: 20px;
      color: #101010;
      font-weight: 700;
      content: "费用组成部分";
      padding: 10px;
      background: white;
      transform: translateY(-50%);
    }

    ;

    .form {
      margin: 20px;
    }
  }
</style>