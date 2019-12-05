<template>
  <div>
    <div class="info">

      <div class="info-title">客户信息</div>
      <div class="info-form-content">
        <div class="content-label">个人信息</div>
        <el-row>
          <el-form size="mini" :inline="true" label-width="100px" label-position="left">
            <el-col :span="8">
              <el-form-item label="姓名" label-width="80px">
                <el-input v-model.trim="customerInfo.customerName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号码">
                <el-input v-model.trim="customerInfo.certId" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证有效期">
                <el-input readonly v-model.trim="customerInfo.limitTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" label-width="80px">
                <el-input :value="customerInfo.sex|sexFilter" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期">
                <el-input v-model.trim="customerInfo.birthday" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄">
                <el-input v-model.trim="customerInfo.age" readonly></el-input>
              </el-form-item><span style="font-size: 12px;color: #606266;line-height: 28px;">岁</span>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族" label-width="80px">
                <el-input :value="customerInfo.nationality|nationalityFilter" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况">
                <el-input :value="customerInfo.marriage|marriageFilter" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证地址">
                <el-input v-model.trim="customerInfo.nativePlace" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学历" label-width="80px">
                <!-- <el-input v-model.trim='customerInfo.eduExperience' readonly> -->
                <el-input :value="customerInfo.eduExperience|educationExperienceFilter" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码">
                <el-input v-model.trim="customerInfo.mobileTelePhone" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电子邮箱">
                <el-input v-model.trim="customerInfo.email" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>

    <div class="info">
      <div class="info-title">配偶信息</div>
      <div class="info-form-content">
        <div class="content-label">配偶信息</div>
        <el-row>
          <el-form :inline="true" label-position="left" label-width="90px">
            <el-col :span="8">
              <el-form-item label="姓名">
                <el-input v-model.trim="customerInfo.spouseName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号码">
                <el-input v-model.trim="customerInfo.spouseCertId" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码">
                <el-input v-model.trim="customerInfo.spouseTel" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司名称">
                <el-input v-model.trim="customerInfo.spouseWorkCorp" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司地址">
                <el-input  v-model.trim="customerInfo.spouseWorkAddDetail"  style="width: 200%;"   readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>

    <div class="info">
      <div class="info-title">单位信息</div>
      <div class="info-form-content company-info">
        <div class="content-label">单位信息</div>
        <el-row>
          <el-form :inline="true" label-position="left">
            <el-col :span="8">
              <el-form-item label="公司名称">
                <el-input v-model.trim="customerInfo.workCorp" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务">
                <el-input :value="customerInfo.position|PositionFilter" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司电话">
                <el-input v-model.trim="customerInfo.workTel" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司地址">
                <el-input v-model.trim="customerInfo.workAddDetail"  style="width: 200%;"   readonly></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getCustomerInfoById
  } from "@/axios/api";

  export default {
    props: {
      customerId: {
        type: String
      }
    },
    data() {
      return {
        rowData: {},
        customerInfo: {}
      };
    },
    created() {
      this.getCustomerInfo();
    },
    mounted() {
      // this.rowData = JSON.parse(this.$route.query.params);
    },

    methods: {
      getCustomerInfo() {
        getCustomerInfoById({
            customerId: this.customerId
          })
          .then(res => {
            this.customerInfo = res.data;
            if (
              this.customerInfo.certEffectiveStartTime &&
              this.customerInfo.certEffectiveEndTime
            ) {
              this.customerInfo.limitTime =
                `${this.customerInfo.certEffectiveStartTime} - ${this.customerInfo.certEffectiveEndTime}`;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
</script>

<style scoped lang="scss">
  .info {
    padding: 20px;
    position: relative;
    margin-top: 20px;
    border: solid #ddd 1px;
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
        letter-spacing: 8px;
        box-shadow: 0 0 2px #bbb;
        /* overflow: hidden; */

        .label-hint {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background-color: rgb(108, 172, 244);
        }
      }

      .content-detail {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
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