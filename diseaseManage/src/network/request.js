import axios from 'axios'
import ElementUI from 'element-ui'
import router from '@/router'
import store from '@/store'

const request1 = axios.create({
    baseURL: "http://localhost:8081",
    timeout: 5000
})


// 创建axios实例
const request2 = axios.create({
    baseURL:"http://httpbin.org/get",
    timeout:5000
})

//前置拦截
request1.interceptors.request.use(config => {

    //如果存在token，请求携带token
    if (window.sessionStorage.getItem('tokenStr')) {
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    }
    return config;
    
})

//后置拦截
request1.interceptors.response.use(response => {

    //调到接口了
    if(response.status && response.status == 200){
        
        //业务逻辑错误
        if(response.data.code == 402 || response.data.code == 408 || 
            response.data.code == 405 || response.data.code == 410 || response.data.code == 411 || response.data.code == 412){
            ElementUI.Message.error(response.data.message,{duration:2*1000})
            return;
        }
        if(response.data.message){
            ElementUI.Message.success({message:response.data.message})
        }
    }
    return response.data;

},error => {

    if (error.response.code == 504 || error.response.code == 404){
        ElementUI.Message.error({message:'服务器被吃了/(ㄒoㄒ)/~~'})
    }else if (error.response.code == 403) {
        ElementUI.Message.error({message:'权限不足，请联系管理员'})
    }else if(error.response.code === 401) {
        store.commit("removeTokenAndInfo")
        router.push("/login")
        ElementUI.Message.error("请先登录",{duration:2*1000})
    }else {
        if (error.response.data.message) {
            ElementUI.Message.error(error.response.data.message,{duration:2*1000})
        }else {
            ElementUI.Message.error('未知错误',{duration:2*1000})
        }
    }

    return;  //阻止继续执行
    
})

export {
    request1,request2
}