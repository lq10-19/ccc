<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">消费分期系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="userLoginAccount">
          <el-input v-model.trim="ruleForm.userLoginAccount" placeholder="请输入账号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model.trim="ruleForm.password" show-password
            @keyup.enter.native="submitForm">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="validateCode">
          <div class="code-wrapper">
            <img class="code-img" slot="prepend" @click="codeClick" :src="'data:image/jpeg;base64,'+ codeSrc" />
            <el-input @keyup.enter.native="submitForm" v-model.trim="ruleForm.validateCode" placeholder="请输入验证码">
            </el-input>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    Loading
  } from "element-ui";
  import {
    getMenu,
    login,
    getVerifyCode
  } from "@/axios/api";
  import {
    baseURL
  } from "@/axios/baseURL";
  import {
    debounce,
    resetObj
  } from "@/lib/util";
  export default {
    data: function () {
      return {
        ruleForm: {
          userLoginAccount: "",
          password: "",
          validateCodeUUID: "", //验证码UUID
          validateCode: ""
          // code:""
        },
        rules: {
          userLoginAccount: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          validateCode: [{
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }]
        },
        codeSrc: ""
      };
    },
    created() {
      // 获取验证码
      this.getVerifyCode();
    },
    methods: {
      //点击验证码
      codeClick() {
        debounce(this.getVerifyCode, 500);
      },
      //获取验证码
      getVerifyCode() {
        getVerifyCode().then(res => {
          this.codeSrc = res.data.image;
          this.ruleForm.validateCodeUUID = res.data.validateCodeUUID;
        });
      },

      //注册页面暂时不需要隐藏了
      toRegister() {
        this.$router.push("/register");
      },

      reset() {
        resetObj(this.ruleForm)
      },
      submitForm() {

        let vm = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            vm.ruleForm.validateCode = vm.ruleForm.validateCode.toUpperCase();
            let params = Object.assign({}, vm.ruleForm)
            params.password = vm.$md5(params.password)
            login(params)
              .then(function (res) {
                if (res.code == 200) {
                  let accessToken = res.data.token;
                  sessionStorage.setItem("userId", res.data.userId);

                  vm.$store.commit("setUsername", res.data.userLoginAccount);
                  // 方便多窗口
                  localStorage.setItem("accessToken", accessToken);
                  localStorage.setItem("ms_username", res.data.userLoginAccount);

                  if (vm.ruleForm.password == '123456') {
                    vm.$message.warning('初始密码，请更改后再登录')
                    vm.$router.push("/register");
                  } else {
                    vm.getMenuFu({
                      userId: res.data.userId
                    })
                    vm.$message.success('登录成功')
                    vm.$router.push("/");
                  }
                } else {
                  alert("账号或密码错误");
                }
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                vm.getVerifyCode();
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      getMenuFu(res) {
        getMenu(res).then(res => {
          if (res.code == 200) {
            this.$store.commit("setMenuList", res.data);
          }
        }).catch(error => {
          console.log(error)
        })
      },
      checkForm() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            return true;
          } else {
            return false;
          }
        });
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
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px;
  }

  .login-btn {
    text-align: center;
    display: flex;
    justify-content: space-between;

  }

  /* .login-btn .el-button+.el-button {
  margin-left:0;
} */
  .login-btn button {
    width: 40%;
    height: 36px;
    margin: 10px 0;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }

  .code-wrapper {
    background: white;
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    height: 32px;

    .code-img {
      height: 32px;
      width: 80px;
      cursor: pointer;
    }
  }
</style>