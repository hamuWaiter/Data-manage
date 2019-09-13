import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import router from './router.js'

import http from "./http"  //引入axios请求数据接口
Vue.prototype.$http = http  //在任意页面通过this.$http去访问数据请求接口

// 在全局注册mixin来保存公共的代码块，如获取本地token
Vue.mixin({
  methods:{
    getAuthorization(){
      return {
        Authorization: "Bearer "+ localStorage.token
      }
    }
  }
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
