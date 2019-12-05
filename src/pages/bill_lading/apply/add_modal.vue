<template>
  <div>
    <el-dialog title="创建订单" :visible.sync="isShowModal" :before-close="modalClose" width="700px">
      <div class="customer-info">
        <el-form label-position="left" :model="submitData" :rules="rules" ref="submitData" label-width="150px"
          class="form">
          <el-form-item label="客户名称" prop="customername">
            <el-input v-model.trim="submitData.customername" @change='valueChange' clearable></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="certid">
            <el-input v-model.trim="submitData.certid" @change='valueChange' clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="getQuota">获取额度</el-button>
          </el-form-item>

        </el-form>
      </div>

      <div class="limit-info">
        <div>
          <span style="margin-right: 8px">产品名称</span>
          <el-select v-model.trim="projectName" @change='changeQuot' placeholder="请选择产品">
            <el-option v-for='item in quotaList' :key='item.productId' :label="item.productName"
              :value="item.productId"></el-option>
          </el-select>
        </div>
        <table class="table">
          <tr>
            <th>最低额度(元)</th>
            <th>最高额度(元)</th>
          </tr>
          <tr>
            <td>{{selectionQuota.lowprincipal}}</td>
            <td>{{selectionQuota.surplusquota}}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="modalClose">取 消</el-button> -->
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from "../bus";
  import {
    addBasicFee,
    editBasicFee,
    queryProductList,
    queryWhiteList,
    saveFormData
  } from "@/axios/api";
  export default {

    props: {
      isShowModal: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        submitData: {
          customername: "",
          certid: "",
        },
        projectName: null,
        quotaList: [],
        selectionQuota: {},
        rules: {
          customername: [{
            required: true,
            message: '请输入客户姓名',
            trigger: 'blur'
          }],
          certid: [{
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          }],
        }
      };
    },

    mounted() {

    },
    watch: {},

    methods: {
      //新增提交
      submit() {
        this.modalClose();
      },
      //编辑保存
      save() {
        editBasicFee(this.submitData).then(res => {
          this.modalClose()
        })
      },
      // 获取额度
      getQuota() {

        const _this = this;

        this.$refs.submitData.validate((valid) => {
          if (valid) {
            queryProductList(this.submitData).then(res => {
              console.log(res, 11)
              this.quotaList = res.data;
              this.projectName = ''
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 
      valueChange(res) {
        this.projectName = '';
        this.quotaList = []
      },
      // 
      async nextStep() {
        if (!this.projectName) {
          this.$message.warning('请先选择产品')
          return
        }
        let p1, p2;
        // 验证白名单成功
        p1 = await queryWhiteList(this.submitData);

        let params = Object.assign({}, this.selectionQuota, {
          isAgent: 1,
          customerCertId: this.submitData.certid,
          customerName: this.submitData.customername,
          accountStatus: this.selectionQuota.accountstatus,
          customerId: this.selectionQuota.customerid,
        })
        // 创建合同号
        p2 = await saveFormData(params)

        Promise.all([p1, p2]).then(res => {
          this.modalClose();
          this.$router.push({
            path: 'bill_lading_edit_order',
            query: {
              'customername': this.submitData.customername,
              'certid': this.submitData.certid,
              "versionId": this.selectionQuota.versionId,
              "productId": this.selectionQuota.productId,
              "contractNo": res[1].data.serialNo, //返回合同号
            }
          })
        }).catch(value => {
          console.log(value, 333)
        })
      },
      changeQuot(res) {
        this.selectionQuota = this.quotaList.find(value => {
          return value.productId == res
        }) || {}
        console.log(this.selectionQuota, 987)
      },
      modalClose() {
        bus.$emit("apply:createOrder", false); // 直接修改父组件的属性
        bus.$emit("apply:createOrder", false);
      }
    }
  };
</script>


<style scoped lang="scss">
  .customer-info {
    border: solid #bbb 1px;
    min-height: 100px;
    position: relative;

    &::before {
      position: absolute;
      top: 0;
      left: 20px;
      color: #101010;
      font-weight: 700;
      content: "客户信息";
      padding: 10px;
      background: white;
      transform: translateY(-50%);
    }

    .form {
      margin: 20px;
    }
  }

  .limit-info {
    margin-top: 20px;
    border: solid #bbb 1px;
    min-height: 100px;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;

    &::before {
      position: absolute;
      top: 0;
      left: 20px;
      color: #101010;
      font-weight: 700;
      content: "额度信息";
      padding: 10px;
      background: white;
      transform: translateY(-50%);
    }

    .table {
      margin: 20px;
      border: solid #bbb 1px;
      border-collapse: collapse;

      tr {
        border: solid #bbb 1px !important;
      }

      tr:nth-child(1) {
        background-color: #f5f5f9;
      }

      th {
        width: 100px;
        height: 30px;
      }



      td {
        text-align: center;
        width: 100px;
        height: 50px;
      }
    }
  }
</style>