<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">重置密码</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left"
        class="ms-content">
        <el-form-item prop="userLoginAccount" label='登录账号'>
          <el-input v-model.trim="ruleForm.userLoginAccount" placeholder="请输入账号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label='旧密码'>
          <el-input placeholder="请输入旧密码" type="password" show-password v-model.trim="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label='新密码'>
          <el-input placeholder="请输入新密码" type="password" show-password v-model.trim="ruleForm.newPassword"
            @keyup.enter.native="submitForm('ruleForm')">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  import {
    userRegister,
    changePwd
  } from "@/axios/api";
  export default {
    data: function () {
      return {
        ruleForm: {
          userLoginAccount: "", //账号
          password: "", //密码
          newPassword: "", //新密码
        },
        rules: {
          userLoginAccount: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }],
          newPassword: [{
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          }, {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, vm.ruleForm)
            params.password = vm.$md5(params.password)
            params.newPassword = vm.$md5(params.newPassword)
            changePwd(params)
              .then(res => {
                if (res.code == 200) {
                  vm.$message.success("密码修改成功,请重新登录");
                  setTimeout(() => {
                    vm.$router.push("/login");
                  }, 500);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            console.log('error submit!!');
          }
        })
      }
    }
  };
</script>

<style scoped lang="scss">
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../../assets/img/login-bg.png) bottom no-repeat;
    background-size: cover;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 75%;
    top: 60%;
    /* transform: translate(-50%,-50%); */
    width: 380px;
    margin: -190px 0 0 -190px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;

  }

  .ms-content {
    padding: 20px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn .el-button+.el-button {
    margin-left: 0;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }
</style>