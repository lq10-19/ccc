import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import store from './store'
import {
  messages
} from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import md5 from 'js-md5';
import has from './lib/btnPermission'

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
  }
})

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(contentmenu)

import mixin from './mixin/index'
Vue.mixin(mixin)

Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(ElementUI, {
  size: 'small'
});
Vue.prototype.$axios = axios;
Vue.prototype.$md5 = md5;

const i18n = new VueI18n({
  locale: 'zh',
  messages
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('ms_username');
  if ((!role && to.path !== '/login') && to.path !== '/register') {
    next('/login');
  } else {
    next();
  }
})

// Vue.prototype.$dispatch = function (eventName, data) {
//   // 想上传递，一直不停的获取$parent
//   let parent = this.$parent
//   while (parent) {
//     parent.$emit(eventName, data)
//     parent = parent.$parent
//   }
// }
// Vue.prototype.$broadCast = function (eventName, data) {
//   // 递归通知所有的子元素
//   broadCast.call(this, eventName, data)
// }

// function broadCast(eventName, data) {
//   this.$children.forEach(child => {
//     // 每一个子组件
//     child.$emit(eventName, data)
//     if (child.$children.length) {
//       broadCast.call(child, eventName, data)
//     }
//   })
// }


new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
  beforeDestroy() {
    // window.localStorage.clear()
    // window.sessionStorage.clear()
  }
}).$mount('#app')