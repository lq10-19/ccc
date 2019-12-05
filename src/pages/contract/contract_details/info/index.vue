<template>
  <div>
    <div class="info">
      <div class="info-title">客户信息</div>
      <div class="info-form-content">
        <div class="content-label">个人信息</div>
        <el-row class="content-detail">
          <el-form :inline="true" label-width="100px" label-position="left" size="mini">
            <el-col :span="8">
              <el-form-item label-width="100px" label="姓名">
                <el-input v-model.trim="rowData.customerName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号码">
                <el-input v-model.trim="rowData.customerCertId" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证有效期">
                <el-input readonly v-model.trim="rowData.limitTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="性别">
                <el-input v-model.trim="rowData.sex" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期">
                <el-input v-model.trim="rowData.birthday" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄">
                <el-input v-model.trim="rowData.age" readonly></el-input>
              </el-form-item><span style="font-size: 12px;color: #606266;line-height: 28px;">岁</span>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="民族">
                <el-input v-model.trim="rowData.nationality" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况">
                <el-input v-model.trim="rowData.marriage" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证地址">
                <el-input v-model.trim="rowData.nativePlace" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="学历">
                <el-input v-model.trim="rowData.eduExperience" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码">
                <el-input v-model.trim="rowData.mobileTelephone" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电子邮箱">
                <el-input v-model.trim="rowData.email" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <div class="info-form-content company-info">
        <div class="content-label">单位信息</div>
        <el-row class="content-detail">
          <el-form :inline="true" label-position="left" size="mini" label-width="100px">
            <el-col :span="8">
              <el-form-item label="公司名称">
                <el-input v-model.trim="rowData.workCorp" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务">
                <el-input v-model.trim="rowData.position" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司电话">
                <el-input v-model.trim="rowData.workTel" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司地址">
                <el-input style="width: 200%;" v-model.trim="rowData.workAddDetail" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <div class="info-form-content">
        <div class="content-label">配偶信息</div>
        <el-row class="content-detail">
          <el-form label-width='95px' :inline="true" label-position="left" size="mini">
            <el-col :span="8">
              <el-form-item label="姓名" label-width="100px">
                <el-input v-model.trim="rowData.spouseName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号码">
                <el-input v-model.trim="rowData.spouseCertId" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码">
                <el-input v-model.trim="rowData.spouseTel" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司名称" label-width="100px">
                <el-input v-model.trim="rowData.spouseWorkCorp" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司地址">
                <el-input style="width: 200%;" v-model.trim="rowData.spouseWorkAddDetail" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <div class="info-form-content">
        <div class="content-label">联系人信息</div>

        <el-form class="content-detail" :inline="true" label-position="left" size="mini" label-width="100px">
          <div style="border-bottom:solid #bbb 1px;">
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名">
                  <el-input v-model.trim="rowData.contactOneName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="关系">
                  <el-input v-model.trim="rowData.contactOneRelationship" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号码">
                  <el-input v-model.trim="rowData.contactOnePhone" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址">
                  <el-input style="width: 200%;" v-model.trim="rowData.contactOneAdd" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div style="margin-top:20px;">
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名">
                  <el-input v-model.trim="rowData.contactTwoName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="关系">
                  <el-input v-model.trim="rowData.contactTwoRelationship" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号码">
                  <el-input v-model.trim="rowData.contactTwoPhone" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址">
                  <el-input style="width: 200%;" v-model.trim="rowData.contactTwoAdd" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>

    <div class="info">
      <div class="info-title">贷款信息</div>
      <div class="info-form-content">
        <div class="content-label">产品信息</div>
        <el-row class="content-detail">
          <el-form :inline="true" label-width="100px" label-position="left" size="mini">
            <el-col :span="9">
              <el-form-item label="业务类型">
                <el-input v-model.trim="rowData.businessType" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="产品大类">
                <el-input v-model.trim="rowData.productSuperType" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="产品名称">
                <el-input v-model.trim="rowData.productName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="授信方式">
                <el-input v-model.trim="rowData.creditType" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="产品档位">
                <el-input v-model.trim="rowData.grade" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>


      <div class="info-form-content">
        <div class="content-label">借款信息</div>
        <el-row class="content-detail">
          <el-form :inline="true" label-width='100px' label-position="left" size="mini">
            <el-col :span="9">
              <el-form-item label="贷款金额">
                <el-input v-model.trim="rowData.applyAmount" suffix-icon="el-icon-rmb" readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="贷款期限">
                <el-input v-model.trim="rowData.period" suffix-icon="el-icon-stage" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="月基本还款额">
                <el-input v-model.trim="rowData.monthRepaymentAmountBasic" suffix-icon="el-icon-rmb" readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="月还款金额">
                <el-input v-model.trim="rowData.monthRepaymentAmount" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="放款金额">
                <el-input v-model.trim="rowData.loanAmount" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <div class="info-form-content" v-if='rowData.fees&&rowData.fees.length>0'>
        <div class="content-label">费用信息</div>
        <el-form class="content-detail" :inline="true" label-width="100px" label-position="left" size="mini">
          <el-row v-for="(item,index) in rowData.fees" :key="index">
            <el-col :span="24" v-if="item.display=='01'||item.display=='02'">
              <el-form-item :label="item.termName">
                <el-input v-model.trim="item.amount" suffix-icon="el-icon-rmb" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="info">
      <div class="info-title">银行卡信息</div>
      <div v-show="$route.query.phaseName=='未结清合同'">
        <el-button type="primary" @click='viewChangeRecords'>查看变更记录</el-button>
      </div>
      <div class="info-form-content">
        <div class="content-label">银行卡信息</div>
        <el-row class="content-detail">
          <el-form :inline="true" label-width='95px' label-position="left" size="mini">
            <el-col :span="9">
              <el-form-item label="所属银行">
                <el-input v-model.trim="rowData.customerBank" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="开户城市">
                <el-input v-model.trim="rowData.customerBankProvinceCity" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="开户支行">
                <el-input v-model.trim="rowData.customerBranch" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="银行卡号">
                <el-input v-model.trim="rowData.customerBankNo" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="预留手机号">
                <el-input v-model.trim="rowData.customerBankPhone" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <!-- 查看变更记录 -->
      <ChangeRecords :isShowModal='isShowModal' m_title="查看变更记录" :serialNo='serialNo'></ChangeRecords>
    </div>
  </div>
