import axios from 'axios'
import ElementUI from 'element-ui'
import router from './router'
import store from './store'


//前置拦截
axios.interceptors.request.use(config => {
    return config;
})

//后置拦截
axios.interceptors.response.use(response => {

    console.log("===============");
    ElementUI.Message.error("请先登录",{duration:2*1000})
    return response;

},error => {
    if(error.response.data){
        error.message = error.response.data;
    }

    //返回401错误表示需要先登录采用操作
    if(error.response.status === 401) {
        store.commit("removeTokenAndInfo")
        router.push("/Login")
        ElementUI.Message.error("请先登录",{duration:2*1000})
    }

    ElementUI.Message.error(error.message,{duration:2*1000})
    return Promise.reject(error);  //阻止继续执行
})