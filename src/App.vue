<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    mounted() {
      // 开启监听游览器刷新
      window.addEventListener('unload', this.saveState)

      // 设置localStorage的过期时间
      let beginTime = 0; //执行onbeforeunload的开始时间
      let differTime = 0; //时间差
      window.onunload = function () {
        differTime = new Date().getTime() - beginTime;
        if (differTime <= 6) {
          console.log("浏览器关闭");
          window.localStorage.clear();
        } else {
          console.log("浏览器刷新")
        }
      };
      window.onbeforeunload = function () {
        beginTime = new Date().getTime();
        console.log(beginTime);
      };

    },
    beforeDestroy() {
      window.sessionStorage.clear()
    },
    methods: {
      saveState() {
        sessionStorage.setItem('state', JSON.stringify(this.$store.state))
      },
    },
  };
</script>
<style>
  @import "./assets/css/main.css";
  @import "./assets/css/color-dark.css";
  /*深色主题*/
  /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>