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
    return config;
})

//后置拦截
request1.interceptors.response.use(response => {

    //let res = response.data;

    console.log(response);

    // if(res.code == 200){
    //     return response;
    // }else{
    //     ElementUI.Message.error(res.message,{duration:2*1000})
    //     return Promise.reject(response.data.message);
    // }
    return response;

},error => {
    if(error.response.data){
        error.message = error.response.data;
    }

    //返回401错误表示需要先登录采用操作
    if(error.response.status === 401) {
        store.commit("removeTokenAndInfo")
        router.push("/login")
        ElementUI.Message.error("请先登录",{duration:2*1000})
    }

    ElementUI.Message.error(error.message,{duration:2*1000})
    return Promise.reject(error);  //阻止继续执行
})

export {
    request1,request2
}