</template>

<script>
  import ChangeRecords from "../changeRecords/index.vue";
  export default {
    props: {
      rowData: {
        type: Object
      },
      serialNo: {
        type: String,
      },
    },
    data() {
      return {
        isShowModal: false,
      };
    },
    mounted() {},

    components: {
      ChangeRecords
    },
    methods: {
      viewChangeRecords() {
        this.isShowModal = !this.isShowModal;
      }
    }
  };
</script>

<style scoped lang="scss">
  /* /deep/ .el-form-item__label {
        width: 100px;
    }

    /deep/ .el-input__inner {
        width: 190px;
    }

    .company-info {
        .content-label {
            position: relative;
            height: 85px !important;
            letter-spacing: 5px !important;
        }

        /deep/ .el-input__inner {
            width: 250px;
        }
    } */


  .info {
    padding: 20px;
    position: relative;
    margin-top: 20px;
    border: solid #ddd 1px;
    min-height: 200px;
    display: flex;
    flex-wrap: wrap;

    .info-title {
      padding: 0 10px;
      text-align: center;
      background: white;
      color: black;
      position: absolute;
      left: 40px;
      top: -15px;
      // transform: translateY(-50%);
    }

    .info-form-content {
      display: flex;
      margin-top: 20px;
      border-bottom: solid rgb(245, 245, 245) 4px;
      padding-bottom: 20px;
      width: 100%;

      .content-label {
        position: relative;
        width: 32px;
        padding-top: 6px;
        padding-left: 10px;
        margin-right: 20px;
        writing-mode: vertical-lr;
        text-align: center;
        letter-spacing: 10px;
        box-shadow: 0 0 2px #bbb;
      }

      .content-detail {
        flex: 1;
      }
    }
  }

  .content-label::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background-color: rgb(108, 172, 244);
  }
</style>