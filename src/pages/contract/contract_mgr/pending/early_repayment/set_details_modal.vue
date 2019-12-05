<template>
  <div>
    <el-dialog title="提前还款申请" :visible.sync="isShowModal" :before-close="modalClose" width="900px">
      <div class="apply-info">
        <el-form label-position="left" label-width="130px" class="form" :rules="rules" ref="ruleForm" :model="form"
          :inline="true">
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请日期" prop='applyDate'>
                <el-date-picker v-model='form.applyDate' placeholder="大于等于系统当前日期" format="yyyy/MM/dd" type="date"
                  value-format='yyyy/MM/dd' @change='changeDate' :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请有效期" required>
                <el-date-picker v-model="form.validityPeriod" type="date" readonly format="yyyy/MM/dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='form.vipHave'>
              <el-form-item label="最高减免比例" required>
                <el-input v-model="form.earlyRepayment" suffix-icon="el-icon-percentage" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show='form.vipHave'>
              <el-form-item label="最高减免金额" required>
                <el-input v-model="form.earlyAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请减免比例" prop='applyEarlyRepayment'>
                <!-- <el-input v-model="form.applyEarlyRepayment" suffix-icon="el-icon-percentage" ></el-input> -->
                <el-input-number v-model="form.applyEarlyRepayment" controls-position="right" :min="0"
                  :max="form.vipHave?form.earlyRepayment:100" @change="handleChange" :controls='false' :precision="6"
                  :step="0.000001">
                </el-input-number>
                <span class="percentage">%</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请减免金额" required>
                <el-input v-model="form.applyEarlyAmt" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请原因" prop='applyReason'>
                <el-select v-model="form.applyReason" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.itemNo" :label="item.itemName" :value="item.itemNo">
                  </el-option>
                </el-select>
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
      <div class="btn_box">
        <el-button type="primary" @click="submitForm('ruleForm')">提交申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "../bus";
  import {
    calculateRepayment,
    commitRepayment
  } from "@/axios/api";
  export default {
    name: 'set_details_modal',
    props: {
      isShowModal: {
        type: Boolean,
        default: false
      },
      serialNo: {
        type: String,
      },

    },
    data() {
      return {
        form: {
          vipHave: null,
          afterN: null,
        },

        // repaymentHandFee      applyEarlyAmt
        titleW: '',
        options: [],
        setlabel: '前N期剩余未还月供',
        rules: {
          applyReason: [{
            required: true,
            message: '请选择申请原因',
            trigger: 'blur'
          }],
          applyEarlyRepayment: [{
            required: true,
            message: '请输入申请减免比例',
            trigger: 'blur'
          }],
          applyDate: [{
            required: true,
            message: '请选择申请日期',
            trigger: 'change'
          }],
        },
        pickerOptions: {
          disabledDate(time) {
            return Date.now() > time.getTime() + 3600 * 1000 * 24;
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        }
      };
    },

    mounted() {
      this.options = this.$store.state.repaymentReasonList;
    },

    watch: {
      isShowModal: function (newValue, bb) {
        // 显示弹框
        if (newValue) {
          // this.getRepaymentInfo()
        }
      }
    },

    methods: {
      //新增提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            commitRepayment(Object.assign({}, this.form)).then(res => {
              this.$message.success('申请成功');
              this.$refs[formName].resetFields();
              this.$parent.handleClose();
              this.$parent.getDataList();
            }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //获取提前还款数据
      getRepaymentInfo() {

        calculateRepayment(
          Object.assign({}, {
            serialNo: this.serialNo,
          }, this.form)).then(res => {
          this.form = res.data;
          this.form.vipHave = +res.data.vipHave;
          this.form.afterN = +res.data.afterN;
          //repaymentHandFee       applyEarlyAmt  vipHave,afterN   有为1 无为0
          this.titleW = `提前还款手续费：${this.form.repaymentHandFee}元  申请减免金额：${this.form.applyEarlyAmt}元 `;
          this.setlabel = res.data.period ? `前${res.data.period}期剩余未还月供` : '前N期剩余未还月供';
        }).catch(err => {
          this.form = {};
        })
      },
      // 
      handleChange(value) {
        console.log(value);
        if (!this.form.applyDate) {
          this.$message.warning('请先选择申请日期')
          return
        }
        this.getRepaymentInfo()
      },
      // 选择申请日期
      changeDate(resvalue) {
        this.getRepaymentInfo()
      },
      modalClose() {
        this.$parent.handleClose();
      }
    }
  };
</script>


<style scoped lang="scss">
  /deep/ .el-input {
    width: 200px !important;
  }

  /deep/ .el-input-number .el-input__inner {
    text-align: left !important;
  }

  .tail-label {
    display: inline-block;
    margin-left: 8px;
  }

  .percentage {
    position: relative;
    left: 46px;
    color: #C0C4CC;
    z-index: 999;
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

    .form {
      margin: 20px;
    }
  }

  .btn_box {
    width: 100%;
    padding-top: 6px;
    text-align: center;
  }
</style>