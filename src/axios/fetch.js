import Vue from 'vue'
import axios from 'axios'; //引入axios
import {
  Message,
  Loading
} from "element-ui";
import store from '../store'
import router from "@/router/index";

import {
  baseURL_M,
  baseURL
} from "./baseURL";

let Time, loadingInstance, setMessage;

export function fetch(options, errofun) {

  if (options.isToken === undefined) {
    options.isToken = true;
  }
  if (options.isLoading === undefined) {
    options.isLoading = true;
  }

  //网络请求loading展示

  if (!store.state.isLoading && options.isLoading) {
    loadingInstance = Loading.service({
      // target: document.querySelector(".content") || document.body,
      target: document.body,
      text: '拼命加载中...',
      background: 'rgba(0, 0, 0, 0.2)',
    });
    Time = new Date()
    store.dispatch('setChangeLoading', true)
  } else {
    options.isLoading = false
  }

  return new Promise((resolve, reject) => {
    const instance = axios.create({ //instance创建一个axios实例，可以自定义配置，可在 axios文档中查看详情
      //所有的请求都会带上这些配置，比如全局都要用的身份信息等。
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30 * 1000, // 30秒超时
      baseURL: options.isMobileService ? baseURL_M : baseURL
    });

    //默认加上token
    instance.interceptors.request.use(function (config) {
      if (options.isToken) {
        config.headers['accessToken'] = localStorage.getItem("accessToken");
      }
      // 在发送请求之前做些什么
      return config;
    }, function (error) {
      return reject(error);
    });

    // 返回拦截器

    instance(options).then(response => { //then 请求成功之后进行什么操作
        //toKen失效时跳转登录页面
        if (response.data && response.data.code == "9986") {
          router.push({
            path: '/login'
          })
          if (setMessage !== 'token已失效') {
            Message.warning('超时请重新登录');
            setMessage = 'token已失效';
          }
          return reject(new Error('toKen失效'));
        }

        if (options.skipValidate) {
          return resolve(response);
        } else if (response.data && response.data.code == 200) {
          setMessage = '成功';
          return resolve(response.data); //把请求到的数据发到引用请求的地方
        } else {
          setMessage = response.data && response.data.msg || '链接失败，请联系管理员';
          Message.error(setMessage);
          return reject(response.data);
        }
      })
      .catch(error => {

        if (error.response && error.response.status && error.response.status == 401) {
          Message.error(error.response.data.message || "请求错误");
        } else if (error.message.includes('timeout')) {
          Message.error('链接超时，请联系管理员')
        } else {
          Message.error(error.response && error.response.data.error || "链接失败，请联系管理员");
        }
        return reject(new Error('链接失败，请联系管理员'));

      }).finally(value => {
        store.dispatch('setChangeLoading', false)
        if ((new Date() - Time) && (new Date() - Time) < 300) {
          setTimeout(() => {
            options.isLoading && loadingInstance.close(); //请求完成loading隐藏
          }, 300);
        } else {
          options.isLoading && loadingInstance.close(); //请求完成loading隐藏
        }
      });
  });
}