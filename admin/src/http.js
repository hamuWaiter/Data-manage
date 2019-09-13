import axios from "axios"
import { promises } from "fs";
import router from "./router"

import Vue from "vue"
const http = axios.create({
    baseURL:"http://localhost:3000/admin/api"
})

// 发请求时将客服端token也发过去
http.interceptors.request.use(function (config) {
    // 发送 token给服务器
    if(localStorage.token){
        config.headers.Authorization = "Bearer " + localStorage.token
    }
    
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });



// 响应拦截器：(全局捕获请求异常)当请求数据出错时

http.interceptors.response.use(res=>{
    // 请求成功操作

    return res
},err=>{
    // 请求失败操作
    // 通过err.response.data.message可以得到服务端请求错误后返回的错误信息
    if(err.response.data.message){
            
    // 弹出错误框以及错误信息(elementUI提供的组件)        
        Vue.prototype.$message({
            type: "error",
            message: err.response.data.message
        })
    }

    if(err.response.status == 401){
        router.push("/login")
    }

    // console.log(err.response.data.message)
    return promises.reject(err)
})


export default http