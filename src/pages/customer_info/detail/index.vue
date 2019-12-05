<template>
  <div class="container">
    <div class="title_box">客户 - {{customerId}}</div>
    <el-tabs v-model.trim="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="客户信息" name="first">
        <customer-info :customerId='customerId'></customer-info>
      </el-tab-pane>
      <el-tab-pane label="联系人信息" name="second">
        <contactor-info :customerId='customerId'></contactor-info>
      </el-tab-pane>
      <el-tab-pane label="变更记录" name="Three">
        <ChangeRecord :customerId='customerId'></ChangeRecord>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CustomerInfo from "./customer_info";
  import ContactorInfo from "./contactor_info";
  import ChangeRecord from "./change_record";
  export default {
    name: 'customer_info_detail',
    components: {
      CustomerInfo,
      ContactorInfo,
      ChangeRecord
    },

    data() {
      return {
        activeName: "first",
        customerId: null
      };
    },
    created() {
      this.customerId = this.$route.query.customerId
      console.log(this.$route.query.customerId)
    },
    methods: {
      handleClick(row) {
        console.log(row);
      }
    },

  };
</script>



<style lang="scss" scoped>
  .title_box {
    margin-bottom: 6px;
  }
</style>